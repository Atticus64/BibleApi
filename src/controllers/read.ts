import { Context } from "hono/context.ts";
import { Table, Verse, VerseSchema, Version } from "$/constants.ts";
import { connect } from "$/database/index.ts";
import { books } from "$/constants.ts";
import { getInfoBook } from "$/utils/book.ts";
import { z } from "zod";
import { Query, searchProps } from "$/validators/search.ts";
import CacheChapters from "$/database/cache.ts";

const versesSchema = z.array(VerseSchema);

type Chapter = {
	num_chapters: number;
	testament: string;
	chapter: number;
	vers: Verse[];
	name: string;
};

export const getVersions = () => {
	const versions = [];
	for (const version of Object.values(Version)) {
		versions.push(version);
	}
	return versions;
};

export const testaments = [
	"Antiguos Testamento",
	"Nuevo Testamento",
	"old",
	"new",
];

const getEndpoits = (c: Context) => {
	const { version } = c.req.valid("param");

	const endpoints = [];
	const versions = getVersions();
	const folder = versions.find((ver) => ver === version);

	for (const book of books) {
		const name = book.names[0].toLowerCase();
		const info = `/api/book/${name}/`;
		const byChapter = `/api/read/${folder}/${name}/1`;
		endpoints.push({
			name: `${name} endpoint`,
			info,
			byChapter,
		});
	}

	return c.json(
		endpoints,
	);
};

export function format(name: string) {
	const fm = name[0].toUpperCase() + name.slice(1).toLowerCase();
	return fm;
}

export function getVersionTable(version: Version): Table {
	switch (version) {
		case Version.Rv60:
			return "verses_rv1960";
		case Version.Rv95:
			return "verses_rv1995";
		case Version.Nvi:
			return "verses_nvi";
		case Version.Dhh:
			return "verses_dhh";
		case Version.Pdt:
			return "verses_pdt";
		case Version.KJV:
			return "verses_kjv";
		default:
			return "verses_rv1960";
	}
}

export function validVersion(v: string) {
	const name = v.toLowerCase();
	return getVersions().includes(name as Version);
}

async function searchTable(
	table: Table,
	query: string,
	take: number,
	page: number,
	testament: "old" | "new" | "both",
) {
	const sql = connect();
	const hasTestament = testament === "old" || testament === "new";
	const offset = (page - 1) * take;
	const parsedQuery = `%${query.toLowerCase()}%`;

	const checkTestament = (testament: string) =>
		sql`and testament = ${testament}`;

	const verses = await sql`
	SELECT verse, study, ${sql(table)}.number, ${sql(table)}.id, name as book, ${
		sql(table)
	}.chapter FROM ${sql(table)} 
	JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
	JOIN books ON books.id = chapters.book_id
	WHERE UNACCENT(LOWER(verse)) LIKE ${parsedQuery} ${
		hasTestament ? checkTestament(testament) : sql``
	}`;

	const items = verses.length;
	const start = Math.min(items - 1, offset);
	const end = Math.min(items, offset + take);

	const res = verses.slice(start, end);

	sql.end();

	const info = {
		data: res,
		meta: {
			page,
			pageSize: take,
			total: verses.count,
			pageCount: Math.ceil(verses.count / take),
		},
	};

	return info;
}

export async function dbSearch(
	{ version, query, take = 10, page = 1, testament = "both" }: searchProps,
) {
	const table = getVersionTable(version);

	return await searchTable(table, query, take, page, testament);
}

export async function SearchVersion(c: Context) {
	const { version } = c.req.valid("param");

	const { q, take, page, testament }: Query = c.req.valid("query");

	const data = await dbSearch({
		version,
		query: q,
		take,
		page,
		testament,
	});

	return c.json(data);
}

export function toValidName(bookName: string): string {
	let formatedBook = "";
	if (bookName.includes("-")) {
		let [part, book] = bookName.split("-");
		book = format(book);
		formatedBook = `${part}-${book}`;
	} else {
		formatedBook = format(bookName);
	}

	return formatedBook;
}

function deleteNullValues(data: Verse[]) {
	return data.map((v) => {
		if (v.study) {
			return v;
		} else {
			return {
				verse: v.verse,
				number: v.number,
				id: v.id,
			};
		}
	});
}

async function getOneVerse(
	table: Table,
	bookName: string,
	chapter: number,
	verse_num: number,
) {
	try {
		const sql = connect();
		const book = `${toValidName(bookName)}`;
		const data = await sql`
		SELECT verse, study, ${sql(table)}.number, ${sql(table)}.id FROM ${
			sql(table)
		} 
		JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
		JOIN books ON books.id = chapters.book_id WHERE chapter = ${chapter} 
		AND books.name = ${book} AND ${sql(table)}.number = ${verse_num};
		`;

		const verse = data[0];

		await sql.end();

		return verse;
	} catch (error) {
		console.log(error);
		return [];
	}
}

async function getRangeVerses(
	table: Table,
	bookName: string,
	chapt: number,
	start: number,
	end: number,
) {
	try {
		const sql = connect();
		const book = `${toValidName(bookName)}`;
		const data = await sql`
			SELECT verse, study, ${sql(table)}.number, ${sql(table)}.id FROM ${
			sql(table)
		} 
			JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
			JOIN books ON books.id = chapters.book_id WHERE chapter = ${chapt} AND books.name = ${book} 
			AND ${sql(table)}.number >= ${start} AND ${sql(table)}.number <= ${end};
		`;
		data.sort((a, b) => a.number - b.number);

		const rawVerses = versesSchema.parse(data);

		const verses = deleteNullValues(rawVerses);
		await sql.end();

		return verses;
	} catch (error) {
		console.log(error);
		return [];
	}
}

async function getVerses(table: Table, bookName: string, chapt: number) {
	try {
		const sql = connect();
		const book = `${toValidName(bookName)}`;
		const data = await sql`
		SELECT verse, study, ${sql(table)}.number, ${sql(table)}.id FROM ${
			sql(table)
		} 
		JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
		JOIN books ON books.id = chapters.book_id WHERE chapter = ${chapt} AND books.name = ${book};
		`;

		const rawVerses = versesSchema.parse(data);
		const verses = deleteNullValues(rawVerses);

		sql.end();

		return verses;
	} catch (error) {
		console.log("Verses");
		console.log(error);
		return [];
	}
}

const getOneVerseVersion = async (
	c: Context,
) => {
	const { version, book, chapter } = c.req.valid("param");
	const table = getVersionTable(version as Version);
	const bookInfo = getInfoBook(book);
	const bookName = toValidName(bookInfo.names[0]);

	try {
		const { verse } = c.req.valid("param") as { verse: string };
		const is_range = verse.includes("-");

		if (is_range) {
			const [value_start, value_end] = verse.split("-");
			const start = Number(value_start);
			const end = Number(value_end);
			const info = await getRangeVerses(table, bookName, chapter, start, end);

			return c.json(info);
		} else {
			const verse_num = Number(verse);
			const info = await getOneVerse(table, bookName, chapter, verse_num);

			return c.json(info);
		}
	} catch (_error) {
		console.log(_error);
		return c.notFound();
	}
};

const getChapterVersion = async (
	c: Context,
) => {
	const { version } = c.req.valid("param");
	const table = getVersionTable(version as Version);

	try {
		const { book, chapter }: { book: string; chapter: number } = c.req.valid(
			"param",
		);

		const infoBook = getInfoBook(book);
		const cache = new CacheChapters(version);
		await cache.init();

		const bookName = toValidName(infoBook.names[0]);

		const info: Chapter = {
			testament: infoBook.testament === "Antiguo Testamento" ? "old" : "new",
			name: bookName ?? book,
			num_chapters: infoBook.chapters,
			chapter,
			vers: [],
		};

		let failedRedis = false;
		const found = await cache.existCh(bookName, chapter);

		try {
			if (found) {
				const verses = await cache.search(bookName, chapter);
				verses.sort((v1: Verse, v2: Verse) => {
					return v1.number - v2.number;
				});
				info.vers = verses;
				failedRedis = false;
			}
		} catch (error) {
			console.log(error);
			failedRedis = true;
		}

		if (!found) {
			const data = await getVerses(table, bookName, chapter);

			if (!failedRedis) {
				await cache.add(data, { book: bookName, chapter });
			}
			data.sort((v1, v2) => {
				return v1.number - v2.number;
			});

			info.vers = data;
		}

		cache.quit();
		return c.json(info);
	} catch (_error) {
		console.log(_error);
		return c.notFound();
	}
};

export { getChapterVersion, getEndpoits, getOneVerseVersion };
