import { Router, type IRouter, type Request } from "express";
import { db, equipmentTable, bookingsTable, usersTable } from "../../../lib/db/src/index.js";
import { eq, desc } from "drizzle-orm";
import { verifyToken, requireRole, type JwtPayload } from "../middleware/auth.js";

const router: IRouter = Router();

type AuthReq = Request & { user: JwtPayload };

router.use("/owner", verifyToken, requireRole("owner", "admin"));

router.get("/owner/equipment", async (req, res): Promise<void> => {
  const ownerId = (req as AuthReq).user.id;
  const rows = await db.select().from(equipmentTable)
    .where(eq(equipmentTable.ownerId, ownerId))
    .orderBy(desc(equipmentTable.createdAt));
  res.json(rows);
});

router.post("/owner/equipment", async (req, res): Promise<void> => {
  const ownerId = (req as AuthReq).user.id;
  const { name, category, description, pricePerHour, pricePerDay, village, district, state, locationLat, locationLng, imageUrl } = req.body as {
    name: string; category: string; description: string;
    pricePerHour: number; pricePerDay: number;
    village?: string; district?: string; state?: string;
    locationLat?: number; locationLng?: number; imageUrl?: string;
  };

  if (!name || !category || !description || !pricePerHour || !pricePerDay) {
    res.status(400).json({ error: "name, category, description, pricePerHour, pricePerDay are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, ownerId));
  const [equipment] = await db.insert(equipmentTable).values({
    name, category, description, pricePerHour, pricePerDay,
    village: village ?? user?.village ?? null,
    district: district ?? user?.district ?? null,
    state: state ?? user?.state ?? null,
    locationLat: locationLat ?? user?.locationLat ?? null,
    locationLng: locationLng ?? user?.locationLng ?? null,
    imageUrl: imageUrl ?? null,
    ownerId,
    operatorName: user?.name ?? null,
    available: true,
    rating: 0,
    totalBookings: 0,
  }).returning();
  res.status(201).json(equipment);
});

router.put("/owner/equipment/:id", async (req, res): Promise<void> => {
  const authReq = req as unknown as AuthReq;
  const ownerId = authReq.user.id;
  const id = Number(req.params["id"]);
  const [existing] = await db.select().from(equipmentTable).where(eq(equipmentTable.id, id));
  if (!existing || (existing.ownerId !== ownerId && authReq.user.role !== "admin")) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }
  const updates = req.body as Partial<{
    name: string; category: string; description: string;
    pricePerHour: number; pricePerDay: number; available: boolean;
    village: string; district: string; state: string;
    locationLat: number; locationLng: number;
  }>;
  const [updated] = await db.update(equipmentTable).set(updates).where(eq(equipmentTable.id, id)).returning();
  res.json(updated);
});

router.delete("/owner/equipment/:id", async (req, res): Promise<void> => {
  const authReq = req as unknown as AuthReq;
  const ownerId = authReq.user.id;
  const id = Number(req.params["id"]);
  const [existing] = await db.select().from(equipmentTable).where(eq(equipmentTable.id, id));
  if (!existing || (existing.ownerId !== ownerId && authReq.user.role !== "admin")) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }
  await db.delete(equipmentTable).where(eq(equipmentTable.id, id));
  res.status(204).send();
});

router.get("/owner/bookings", async (req, res): Promise<void> => {
  const ownerId = (req as unknown as AuthReq).user.id;
  const myEquipment = await db.select({ id: equipmentTable.id })
    .from(equipmentTable).where(eq(equipmentTable.ownerId, ownerId));
  const ids = myEquipment.map(e => e.id);
  if (ids.length === 0) { res.json([]); return; }
  const bookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  res.json(bookings.filter(b => ids.includes(b.equipmentId)));
});

router.patch("/owner/bookings/:id/status", async (req, res): Promise<void> => {
  const authReq = req as unknown as AuthReq;
  const ownerId = authReq.user.id;
  const id = Number(req.params["id"]);
  const { status } = req.body as { status: string };

  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
  if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }

  const [equip] = await db.select().from(equipmentTable).where(eq(equipmentTable.id, booking.equipmentId));
  if (!equip || (equip.ownerId !== ownerId && authReq.user.role !== "admin")) {
    res.status(403).json({ error: "Not authorized" }); return;
  }

  const [updated] = await db.update(bookingsTable)
    .set({ status })
    .where(eq(bookingsTable.id, id))
    .returning();
  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

export default router;
