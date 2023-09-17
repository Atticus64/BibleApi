import { Context, Hono } from "hono/mod.ts";
import { Version } from "$/scraping/scrape.ts";
import { Path, SearchVersion, getChapterVersion, getEndpoits, getNewTestamentChapter, getOldTestamentBook, getoldTestamentChapterBook, testSearchVersion } from "$/controllers/version.ts";
import { searchNviBeta } from "$/controllers/beta.ts";

const router_nvi = new Hono();

router_nvi.get("/", (c) => {
	return getEndpoits(c, Path.NVI, Version.Nvi)
});

router_nvi.get("/beta/search", (c) => {
	return searchNviBeta(c)
})

router_nvi.get("/search", (c) => {
	return SearchVersion(c, Version.Dhh)
});

router_nvi.get("/test/search", (c) => {
	return testSearchVersion(c, Version.Dhh)
});

router_nvi.get("/oldTestament/:book", (c: Context) => {
	return getOldTestamentBook(c, Path.NVI);
});

router_nvi.get("/chapter/:book/:chapter", (c: Context) => {
	return getChapterVersion(c, 'verses_nvi');
})

router_nvi.get("/oldTestament/:book/:chapter", (c: Context) => {
	return getoldTestamentChapterBook(c, Version.Nvi);
})

router_nvi.get("/book/:book/:chapter", (c: Context) => {
	return getChapterVersion(c, 'verses_nvi');
})

router_nvi.get("/newTestament/:book/:chapter", (c: Context) => {
	return getNewTestamentChapter(c, Version.Nvi);
})


export default router_nvi;

