import { Context, Hono } from "hono/mod.ts";
import { Version } from "$/scraping/scrape.ts";
import {
  getChapterVersion,
  getEndpoits,
  Path,
  SearchVersion,
} from "$/controllers/version.ts";
import { searchNviBeta } from "$/controllers/beta.ts";

const router_nvi = new Hono();

router_nvi.get("/", (c) => {
  return getEndpoits(c, Path.NVI, Version.Nvi);
});

router_nvi.get("/beta/search", (c) => {
  return searchNviBeta(c);
});

router_nvi.get("/search", (c) => {
  return SearchVersion(c, Version.Dhh);
});

router_nvi.get("/chapter/:book/:chapter", (c: Context) => {
  return getChapterVersion(c, "verses_nvi");
});

router_nvi.get("/book/:book/:chapter", (c: Context) => {
  return getChapterVersion(c, "verses_nvi");
});


export default router_nvi;
