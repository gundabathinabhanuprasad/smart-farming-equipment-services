import { Router, type IRouter } from "express";
import { db, usersTable, equipmentTable, bookingsTable, driversTable, driverBookingsTable } from "@workspace/db";
import { eq, count, desc } from "drizzle-orm";
import { verifyToken, requireRole } from "../middleware/auth";

const router: IRouter = Router();

router.use("/admin", verifyToken, requireRole("admin"));

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [userCounts] = await db.select({ total: count() }).from(usersTable);
  const [equipCount] = await db.select({ total: count() }).from(equipmentTable);
  const [bookingCount] = await db.select({ total: count() }).from(bookingsTable);
  const [driverCount] = await db.select({ total: count() }).from(driversTable);
  const [driverBookingCount] = await db.select({ total: count() }).from(driverBookingsTable);

  const ownerUsers = await db.select({ total: count() }).from(usersTable).where(eq(usersTable.role, "owner"));
  const driverUsers = await db.select({ total: count() }).from(usersTable).where(eq(usersTable.role, "driver"));
  const farmerUsers = await db.select({ total: count() }).from(usersTable).where(eq(usersTable.role, "farmer"));

  res.json({
    totalUsers: userCounts?.total ?? 0,
    totalFarmers: farmerUsers[0]?.total ?? 0,
    totalOwners: ownerUsers[0]?.total ?? 0,
    totalDrivers: driverUsers[0]?.total ?? 0,
    totalEquipment: equipCount?.total ?? 0,
    totalBookings: (bookingCount?.total ?? 0) + (driverBookingCount?.total ?? 0),
    equipmentBookings: bookingCount?.total ?? 0,
    driverBookings: driverBookingCount?.total ?? 0,
    registeredDrivers: driverCount?.total ?? 0,
  });
});

router.get("/admin/users", async (_req, res): Promise<void> => {
  const users = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    phone: usersTable.phone,
    role: usersTable.role,
    village: usersTable.village,
    district: usersTable.district,
    state: usersTable.state,
    status: usersTable.status,
    createdAt: usersTable.createdAt,
  }).from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(users);
});

router.patch("/admin/users/:id", async (req, res): Promise<void> => {
  const id = Number(req.params["id"]);
  const { status, role } = req.body as { status?: string; role?: string };
  const updates: Partial<{ status: string; role: string }> = {};
  if (status) updates.status = status;
  if (role) updates.role = role;
  const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ id: updated.id, name: updated.name, phone: updated.phone, role: updated.role, status: updated.status });
});

router.delete("/admin/users/:id", async (req, res): Promise<void> => {
  const id = Number(req.params["id"]);
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.status(204).send();
});

router.get("/admin/equipment", async (_req, res): Promise<void> => {
  const rows = await db.select().from(equipmentTable).orderBy(desc(equipmentTable.createdAt));
  res.json(rows);
});

router.delete("/admin/equipment/:id", async (req, res): Promise<void> => {
  const id = Number(req.params["id"]);
  await db.delete(equipmentTable).where(eq(equipmentTable.id, id));
  res.status(204).send();
});

router.patch("/admin/equipment/:id", async (req, res): Promise<void> => {
  const id = Number(req.params["id"]);
  const updates = req.body as Partial<{
    name: string; category: string; description: string;
    pricePerHour: number; available: boolean;
  }>;
  const [updated] = await db.update(equipmentTable).set(updates).where(eq(equipmentTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Equipment not found" }); return; }
  res.json(updated);
});

router.get("/admin/drivers", async (_req, res): Promise<void> => {
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
    userName: usersTable.name,
    userPhone: usersTable.phone,
  }).from(driversTable)
    .leftJoin(usersTable, eq(driversTable.userId, usersTable.id))
    .orderBy(desc(driversTable.createdAt));
  res.json(rows);
});

router.get("/admin/bookings", async (_req, res): Promise<void> => {
  const equipment = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
  const driver = await db.select().from(driverBookingsTable).orderBy(desc(driverBookingsTable.createdAt));
  res.json({ equipment, driver });
});

export default router;
