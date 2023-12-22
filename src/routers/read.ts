import { Context, Hono } from "hono/mod.ts";
import {
  getChapterVersion,
  getEndpoits,
  getOneVerseVersion,
  SearchVersion,
} from "$/controllers/read.ts";
import { isInOldTestament } from "$/utils/book.ts";

const router_read = new Hono();

router_read.get("/:version", (c) => {
	const v = c.req.param("version");
	return getEndpoits(c, v);
});

router_read.get("/:version/search", (c) => {
	const v = c.req.param("version");
	return SearchVersion(c, v);
});

router_read.get("/:version/:book/:chapter/:verse", (c: Context) => {
	const v = c.req.param("version");
	return getOneVerseVersion(c, v);
});

router_read.get("/:version/:book/:chapter", (c: Context) => {
	const v = c.req.param("version");
	return getChapterVersion(c, v);
});

export { router_read };
