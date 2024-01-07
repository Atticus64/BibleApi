import { Context, Next } from "hono/mod.ts";
import { getCookie } from "hono/middleware/cookie/index.ts";
import * as jose from "jose";

export const isAuthenticated = async (c: Context, next: Next) => {
	const token = getToken(c);

	if (!token) {
		return c.json({ message: "Unauthorized" }, 401);
	}

	try {
		const secret = new TextEncoder().encode(
			Deno.env.get("SECRET_TOKEN"),
		);

		const { payload } = await jose.jwtVerify(token, secret);

		const data = payload as { id: string; exp: number };
		1689104005;
		if (!payload) {
			return c.json({ message: "Unauthorized" }, 401);
		}

		const { id, exp } = data;

		if (!id || !exp) {
			return c.json({ message: "Unauthorized" }, 401);
		}

		const kv = await Deno.openKv();

		const user = await kv.get(["users", id]);

		if (!user) {
			return c.json({ message: "Unauthorized" }, 401);
		}
	} catch (_e) {
		// console.log(_e)
		return c.json({ message: "Unauthorized" }, 401);
	}

	await next();
};

export const getToken = (c: Context) => {
	const header = c.req.header().authorization;

	const token = header?.split(" ")[1] ?? getCookie(c, "authorization");

	return token;
};
