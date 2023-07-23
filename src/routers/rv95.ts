import { Context, Hono } from "hono/mod.ts";
import { Version } from "$/scraping/scrape.ts";
import { Path, SearchVersion, getChapterVersion, getEndpoits,  getNewTestamentChapter, getOldTestamentBook,  testSearchVersion } from "$/controllers/version.ts";

const router_rv95 = new Hono();

router_rv95.get("/", (c: Context) => {
	return getEndpoits(c, Path.RV95, Version.Rv95);
});

router_rv95.get("/search", (c) => {
	return SearchVersion(c, Version.Rv60);
});

router_rv95.get("/test/search", (c) => {
	return testSearchVersion(c, Version.Rv60);
});


router_rv95.get("/chapter/:book/:chapter", (c: Context) => {
	return getChapterVersion(c, 'verses_rv1995');
})


router_rv95.get("/oldTestament/:book/:chapter", (c: Context) => {
	return getOldTestamentBook(c, Path.RV95);
});

router_rv95.get("/newTestament/:book/:chapter", (c: Context) => {
	return getNewTestamentChapter(c, Version.Rv95);
	
});


router_rv95.get("/book/:book/:chapter", (c: Context) => {
	return getChapterVersion(c, 'verses_rv1995');
});


export default router_rv95;
