import { Context, Hono } from "hono";
import { validator } from "https://deno.land/x/hono@v4.3.7/validator/index.ts";
import {
	getChapterVersion,
	getEndpoits,
	getOneVerseVersion,
	SearchVersion,
} from "$/controllers/read.ts";
import { randomVerse } from "$/controllers/random.ts";
import { checkVersion } from "$/validators/version.ts";
import { checkBook, validChapter, validVerse } from "$/validators/book.ts";
import { Query, validQueries } from "$/validators/search.ts";
import { Version } from "$/constants.ts";

const router_read = new Hono();

router_read.get("/:version", validator("param", checkVersion), (c) => {
	const { version } = c.req.valid("param");
	return getEndpoits(c, version);
});

router_read.get(
	"/:version/verse/random",
	validator("param", checkVersion),
	(c) => {
		const { version } = c.req.valid("param");
		return randomVerse(c, version);
	},
);

router_read.get(
	"/:version/search",
	validator("param", checkVersion),
	validator("query", validQueries),
	(c) => {
		const query: Query = c.req.valid("query");
		const { version } = c.req.valid("param");

		return SearchVersion(c, version as Version, query);
	},
);

router_read.get(
	"/:version/:book/:chapter/:verse",
	validator("param", checkVersion),
	validator("param", checkBook),
	validator("param", validChapter),
	validator("param", validVerse),
	(c) => {
		const bookData = c.req.valid("param");

		const data = {
			...bookData,
			chapter: Number(bookData.chapter),
		};

		return getOneVerseVersion(c, data);
	},
);

router_read.get(
	"/:version/:book/:chapter",
	validator("param", checkVersion),
	validator("param", validChapter),
	validator("param", checkBook),
	(c) => {
		const bookData = c.req.valid("param");
		const data = {
			...bookData,
			chapter: Number(bookData.chapter),
		};

		return getChapterVersion(c, data);
	},
);

export { router_read };
