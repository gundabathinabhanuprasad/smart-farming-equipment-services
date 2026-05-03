import { Router, type IRouter, type Request } from "express";
import { db, driversTable, driverBookingsTable, usersTable } from "@workspace/db";
import { eq, desc, and, isNull } from "drizzle-orm";
import { verifyToken, requireRole, type JwtPayload } from "../middleware/auth";

const router: IRouter = Router();

type AuthReq = Request & { user: JwtPayload };

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.get("/drivers", async (req, res): Promise<void> => {
  const { lat, lng, radius, village, district } = req.query as {
    lat?: string; lng?: string; radius?: string;
    village?: string; district?: string;
  };

  const rows = await db.select({
    id: driversTable.id,
    userId: driversTable.userId,
    experience: driversTable.experience,
    pricePerHour: driversTable.pricePerHour,
    available: driversTable.available,
    village: driversTable.village,
    district: driversTable.district,
    state: driversTable.state,
    rating: driversTable.rating,
    totalBookings: driversTable.totalBookings,
    bio: driversTable.bio,
    avatarUrl: driversTable.avatarUrl,
    locationLat: driversTable.locationLat,
    locationLng: driversTable.locationLng,
    userName: usersTable.name,
    userPhone: usersTable.phone,
  }).from(driversTable)
    .leftJoin(usersTable, eq(driversTable.userId, usersTable.id))
    .where(eq(driversTable.available, true))
    .orderBy(desc(driversTable.rating));

  let filtered = rows;

  if (lat && lng) {
    const rKm = Number(radius ?? "20");
    filtered = filtered.filter(d =>
      d.locationLat != null && d.locationLng != null &&
      haversineKm(Number(lat), Number(lng), d.locationLat!, d.locationLng!) <= rKm
    );
  } else if (village) {
    const v = village.toLowerCase();
    filtered = filtered.filter(d =>
      d.village?.toLowerCase().includes(v) || d.district?.toLowerCase().includes(v)
    );
  } else if (district) {
    const dist = district.toLowerCase();
    filtered = filtered.filter(d => d.district?.toLowerCase().includes(dist));
  }

  res.json(filtered);
});

router.post("/driver/profile", verifyToken, requireRole("driver", "admin"), async (req, res): Promise<void> => {
  const userId = (req as unknown as AuthReq).user.id;
  const { experience, pricePerHour, village, district, state, locationLat, locationLng, bio, avatarUrl } = req.body as {
    experience: number; pricePerHour: number;
    village?: string; district?: string; state?: string;
    locationLat?: number; locationLng?: number; bio?: string; avatarUrl?: string;
  };

  const [existing] = await db.select().from(driversTable).where(eq(driversTable.userId, userId));
  if (existing) {
    const [updated] = await db.update(driversTable).set({
      experience, pricePerHour,
      village: village ?? null, district: district ?? null, state: state ?? null,
      locationLat: locationLat ?? null, locationLng: locationLng ?? null,
      bio: bio ?? null, avatarUrl: avatarUrl ?? null,
    }).where(eq(driversTable.userId, userId)).returning();
    res.json(updated);
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  const [driver] = await db.insert(driversTable).values({
    userId, experience, pricePerHour,
    village: village ?? user?.village ?? null,
    district: district ?? user?.district ?? null,
    state: state ?? user?.state ?? null,
    locationLat: locationLat ?? user?.locationLat ?? null,
    locationLng: locationLng ?? user?.locationLng ?? null,
    bio: bio ?? null, avatarUrl: avatarUrl ?? null,
    available: true, rating: 0, totalBookings: 0,
  }).returning();
  res.status(201).json(driver);
});

router.get("/driver/profile", verifyToken, requireRole("driver", "admin"), async (req, res): Promise<void> => {
  const userId = (req as unknown as AuthReq).user.id;
  const [driver] = await db.select().from(driversTable).where(eq(driversTable.userId, userId));
  if (!driver) { res.status(404).json({ error: "Driver profile not found" }); return; }
  res.json(driver);
});

router.patch("/driver/availability", verifyToken, requireRole("driver", "admin"), async (req, res): Promise<void> => {
  const userId = (req as unknown as AuthReq).user.id;
  const { available } = req.body as { available: boolean };
  const [updated] = await db.update(driversTable)
    .set({ available })
    .where(eq(driversTable.userId, userId))
    .returning();
  if (!updated) { res.status(404).json({ error: "Driver profile not found" }); return; }
  res.json(updated);
});

router.get("/driver/bookings", verifyToken, requireRole("driver", "admin"), async (req, res): Promise<void> => {
  const userId = (req as unknown as AuthReq).user.id;
  const [driver] = await db.select().from(driversTable).where(eq(driversTable.userId, userId));
  if (!driver) { res.json([]); return; }

  const assigned = await db.select().from(driverBookingsTable)
    .where(eq(driverBookingsTable.driverId, driver.id))
    .orderBy(desc(driverBookingsTable.createdAt));

  const broadcast = await db.select().from(driverBookingsTable)
    .where(and(eq(driverBookingsTable.status, "pending"), isNull(driverBookingsTable.driverId)))
    .orderBy(desc(driverBookingsTable.createdAt));

  const nearbyBroadcast = driver.village
    ? broadcast.filter(b =>
        b.village?.toLowerCase() === driver.village?.toLowerCase() ||
        (driver.locationLat && driver.locationLng && b.farmerLat && b.farmerLng &&
          haversineKm(driver.locationLat, driver.locationLng, b.farmerLat, b.farmerLng) <= 20)
      )
    : broadcast;

  res.json({ assigned, broadcast: nearbyBroadcast });
});

router.patch("/driver/bookings/:id/status", verifyToken, requireRole("driver", "admin"), async (req, res): Promise<void> => {
  const userId = (req as unknown as AuthReq).user.id;
  const id = Number(req.params["id"]);
  const { status } = req.body as { status: string };

  const [driver] = await db.select().from(driversTable).where(eq(driversTable.userId, userId));
  if (!driver) { res.status(404).json({ error: "Driver profile not found" }); return; }

  const [booking] = await db.select().from(driverBookingsTable).where(eq(driverBookingsTable.id, id));
  if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }

  if (booking.status !== "pending" && booking.driverId !== driver.id) {
    res.status(409).json({ error: "Booking already accepted by another driver" }); return;
  }

  const updates: Partial<{ status: string; driverId: number }> = { status };
  if (status === "confirmed") {
    updates.driverId = driver.id;
    await db.update(driversTable)
      .set({ totalBookings: driver.totalBookings + 1 })
      .where(eq(driversTable.id, driver.id));
  }

  const [updated] = await db.update(driverBookingsTable)
    .set(updates)
    .where(eq(driverBookingsTable.id, id))
    .returning();
  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

export default router;
