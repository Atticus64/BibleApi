import { MaybeEmpty } from "https://deno.land/std@0.132.0/node/_utils.ts";

export type User = {
	user: string;
	password: string;
	email: string;
};

export type UserData = {
	user: string;
	password: string;
	email: string;
	id: string;
	active: boolean;
};

export interface UsrRepository {
	save(user: User): Promise<void>;
	get(email: string): Promise<User | null>;
	update(email: string, user: MaybeEmpty<User>): Promise<void>;
	delete(email: string): Promise<void>;
}

class UserRepository implements UsrRepository {
	private constructor(
		private readonly db: Deno.Kv,
	) {
	}

	static async Create() {
		const connection = await Deno.openKv();
		if (!connection) {
			throw new Error("Database not connected");
		}

		return new UserRepository(connection);
	}

	async save(user: User) {
		const exists = await this.existsUser(user.email);
		if (exists) {
			throw new Error("User already exists");
		}

		user.email = user.email.toLowerCase();
		const usr = {
			user: user.user,
			password: user.password,
			email: user.email,
			id: crypto.randomUUID(),
			active: true,
		} satisfies UserData;

		await this.db.set(["users_by_email", user.email], usr);
	}

	async update(email: string, user: MaybeEmpty<User>): Promise<void> {
		email = email.toLowerCase();
		const exists = await this.existsUser(email);
		if (!exists) {
			throw new Error("User not found");
		}

		const oldUser = await this.get(email);

		const userData = {
			user: user?.user ?? oldUser.user,
			password: user?.password ?? oldUser.password,
			email: user?.email ?? oldUser.email,
			id: oldUser.id,
			active: oldUser.active,
		} satisfies UserData;

		await this.db.set(["users_by_email", email], userData);
	}

	async get(email: string) {
		email = email.toLowerCase();
		const user = await this.db.get(["users_by_email", email]);

		if (!user) {
			throw new Error("User not exists");
		}

		return user.value as UserData;
	}

	async getUser(email: string): Promise<User> {
		email = email.toLowerCase();
		const user = await this.get(email);

		return {
			user: user.user,
			password: user.password,
			email: user.email,
		};
	}

	async existsUser(email: string) {
		email = email.toLowerCase();
		const user = await this.db.get(["users_by_email", email]);
		return user.value !== null;
	}

	async delete(email: string) {
		email = email.toLowerCase();
		const exists = await this.existsUser(email);
		if (!exists) {
			throw new Error("User not found");
		}

		const user = await this.get(email);
		const userData = {
			...user,
			active: false,
		};

		await this.db.set(["users_by_email", email], userData);
	}

	quit() {
		this.db.close();
	}
}

export default UserRepository;
