import * as jose from "jose"

export interface User {
	id: string;
	email: string;
	active: boolean
	tag: string
}

export const getUser = async (token: string): Promise<User|null> => {

	const secret = new TextEncoder().encode(
		Deno.env.get("SECRET_TOKEN"),
	);	

	const { payload } = await jose.jwtVerify(token, secret);

	const kv = await Deno.openKv();

	const data = await kv.get(["users", payload.id]);

	let info: { email: string, id: string, active: boolean };

	if (!data.value) {
		return null;
	} else {
		info = data.value as { email: string, id: string, active: boolean };
	}

	const user = {
		email: info.email,
		id: info.id,
		tag: payload.id,
		active: info.active
	} 

	return user

}


