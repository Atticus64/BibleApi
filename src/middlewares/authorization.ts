import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import * as jose from "jose";
import UserRepository from "$/userRepository.ts";

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

		const data = payload as { email: string; exp: number };
		if (!payload) {
			return c.json({ message: "Unauthorized" }, 401);
		}

		const { email, exp } = data;

		if (!email || !exp) {
			return c.json({ message: "Unauthorized" }, 401);
		}

		const userRepo = await UserRepository.Create();

		const exists = await userRepo.existsUser(email);

		if (!exists) {
			return c.json({ message: "Unauthorized" }, 401);
		}
	} catch (_e) {
		console.log(_e);
		return c.json({ message: "Unauthorized" }, 401);
	}

	await next();
};

export const getToken = (c: Context) => {
	const header = c.req.header().authorization;

	const token = header?.split(" ")[1] ?? getCookie(c, "authorization");

	return token;
};
