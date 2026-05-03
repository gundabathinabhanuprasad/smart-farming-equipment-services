import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "../../../lib/db/src/index.js";
import { eq } from "drizzle-orm";
import { signToken, verifyToken, type JwtPayload } from "../middleware/auth.js";
import { LoginBody, SignupBody } from "../../../lib/api-zod/src/index.js";

const router: IRouter = Router();

router.post("/auth/signup", async (req, res): Promise<void> => {
  const result = SignupBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }
  const { name, phone, password, role, village, district, state, locationLat, locationLng } = result.data;

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
  const result = LoginBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }
  const { phone, password } = result.data;

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

router.get("/auth/me", verifyToken, async (req, res): Promise<void> => {
  const userReq = req as typeof req & { user: JwtPayload };
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userReq.user.id));
  
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    village: user.village,
    district: user.district,
    state: user.state
  });
});

export default router;
