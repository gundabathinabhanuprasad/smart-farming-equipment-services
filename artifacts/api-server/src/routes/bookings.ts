import { Router, type IRouter } from "express";
import { db, bookingsTable, equipmentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateBookingBody,
  GetBookingParams,
  ListBookingsResponse,
  GetBookingResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookings", async (_req, res): Promise<void> => {
  const rows = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
  res.json(
    ListBookingsResponse.parse(
      rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    ),
  );
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [equipment] = await db
    .select()
    .from(equipmentTable)
    .where(eq(equipmentTable.id, parsed.data.equipmentId));

  if (!equipment) {
    res.status(400).json({ error: "Equipment not found" });
    return;
  }

  const totalAmount = equipment.pricePerHour * parsed.data.durationHours;

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      ...parsed.data,
      equipmentName: equipment.name,
      totalAmount,
      status: "confirmed",
    })
    .returning();

  await db
    .update(equipmentTable)
    .set({ totalBookings: (equipment.totalBookings || 0) + 1 })
    .where(eq(equipmentTable.id, equipment.id));

  res.status(201).json(
    GetBookingResponse.parse({ ...booking, createdAt: booking.createdAt.toISOString() }),
  );
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const params = GetBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(
    GetBookingResponse.parse({ ...booking, createdAt: booking.createdAt.toISOString() }),
  );
});

export default router;
