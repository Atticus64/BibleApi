import { Context, Hono } from "hono/mod.ts";
import { Version } from "$/scraping/scrape.ts";
import {
  getChapterVersion,
  getEndpoits,
  Path,
  SearchVersion,
} from "$/controllers/version.ts";

const router_rv60 = new Hono();

router_rv60.get("/", (c: Context) => {
  return getEndpoits(c, Path.RV60, Version.Rv60);
});

router_rv60.get("/search", (c) => {
  return SearchVersion(c, Version.Dhh);
});

router_rv60.get("/chapter/:book/:chapter", (c: Context) => {
  return getChapterVersion(c, "verses_rv1960");
});

router_rv60.get("/book/:book/:chapter", (c: Context) => {
  return getChapterVersion(c, "verses_rv1960");
});


router_rv60.get("/book/:books/:chapter", (c: Context) => {
  return getChapterVersion(c, "verses_rv1960");
});

export default router_rv60;
