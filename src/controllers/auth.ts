import { Context } from "hono";
import { hash, verify } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
import * as jose from "jose";
import { deleteCookie, setCookie } from "https://deno.land/x/hono/helper.ts";
import UserRepository from "$/userRepository.ts";

interface User {
	user: string;
	password: string;
	email: string;
}

const createJWT = (email: string) => {
	const secret = new TextEncoder().encode(
		Deno.env.get("SECRET_TOKEN"),
	);
	return new jose.SignJWT({ email })
		.setProtectedHeader({ alg: "HS512", typ: "JWT" })
		.setIssuedAt()
		.setExpirationTime("72h")
		.sign(secret);
};

export const signup = async (c: Context, dataUser: User): Promise<Response> => {
	try {
		const { user, password, email } = dataUser;
		const userRepo = await UserRepository.Create();
		const exists = await userRepo.existsUser(email);
		if (exists) {
			c.status(400);
			return c.json({
				message: "User already exists",
			});
		}

		const hashed = hash(password);
		const userInfo = {
			user,
			password: hashed,
			email,
		};
		await userRepo.save(userInfo);
		userRepo.quit();

		const jwt = await createJWT(email);
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
			email,
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

export const login = async (
	c: Context,
	loginForm: { email: string; password: string },
): Promise<Response> => {
	const { email, password } = loginForm;
	const userRepo = await UserRepository.Create();
	const exists = await userRepo.existsUser(email);
	if (!exists) {
		c.status(400);
		return c.json({
			message: "User not found",
		});
	}

	const data = await userRepo.get(email);
	const isValid = verify(password, data.password);
	userRepo.quit();

	if (!isValid) {
		c.status(400);
		return c.json({
			message: "Invalid password",
		});
	}

	const jwt = await createJWT(data.email);

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
		email,
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
