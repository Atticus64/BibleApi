import { Context } from "hono/mod.ts";
import { getToken } from "$/middlewares/authorization.ts";
import { getUser } from "$/middlewares/user.ts";

export const getUserInfo = async (c: Context) => {

	const token = getToken(c);
	const user = await getUser(token);

	if (!user) {
		c.status(400);
		return;
	}

	return c.json(user)
}

export const deleteDB = async (c: Context): Promise<Response> => {
	const kv = await Deno.openKv();

	for await (const { key }  of kv.list({ prefix: ["users"]})) {
		await kv.delete(key);
	}

	for await (const { key }  of kv.list({ prefix: ["users_by_email"]})) {
		await kv.delete(key);
	}

	for await (const { key }  of kv.list({ prefix: ["notes"]})) {
		await kv.delete(key);
	}

	return c.json({ message: "OK" })
}

export const checkDB = async (c: Context): Promise<Response> => {
	const kv = await Deno.openKv();

	for await (const item of kv.list({ prefix: ["users"]})) {
		console.log(item)
	}

	for await (const item of kv.list({ prefix: ["users_by_email"]})) {
		console.log(item)
	}

	for await (const item of kv.list({ prefix: ["notes"]})) {
		console.log(item)
	}

	return c.json({ message: "OK" })
}
