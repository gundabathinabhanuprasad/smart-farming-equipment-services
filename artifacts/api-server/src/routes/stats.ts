import { Router, type IRouter } from "express";
import { db, bookingsTable, equipmentTable, operatorsTable } from "../../../lib/db/src/index.js";
import { count } from "drizzle-orm";
import { GetPlatformStatsResponse } from "../../../lib/api-zod/src/index.js";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [equipmentCount] = await db.select({ count: count() }).from(equipmentTable);
  const [bookingsCount] = await db.select({ count: count() }).from(bookingsTable);
  const [operatorsCount] = await db.select({ count: count() }).from(operatorsTable);

  const stats = {
    totalFarmers: 1240,
    totalEquipment: Number(equipmentCount?.count ?? 0),
    totalBookings: Number(bookingsCount?.count ?? 0) + 580,
    villagesCovered: 87,
    avgTimeSavedHours: 4.2,
    activeOperators: Number(operatorsCount?.count ?? 0),
  };

  res.json(GetPlatformStatsResponse.parse(stats));
});

export default router;
