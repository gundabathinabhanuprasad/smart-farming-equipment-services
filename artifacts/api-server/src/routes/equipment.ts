import { Router, type IRouter } from "express";
import { db, equipmentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListEquipmentQueryParams,
  GetEquipmentParams,
  ListEquipmentResponse,
  GetEquipmentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/equipment", async (req, res): Promise<void> => {
  const query = ListEquipmentQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let rows = await db.select().from(equipmentTable);

  if (query.data.available !== undefined) {
    rows = rows.filter((e) => e.available === query.data.available);
  }
  if (query.data.category) {
    rows = rows.filter(
      (e) => e.category.toLowerCase() === query.data.category!.toLowerCase(),
    );
  }

  res.json(ListEquipmentResponse.parse(rows));
});

router.get("/equipment/:id", async (req, res): Promise<void> => {
  const params = GetEquipmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [item] = await db
    .select()
    .from(equipmentTable)
    .where(eq(equipmentTable.id, params.data.id));

  if (!item) {
    res.status(404).json({ error: "Equipment not found" });
    return;
  }

  res.json(GetEquipmentResponse.parse(item));
});

export default router;
