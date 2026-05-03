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

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.get("/equipment", async (req, res): Promise<void> => {
  const { lat, lng, radius, village, district } = req.query as {
    lat?: string; lng?: string; radius?: string;
    village?: string; district?: string;
  };

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

  if (lat && lng) {
    const rKm = Number(radius ?? "20");
    rows = rows.filter(e =>
      e.locationLat != null && e.locationLng != null &&
      haversineKm(Number(lat), Number(lng), e.locationLat!, e.locationLng!) <= rKm
    );
  } else if (village) {
    const v = village.toLowerCase();
    rows = rows.filter(e =>
      e.village?.toLowerCase().includes(v) ||
      e.district?.toLowerCase().includes(v)
    );
  } else if (district) {
    const d = district.toLowerCase();
    rows = rows.filter(e => e.district?.toLowerCase().includes(d));
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
