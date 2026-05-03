import { pgTable, serial, integer, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const driverBookingsTable = pgTable("driver_bookings", {
  id: serial("id").primaryKey(),
  farmerName: text("farmer_name").notNull(),
  farmerPhone: text("farmer_phone").notNull(),
  village: text("village").notNull(),
  farmerId: integer("farmer_id"),
  farmerLat: real("farmer_lat"),
  farmerLng: real("farmer_lng"),
  driverId: integer("driver_id"),
  slotDate: text("slot_date").notNull(),
  slotTime: text("slot_time").notNull(),
  durationHours: integer("duration_hours").notNull(),
  status: text("status").notNull().default("pending"),
  totalAmount: real("total_amount").notNull().default(0),
  notes: text("notes"),
  taskType: text("task_type"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDriverBookingSchema = createInsertSchema(driverBookingsTable).omit({ id: true, createdAt: true });
export type InsertDriverBooking = z.infer<typeof insertDriverBookingSchema>;
export type DriverBooking = typeof driverBookingsTable.$inferSelect;
