import { Context, Hono } from "hono/mod.ts";
import { Version } from "$/scraping/scrape.ts";
import { Path, getBook, getChapterBook, getEndpoits, getNewTestamentBook, getNewTestamentChapter, getOldTestamentBook, getoldTestamentChapterBook, testSearchVersion } from "$/controllers/version.ts";
import { searchVersion } from "$/middlewares/search.ts";


const router_rv95 = new Hono();

router_rv95.get("/", (c: Context) => {
	return getEndpoits(c, Path.RV95, Version.Rv95);
});

router_rv95.get("/search", (c) => {
	return searchVersion(c, Version.Rv60);
});

router_rv95.get("/test/search", (c) => {
	return testSearchVersion(c, Version.Rv60);
});


router_rv95.get("/oldTestament/:book", (c: Context) => {
	return getoldTestamentChapterBook(c, Version.Rv95,  Path.RV95);
});

router_rv95.get("/oldTestament/:book/:chapter", (c: Context) => {
	return getOldTestamentBook(c, Path.RV95);
});

router_rv95.get("/newTestament/:book", (c: Context) => {
	return getNewTestamentBook(c, Path.RV95);
});

router_rv95.get("/newTestament/:book/:chapter", (c: Context) => {
	return getNewTestamentChapter(c, Version.Rv95, Path.RV95);
	
});

router_rv95.get("/book/:bookName", (c: Context) => {
	return getBook(c, Path.RV95);
});

router_rv95.get("/book/:bookName/:chapter", (c: Context) => {
	return getChapterBook(c, Version.Rv95);
});


export default router_rv95;
