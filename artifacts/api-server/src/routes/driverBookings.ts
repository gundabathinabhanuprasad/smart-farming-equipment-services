import { Router, type IRouter } from "express";
import { db, driverBookingsTable, driversTable } from "../../../lib/db/src/index.js";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/driver-bookings", async (req, res): Promise<void> => {
  const { farmerName, farmerPhone, village, driverId, slotDate, slotTime, durationHours, notes, taskType, farmerLat, farmerLng, farmerId } = req.body as {
    farmerName: string; farmerPhone: string; village: string;
    driverId?: number; slotDate: string; slotTime: string;
    durationHours: number; notes?: string; taskType?: string;
    farmerLat?: number; farmerLng?: number; farmerId?: number;
  };

  if (!farmerName || !farmerPhone || !village || !slotDate || !slotTime || !durationHours) {
    res.status(400).json({ error: "farmerName, farmerPhone, village, slotDate, slotTime, durationHours are required" });
    return;
  }

  let totalAmount = 0;
  let assignedDriverId: number | null = driverId ?? null;
  let status = "pending";

  if (driverId) {
    const [driver] = await db.select().from(driversTable).where(eq(driversTable.id, driverId));
    if (driver) {
      totalAmount = driver.pricePerHour * durationHours;
      status = "pending";
    }
  }

  const [booking] = await db.insert(driverBookingsTable).values({
    farmerName, farmerPhone, village,
    farmerId: farmerId ?? null,
    farmerLat: farmerLat ?? null,
    farmerLng: farmerLng ?? null,
    driverId: assignedDriverId,
    slotDate, slotTime, durationHours,
    status,
    totalAmount,
    notes: notes ?? null,
    taskType: taskType ?? null,
  }).returning();

  res.status(201).json({ ...booking, createdAt: booking.createdAt.toISOString() });
});

router.get("/driver-bookings", async (_req, res): Promise<void> => {
  const bookings = await db.select().from(driverBookingsTable).orderBy(desc(driverBookingsTable.createdAt));
  res.json(bookings.map(b => ({ ...b, createdAt: b.createdAt.toISOString() })));
});

export default router;
