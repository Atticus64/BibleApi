import { Context, Hono, validator } from "hono/mod.ts";
import {
  getChapterVersion,
  getEndpoits,
  getOneVerseVersion,
  SearchVersion,
} from "$/controllers/read.ts";
import { randomVerse } from "$/controllers/random.ts";
import { checkVersion } from "$/validators/version.ts";
import { checkBook, validChapter, validVerse } from "$/validators/book.ts";
import { validQueries } from "$/validators/search.ts";

const router_read = new Hono();

router_read.get("/:version", validator("param", checkVersion), (c) => {
	return getEndpoits(c);
});

router_read.get("/:version/verse/random", validator("param", checkVersion), (c) => {
	return randomVerse(c);
});

router_read.get("/:version/search", 
	validator("param", checkVersion), 
	validator("query", validQueries), 
	(c) => {

	return SearchVersion(c);
});

router_read.get("/:version/:book/:chapter/:verse", 
	validator("param", checkVersion),
	validator("param", checkBook),
	validator("param", validChapter),
	validator("param", validVerse),
	(c: Context) => {
		return getOneVerseVersion(c);
});

router_read.get("/:version/:book/:chapter",
	validator("param", checkVersion),
	validator("param", checkBook),
	validator("param", validChapter),
	(c: Context) => {
	return getChapterVersion(c);
});

export { router_read };


