export const checkUser = async (user: string, email: string) => {
	const kv = await Deno.openKv();

	const primaryKey = ["users", user];
	const byEmailKey = ["users_by_email", email];
	const res = await kv.atomic()
		.check({ key: primaryKey, versionstamp: null })
		.check({ key: byEmailKey, versionstamp: null })
		.commit();

	if (!res.ok) {
		return { exists: true };
	}

	return { exists: false };
};
