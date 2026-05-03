import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken } from "../middleware/auth";

const router: IRouter = Router();

router.post("/auth/signup", async (req, res): Promise<void> => {
  const { name, phone, password, role, village, district, state, locationLat, locationLng } = req.body as {
    name: string; phone: string; password: string; role: string;
    village?: string; district?: string; state?: string;
    locationLat?: number; locationLng?: number;
  };

  if (!name || !phone || !password || !role) {
    res.status(400).json({ error: "name, phone, password, role are required" });
    return;
  }

  const validRoles = ["farmer", "owner", "driver"];
  if (!validRoles.includes(role)) {
    res.status(400).json({ error: "role must be farmer, owner, or driver" });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
  if (existing) {
    res.status(409).json({ error: "Phone number already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({
    name, phone, passwordHash, role,
    village: village ?? null,
    district: district ?? null,
    state: state ?? null,
    locationLat: locationLat ?? null,
    locationLng: locationLng ?? null,
    status: "active",
  }).returning();

  const token = signToken({ id: user.id, role: user.role, phone: user.phone });
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role, village: user.village, district: user.district, state: user.state },
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const { phone, password } = req.body as { phone: string; password: string };
  if (!phone || !password) {
    res.status(400).json({ error: "phone and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
  if (!user) {
    res.status(401).json({ error: "Invalid phone or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid phone or password" });
    return;
  }

  if (user.status !== "active") {
    res.status(403).json({ error: "Account is not active" });
    return;
  }

  const token = signToken({ id: user.id, role: user.role, phone: user.phone });
  res.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role, village: user.village, district: user.district, state: user.state },
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const header = req.headers["authorization"];
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = header.slice(7);
  try {
    const { default: jwt } = await import("jsonwebtoken");
    const secret = process.env["SESSION_SECRET"] ?? "khetbook-secret";
    const payload = jwt.verify(token, secret) as { id: number };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.id));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json({ id: user.id, name: user.name, phone: user.phone, role: user.role, village: user.village, district: user.district, state: user.state });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
