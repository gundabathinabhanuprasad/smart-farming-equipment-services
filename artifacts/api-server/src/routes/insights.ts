import { Router, type IRouter } from "express";
import { db, insightsTable } from "../../../lib/db/src/index.js";
import { ListInsightsResponse } from "../../../lib/api-zod/src/index.js";

const router: IRouter = Router();

router.get("/insights", async (_req, res): Promise<void> => {
  const rows = await db.select().from(insightsTable);
  res.json(ListInsightsResponse.parse(rows));
});

export default router;
