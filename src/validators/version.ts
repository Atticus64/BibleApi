import { getVersions, validVersion } from "$/controllers/read.ts";
import { Context } from "hono";

export const invalidVersionResponse = (c: Context, version: string) => {
  	c.status(400);
		const supportedVersions = getVersions();
		return c.json({
			error: "Invalid version",
			version,
			supportedVersions,
		});
}

export const checkVersion = (value: { version: string }, c: Context) => {
	const { version } = value;

	if (!validVersion(version)) {
		c.status(400);
		const supportedVersions = getVersions();
		return c.json({
			error: "Invalid version",
			version,
			supportedVersions,
		});
	}

	return value;
};
