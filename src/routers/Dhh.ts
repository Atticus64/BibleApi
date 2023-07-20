import { Context, Hono } from "hono/mod.ts";
import { Version } from "$/scraping/scrape.ts";
import { Path, getChapterBook, getEndpoits, getNewTestamentChapter, getoldTestamentChapterBook, testGetChapterBook, testSearchVersion } from "$/controllers/version.ts";
import { searchVersion } from "$/middlewares/search.ts";

const router_dhh = new Hono();

router_dhh.get("/", (c) => {
	return getEndpoits(c, Path.DHH, Version.Dhh)
});

router_dhh.get("/search", (c) => {
	return searchVersion(c, Version.Dhh)
});

router_dhh.get("/test/search", (c) => {
	return testSearchVersion(c, Version.Dhh)
});

router_dhh.get("/oldTestament/:book/:chapter", (c: Context) => {
	return getoldTestamentChapterBook(c, Version.Dhh, Path.DHH);
})

router_dhh.get("/test/chapter/:book/:chapter", (c: Context) => {
	return testGetChapterBook(c);
})

router_dhh.get("/newTestament/:book/:chapter", (c: Context) => {
	return getNewTestamentChapter(c, Version.Nvi, Path.DHH);
})


router_dhh.get("/book/:bookName/:chapter", (c: Context) => {
	return getChapterBook(c, Version.Dhh);
});

export default router_dhh;



