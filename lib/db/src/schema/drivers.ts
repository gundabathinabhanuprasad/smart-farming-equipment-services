import { pgTable, serial, integer, text, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const driversTable = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  experience: integer("experience").notNull().default(0),
  pricePerHour: real("price_per_hour").notNull(),
  available: boolean("available").notNull().default(true),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  village: text("village"),
  district: text("district"),
  state: text("state"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  rating: real("rating").notNull().default(0),
  totalBookings: integer("total_bookings").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDriverSchema = createInsertSchema(driversTable).omit({ id: true, createdAt: true });
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof driversTable.$inferSelect;
