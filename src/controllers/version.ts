import { Context } from "hono/context.ts";
import { getVersionName, Version } from "$/scraping/scrape.ts";
import { connect } from "$/database/index.ts";
import { searchProps } from "$/middlewares/search.ts";
import { Book, books } from "$/scraping/index.ts";

const sql = connect();

export enum VersionBible {
  RV60 = "rv1960",
  RV95 = "rv1995",
  NVI = "nvi",
  DHH = "dhh",
  PDT = "pdt",
}

export const getVersions = () => {
	const versions = [];
	for (const version of Object.values(Version)) {
		versions.push(version);
	}
	return versions;
}

export type Table = 
	"verses_rv1960" 
| "verses_rv1995" 
| "verses_nvi" 
| "verses_pdt" 
| "verses_dhh";

const getEndpoits = (c: Context, v: string) => {
  const endpoints = [];
  if (!validVersion(v)) {
	c.status(400);
	return c.json({
		error: "Invalid version"
	});
  }

  const versions = getVersions();
  const folder = versions.find((ver) => ver === v as Version);

  const nameVersion = getVersionName(v as Version);

  const byOldTestament = {
    oldTestament: `${nameVersion} Old Testament books endpoint`,
    oldTestamentByChapter: `/api/${folder}/oldTestament/:book/:chapter`,
  };

  const byNewTestament = {
    oldTestament: `${nameVersion} New Testament books endpoint`,
    oldTestamentByChapter: `/api/${folder}/newTestament/:book/:chapter`,
  };


  endpoints.push(byOldTestament);
  endpoints.push(byNewTestament);

  for (const book of books) {
	const name = book.name.toLowerCase();
    const info =  `/api/book/${name}/`
    const byChapter = `/api/${folder}/book/${name}/1`
	endpoints.push({
		name: `${name} endpoint`,
		info,
		byChapter
	})
  }

  return c.json(
    endpoints,
  );
};

function format(name: string) {
  const fm = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return fm;
}

function getVersionTable(version: Version): Table {
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
  }
}

function validVersion(v: string) {
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
  const hasTestament = testament === "old" || testament === "new";
  const offset = (page - 1) * take;
  const parsedQuery = `%${query.toLowerCase()}%`;

  const checkTestament = (testament: string) =>
    sql`and testament = ${testament}`;

  const meta = await sql`
		SELECT verse, study, ${sql(table)}.number, ${sql(table)}.id, name, ${
    sql(table)
  }.chapter FROM ${sql(table)} 
		JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
		JOIN books ON books.id = chapters.book_id
		WHERE UNACCENT(LOWER(verse)) LIKE ${parsedQuery} ${
    hasTestament ? checkTestament(testament) : sql``
  }`;

  const res = await sql`
		SELECT verse, study, ${sql(table)}.number, ${
    sql(table)
  }.id, name as book, ${sql(table)}.chapter FROM ${sql(table)}
		JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
		JOIN books ON books.id = chapters.book_id
		WHERE UNACCENT(LOWER(verse)) LIKE ${parsedQuery} 
		${hasTestament ? checkTestament(testament) : sql``} 
		LIMIT ${take} OFFSET ${offset};`;


  const info = {
    data: res,
    meta: {
      page,
      pageSize: take,
      total: meta.count,
      pageCount: Math.ceil(meta.count / take),
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

export async function SearchVersion(c: Context, v: string) {
  if (!validVersion(v)) {
	c.status(400);
	return c.json({
		message: "Invalid version"
	});
  }

  const version = v as Version;

  const { q, take, page, testament } = c.req.query();

  const options = ["old", "new", "both"];
  if (!q) {
    c.status(400);
    return c.json([]);
  }

  let test: "both" | "old" | "new";
  if (testament && !options.includes(testament)) {
    c.status(400);
    return c.json([]);
  } else if (!testament) {
    test = "both";
  } else {
    test = testament as "old" | "new" | "both";
  }

  const data = await dbSearch({
	version,
	query: q,
	take: take ? Number(take) : 10,
	page: page ? Number(page) : 1,
	testament: test,	  
  });

  return c.json(data);
}


function existBook(book: string): boolean {
	return books.some(b => b.name.toLowerCase() === book.toLowerCase())
}

function toValidName(bookName: string): string {
	let formatedBook = ''
	if (bookName.includes("-")) {
		let [part, book] = bookName.split("-");
		book = format(book);
		formatedBook = `${part}-${book}`
	} else {
		formatedBook = format(bookName); 
	}

	return formatedBook

}
async function getOneVerse(table: Table, bookName: string, chapter: number, verse_num: number) {

	try {
		const book = `${toValidName(bookName)}`;
		const data = await sql`
		SELECT verse, study, ${sql(table)}.number, ${sql(table)}.id FROM ${
			sql(table)
		} 
		JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
		JOIN books ON books.id = chapters.book_id WHERE chapter = ${chapter} 
		AND books.name = ${book} AND ${sql(table)}.number = ${verse_num};
		`;


		return data;
	} catch (error) {
		console.log(error);
		return []
	}


}


async function getRangeVerses(table: Table, bookName: string, chapt: number, start: number, end: number) {
	try {
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
		return data

	} catch (error) {
		console.log(error);
		return []
	}


}

async function getVerses(table: Table, bookName: string, chapt: number) {

	try {

		const book = `${toValidName(bookName)}`;
		const data = await sql`
		SELECT verse, study, ${sql(table)}.number, ${sql(table)}.id FROM ${
			sql(table)
		} 
		JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
		JOIN books ON books.id = chapters.book_id WHERE chapter = ${chapt} AND books.name = ${book};
		`;

		return data

	} catch (error) {
		console.log(error);
		return []
	}


}

const getOneVerseVersion = async (
  c: Context,
  version: string
) => {

	if (!validVersion(version)) {
		c.status(400);
		return c.json({
			message: "Invalid version"
		});
	}

	const table = getVersionTable(version as Version);

	try {
		const queryBook = c.req.param("book");
		const queryChapter = c.req.param("chapter");
		const queryVerse = c.req.param("verse");

		if (!queryBook || !queryChapter || !queryVerse) {
			return c.notFound();
		}

		if (!existBook(queryBook)) {
			return c.notFound();
		}

		const chapter = parseInt(queryChapter);

		if (isNaN(chapter)) {
			return c.notFound();
		}

		const is_range = queryVerse.includes("-");

		if (is_range) {
			const [value_start, value_end] = queryVerse.split("-");
			const start = Number(value_start);
			const end = Number(value_end);

			const is_zero = start <= 0 || end <= 0;
			if (isNaN(start) || isNaN(end) || is_zero) {
				c.status(400);
				return c.json({
					error: "Invalid range",
					range: queryVerse
				});	
			}

			const info = await getRangeVerses(table, queryBook, chapter, start, end);

			return c.json(info);

		} else {
			const verse_num = Number(queryVerse);

			if (isNaN(verse_num)) {
				return c.notFound();
			}

			const info = await getOneVerse(table, queryBook, chapter, verse_num);

			return c.json(info);

		}

	} catch (_error) {
		console.log(_error);
		return c.notFound();
	}

}

const getChapterVersion = async (
  c: Context,
  version: string
) => {

	if (!validVersion(version)) {
		c.status(400);
		return c.json({
			message: "Invalid version"
		});
	}

	const table = getVersionTable(version as Version);


	try {
		const bookName = format(c.req.param("book"));
		const number = parseInt(c.req.param("chapter"));


		if (!existBook(bookName) || isNaN(number)) {
			return c.notFound();
		}

		const data = await getVerses(table, bookName, number);

		const infoBook = books.find((b) => b.name.toLowerCase() === bookName.toLowerCase()) as Book;
		const testament = infoBook.testament === "Antiguo Testamento" ? "old" : "new";
		const book = {
			testament,
			name: infoBook.name,
			num_chapters: infoBook.chapters,
		};

		data.sort((v1, v2) => {
			return v1.number - v2.number;
		})

		const info = {
			...book,
			chapter: number,
			vers: data,
		};

		return c.json(info);
	} catch (_error) {
		console.log(_error);
		return c.notFound();
	}
};

export {
  getChapterVersion,
  getOneVerseVersion,
  getEndpoits,
};
