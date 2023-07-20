import { Context, Hono } from "hono/mod.ts";
import { Version } from "$/scraping/scrape.ts";
import { Path, getBook, getChapterBook, getEndpoits, getNewTestamentBook, getNewTestamentChapter, getOldTestamentBook, getoldTestamentChapterBook } from "$/controllers/version.ts";
import { searchVersion } from "$/middlewares/search.ts";

const router_nvi = new Hono();

router_nvi.get("/", (c) => {
	return getEndpoits(c, Path.NVI, Version.Nvi)
});

router_nvi.get("/search", (c) => {
	return searchVersion(c, Version.Nvi)
});

router_nvi.get("/oldTestament/:book", (c: Context) => {
	return getOldTestamentBook(c, Path.NVI);
});

router_nvi.get("/oldTestament/:book/:chapter", (c: Context) => {
	return getoldTestamentChapterBook(c, Version.Nvi, Path.NVI);
})

router_nvi.get("/newTestament/:book", (c: Context) => {
	return getNewTestamentBook(c, Path.NVI);
});

router_nvi.get("/newTestament/:book/:chapter", (c: Context) => {
	return getNewTestamentChapter(c, Version.Nvi, Path.NVI);
})

router_nvi.get("/book/:bookName", (c: Context) => {
	return getBook(c, Path.NVI);
})

router_nvi.get("/book/:bookName/:chapter", (c: Context) => {
	return getChapterBook(c, Version.Nvi);
});

export default router_nvi;



