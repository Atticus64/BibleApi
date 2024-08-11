import { Hono } from "hono";
import { login, logout, signup } from "$/controllers/auth.ts";
import { z } from "zod";
import { validator } from "jsr:@hono/hono/validator";

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
		parsed.data.email = parsed.data.email.toLowerCase();

		return parsed.data;
	}),
	(c) => {
		const userData = c.req.valid("json");
		return signup(c, userData);
	},
);

router_auth.post(
	"/login",
	validator("json", (value, c) => {
		const parsed = loginSchema.safeParse(value);
		if (!parsed.success) {
			c.status(400);
			return c.json(parsed.error);
		}
		parsed.data.email = parsed.data.email.toLowerCase();

		return parsed.data;
	}),
	(c) => {
		const loginForm = c.req.valid("json");
		return login(c, loginForm);
	},
);

router_auth.get("/logout", logout);

export default router_auth;
