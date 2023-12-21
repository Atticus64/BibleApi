import { Context, Hono } from "hono/mod.ts";
import { Version } from "$/scraping/scrape.ts";
import {
  getChapterVersion,
  getEndpoits,
  getOneVerseVersion,
  VersionBible,
  SearchVersion,
} from "$/controllers/version.ts";

const router_dhh = new Hono();

router_dhh.get("/", (c) => {
  return getEndpoits(c, VersionBible.DHH, Version.Dhh);
});

router_dhh.get("/search", (c) => {
  return SearchVersion(c, Version.Dhh);
});

router_dhh.get("/verse", (c: Context) => {
  return getOneVerseVersion(c, "verses_dhh");
});

router_dhh.get("/chapter/:book/:chapter", (c: Context) => {
  return getChapterVersion(c, "verses_dhh");
});

router_dhh.get("/book/:book/:chapter", (c: Context) => {
  return getChapterVersion(c, "verses_dhh");
});

router_dhh.get("/book/:bookName/:chapter", (c: Context) => {
  return getChapterVersion(c, "verses_dhh");
});

export default router_dhh;
