import * as jose from "jose";
import UserRepository from "$/userRepository.ts";

export interface User {
	id: string;
	email: string;
	active: boolean;
	tag: string;
}

export const getUser = async (token: string): Promise<User | null> => {
	const secret = new TextEncoder().encode(
		Deno.env.get("SECRET_TOKEN"),
	);

	const { payload } = await jose.jwtVerify(token, secret);

	const userRepo = await UserRepository.Create();
	const exists = await userRepo.existsUser(payload.email as string);
	if (!exists) {
		return null;
	}

	const data = await userRepo.get(payload.email as string);

	const user = {
		email: data.email,
		id: data.id,
		tag: data.user,
		active: data.active,
	};

	return user;
};
