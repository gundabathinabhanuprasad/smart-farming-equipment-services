import { Router, type IRouter } from "express";
import { db, insightsTable } from "@workspace/db";
import { ListInsightsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/insights", async (_req, res): Promise<void> => {
  const rows = await db.select().from(insightsTable);
  res.json(ListInsightsResponse.parse(rows));
});

export default router;
