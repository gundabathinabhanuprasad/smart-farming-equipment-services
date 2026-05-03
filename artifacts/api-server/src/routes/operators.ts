import { Router, type IRouter } from "express";
import { db, operatorsTable } from "../../../lib/db/src/index.js";
import { ListOperatorsResponse } from "../../../lib/api-zod/src/index.js";

const router: IRouter = Router();

router.get("/operators", async (_req, res): Promise<void> => {
  const rows = await db.select().from(operatorsTable);
  res.json(ListOperatorsResponse.parse(rows));
});

export default router;
