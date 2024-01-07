import { Version } from "$/constants.ts";
import { Context } from "hono/mod.ts";
import { Book, books } from "$/constants.ts";
import { getFolder } from "$/scraping/scrape.ts";
import { searchProps } from "$/validators/search.ts";

interface Verse {
	verse: string;
	number: number;
	passage: string;
	testament: "old" | "new";
	chapter: string;
	book: string;
	study: string;
	id: string;
}

interface Chapter {
	chapter: string;
	vers: Verse[];
}

interface info {
	version: string;
	newTestament: Book[];
	oldTestament: Book[];
}

interface Match {
	study?: string;
	passage: string;
	verse: string;
	id: string;
	url: string;
}
