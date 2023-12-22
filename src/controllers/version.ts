import { Context } from "hono/context.ts";
import { getVersionName } from "$/scraping/scrape.ts";


export enum VersionBible {
  RV60 = "rv1960",
  RV95 = "rv1995",
  NVI = "nvi",
  DHH = "dhh",
  PDT = "pdt",
}

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

export type Table = 
	"verses_rv1960" 
| "verses_rv1995" 
| "verses_nvi" 
| "verses_pdt" 
| "verses_dhh";

export const versions = (c: Context) => {
	return c.json(getVersions());
}

