import * as zod from "zod";
export * from './generated/api.js';

export const LoginBody = zod.object({
  phone: zod.string().min(10, "Phone number must be at least 10 digits"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

export const SignupBody = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  phone: zod.string().min(10, "Phone number must be at least 10 digits"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  role: zod.enum(["farmer", "owner", "driver"]),
  village: zod.string().optional(),
  district: zod.string().optional(),
  state: zod.string().optional(),
  locationLat: zod.number().optional(),
  locationLng: zod.number().optional(),
});
