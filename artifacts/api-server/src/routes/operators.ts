import { Router, type IRouter } from "express";
import { db, operatorsTable } from "@workspace/db";
import { ListOperatorsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/operators", async (_req, res): Promise<void> => {
  const rows = await db.select().from(operatorsTable);
  res.json(ListOperatorsResponse.parse(rows));
});

export default router;
