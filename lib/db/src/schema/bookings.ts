import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  farmerName: text("farmer_name").notNull(),
  farmerPhone: text("farmer_phone").notNull(),
  village: text("village").notNull(),
  equipmentId: integer("equipment_id").notNull(),
  equipmentName: text("equipment_name"),
  slotDate: text("slot_date").notNull(),
  slotTime: text("slot_time").notNull(),
  durationHours: integer("duration_hours").notNull(),
  status: text("status").notNull().default("confirmed"),
  totalAmount: real("total_amount").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
