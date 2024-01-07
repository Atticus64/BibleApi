import { Context } from "hono/context.ts";
import { hash, verify } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
import { checkUser } from "$/validators/mod.ts";
import * as jose from "jose";
import { deleteCookie, setCookie } from "middleware/cookie/index.ts";

interface User {
	user: string;
	password: string;
	email: string;
}

export const signup = async (c: Context): Promise<Response> => {
	try {
		const { user, password, email } = c.req.valid("json") as User;

		const kv = await Deno.openKv();

		const userEmail = email.toLowerCase();

		const { exists } = await checkUser(user, userEmail);

		if (exists) {
			c.status(400);
			return c.json({
				message: "User already exists",
			});
		}

		const hashed = hash(password);
		const id = crypto.randomUUID();
		const userData = {
			email: userEmail,
			password: hashed,
			id,
			active: true,
		};

		kv.set(["users", user], userData);

		kv.set(["users_by_email", userEmail], {
			user,
			password: hashed,
			id,
			active: true,
		});

		const secret = new TextEncoder().encode(
			Deno.env.get("SECRET_TOKEN"),
		);

		const jwt = await new jose.SignJWT({ id: user })
			.setProtectedHeader({ alg: "HS512", typ: "JWT" })
			.setIssuedAt()
			.setExpirationTime("72h")
			.sign(secret);

		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 3);

		setCookie(c, "authorization", jwt, {
			path: "/",
			sameSite: "None",
			secure: true,
			expires: expirationDate,
		});

		return c.json({
			user,
			token: jwt,
			email: userEmail,
		});
	} catch (error) {
		console.log(error);
		console.log("auth signup error");
		c.status(500);

		return c.json({
			message: "Internal server error",
		});
	}
};

export const login = async (c: Context): Promise<Response> => {
	const { email, password }: { email: string; password: string } = c.req.valid(
		"json",
	);

	const loginEmail = email.toLowerCase();
	const kv = await Deno.openKv();

	const userData = await kv.get(["users_by_email", loginEmail]);

	if (!userData.value) {
		c.status(400);
		return c.json({
			message: "User not found",
		});
	}

	const data = userData.value as User;

	const isValid = verify(password as string, data.password);

	if (!isValid) {
		c.status(400);
		return c.json({
			message: "Invalid password",
		});
	}

	const secret = new TextEncoder().encode(
		Deno.env.get("SECRET_TOKEN"),
	);

	const jwt = await new jose.SignJWT({ id: data.user })
		.setProtectedHeader({ alg: "HS512", typ: "JWT" })
		.setIssuedAt()
		.setExpirationTime("72h")
		.sign(secret);

	c.status(200);

	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 3);

	setCookie(c, "authorization", jwt, {
		path: "/",
		sameSite: "None",
		secure: true,
		expires: expirationDate,
	});

	return c.json({
		user: data.user,
		token: jwt,
		email: loginEmail,
	});
};

export const logout = (c: Context): Response => {
	deleteCookie(c, "authorization", {
		path: "/",
		sameSite: "None",
		secure: true,
		maxAge: 1000,
	});

	return c.json({
		message: "Logged out",
	});
};
