import { Context } from "hono/context.ts";
import { getVersionName } from "$/constants.ts";
import { VersionBible } from "$/constants.ts";

export const getVersions = () => {
	const versions = [];
	for (const version of Object.values(VersionBible)) {
		const name = getVersionName(version);
		versions.push({
			name,
			version,
			uri: `/api/read/${version}`,
		});
	}

	return versions;
}

export const versions = (c: Context) => {
	return c.json(getVersions());
}

