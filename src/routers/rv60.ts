import { Context, Hono } from "hono/mod.ts";
import { Version } from "$/scraping/scrape.ts";
import { Path, getBook, getChapterBook, getEndpoits, getNewTestamentBook, getNewTestamentChapter, getOldTestamentBook, getoldTestamentChapterBook, testSearchVersion } from "$/controllers/version.ts";
import { searchVersion } from "$/middlewares/search.ts";


const router_rv60 = new Hono();

router_rv60.get("/", (c: Context) => {
	return getEndpoits(c, Path.RV60, Version.Rv60);
});

router_rv60.get("/search", (c) => {
	return searchVersion(c, Version.Rv60);
});

router_rv60.get("/test/search", (c) => {
	return testSearchVersion(c, Version.Rv60)
});

router_rv60.get("/oldTestament/:book", (c: Context) => {
	return getoldTestamentChapterBook(c, Version.Rv60,  Path.RV60);
});

router_rv60.get("/oldTestament/:book/:chapter", (c: Context) => {
	return getOldTestamentBook(c, Path.RV60);
});

router_rv60.get("/newTestament/:book", (c: Context) => {
	return getNewTestamentBook(c, Path.RV60);
});

router_rv60.get("/newTestament/:book/:chapter", (c: Context) => {
	return getNewTestamentChapter(c, Version.Rv60, Path.RV60);
	
});

router_rv60.get("/book/:bookName", (c: Context) => {
	return getBook(c, Path.RV60);
});

router_rv60.get("/book/:bookName/:chapter", (c: Context) => {
	return getChapterBook(c, Version.Rv60);
});

export default router_rv60;
