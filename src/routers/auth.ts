import { Hono } from "hono/mod.ts";
import { login, logout, signup } from "$/controllers/auth.ts";
import { z } from "zod";
import { validator } from "hono/validator/validator.ts";

const router_auth = new Hono();

const schema = z.object({
  user: z.string(),
  password: z.string().min(8),
  email: z.string().email(),
});

const loginSchema = z.object({
  password: z.string().min(8),
  email: z.string().email(),
});

router_auth.post(
  "/signup",
  validator("json", (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      c.status(400);
      return c.json(parsed.error);
    }

    return parsed.data;
  }),
  signup,
);

router_auth.post(
  "/login",
  validator("json", (value, c) => {
    const parsed = loginSchema.safeParse(value);
    if (!parsed.success) {
      c.status(400);
      return c.json(parsed.error);
    }

    return parsed.data;
  }),
  login,
);

router_auth.get("/logout", logout);

export default router_auth;
