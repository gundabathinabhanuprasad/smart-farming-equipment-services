import { Router, type IRouter } from "express";
import { db, testimonialsTable } from "../../../lib/db/src/index.js";
import { ListTestimonialsResponse } from "../../../lib/api-zod/src/index.js";

const router: IRouter = Router();

router.get("/testimonials", async (_req, res): Promise<void> => {
  const rows = await db.select().from(testimonialsTable);
  res.json(ListTestimonialsResponse.parse(rows));
});

export default router;
