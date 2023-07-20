import { Context } from "hono/context.ts";
import { hash, verify } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
import { checkUser } from "$/validators/mod.ts";
import * as jose from 'jose'
import { deleteCookie, setCookie } from "middleware/cookie/index.ts";

interface User {
	user: string;
	password: string;
	email: string;
}

export const signup = async (c: Context): Promise<Response> => {
	try {
		const { user, password, email } = c.req.valid('json');

		const kv = await Deno.openKv();

		const { exists } = await checkUser(user, email);

		if (exists) {
			c.status(400);
			return c.json({
				message: "User already exists"
			})
		}

		const hashed = hash(password);
		const id = crypto.randomUUID();
		const userData = {
			email: email,
			password: hashed,
			id,
			active: true
		}

		kv.set(["users", user], userData);

		kv.set(["users_by_email", email], {
			user,
			password: hashed,
			id,
			active: true
		});

		const secret = new TextEncoder().encode(
			'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
		);	

		const jwt = await new jose.SignJWT({ id: user })
			.setProtectedHeader({ alg: "HS512", typ: "JWT" })
			.setIssuedAt()
			.setExpirationTime('72h')
			.sign(secret)

		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate()+3);

		setCookie(c, "authorization", jwt, { 
			path: "/", 
			sameSite: "None", 
			secure: true,  
			expires: expirationDate 
		});

		return c.json({
			user,
			token: jwt,
			email
		})

	} catch (error) {
		console.log(error)
		console.log("auth signup error");
		c.status(500);

		return c.json({
			message: "Internal server error"
		})
	}
}

export const login = async (c: Context): Promise<Response> => {
	const { email, password } = c.req.valid('json');

	const kv = await Deno.openKv();

	const userData = await kv.get(["users_by_email", email]);

	if (!userData.value) {
		c.status(400);
		return c.json({
			message: "User not found"
		})
	}

	const data = userData.value as User;

	const isValid = verify(password as string, data.password);

	if (!isValid) {
		c.status(400);
		return c.json({
			message: "Invalid password"
		})
	}
	
	const secret = new TextEncoder().encode(
		'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
	)

	const jwt = await new jose.SignJWT({ id: data.user })
		.setProtectedHeader({ alg: "HS512", typ: "JWT" })
		.setIssuedAt()
		.setExpirationTime('72h')
		.sign(secret)
	
	c.status(200);

	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate()+3);

	setCookie(c, "authorization", jwt, { 
		path: "/", 
		sameSite: "None", 
		secure: true,  
		expires: expirationDate 
	});

	return c.json({
		token: jwt
	})
}

export const logout = (c: Context): Response => {

	deleteCookie(c, "authorization", { 
		path: "/", 
		sameSite: "None", 
		secure: true,  
		maxAge: 1000 
	});

	return c.json({
		message: "Logged out"
	})
}



