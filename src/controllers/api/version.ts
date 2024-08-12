import { Context } from "hono";
import { getVersionName } from "$/constants.ts";
import { Version } from "$/constants.ts";

export const getVersions = () => {
	const versions = [];
	for (const version of Object.values(Version)) {
		const name = getVersionName(version);
		versions.push({
			name,
			version,
			uri: `/api/read/${version}`,
		});
	}

	return versions;
};

export const versions = (c: Context) => {
	return c.json(getVersions());
};
