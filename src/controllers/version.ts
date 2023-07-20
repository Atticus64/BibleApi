import { Context } from "hono/context.ts";
import { isInNewTestament, isInOldTestament } from "$/utils/book.ts";
import { getChapter } from "$/middlewares/chapter.ts";
import { Version, getVersionName } from "$/scraping/scrape.ts";
import { connect } from "$/database/index.ts";
import { searchProps } from "$/middlewares/search.ts";

// import { DB } from "sqlite";

const db = connect();

// const db = new DB("test.db");
export enum Path {
	RV60 = "rv1960",
	RV95 = "rv1995",
	NVI = "nvi",
	DHH = "dhh"
}

const getEndpoits = async (c: Context, folder: Path, version: Version) => {
	const books = [];

	for await (
		const entry of Deno.readDir(`${Deno.cwd()}/db/${folder}/oldTestament`)
	) {
		const name = entry.name.replaceAll(".json", "");
		const book = {
			name,
			endpoint: `/api/${folder}/book/${name}/`,
			byChapter: `/api/${folder}/book/${name}/1`,
		};
		books.push(book);
	}
	const nameVersion = getVersionName(version);

	const byOldTestament = {
		oldTestament: `${nameVersion} Old Testament books endpoint`,
		oldTestamentByChapter: `/api/${folder}/oldTestament/:book/:chapter`,
	};

	const byNewTestament = {
		oldTestament: `${nameVersion} New Testament books endpoint`,
		oldTestamentByChapter: `/api/${folder}/newTestament/:book/:chapter`,
	};

	books.unshift(byOldTestament);
	books.unshift(byNewTestament);

	return c.json(
		books,
	);
}

function format(name: string) {
	const fm = name[0].toUpperCase() + name.slice(1);
	return fm
}
export async function dbSearch({ version, query, take = 10, page = 1, testament = 'both' }: searchProps) {

	if (version === Version.Dhh) {
		const res = await db.queryObject(`
			SELECT verse, study, verses_dhh.number, verses_dhh.id, name, verses_dhh.chapter FROM verses_dhh 
			JOIN chapters ON verses_dhh.chapter_id = chapters.id
			JOIN books ON books.id = chapters.book_id 
			WHERE verse LIKE '%${query}%' LIMIT 10 OFFSET ${take * (page - 1)};`
		)
		console.log(res)
		return res
	}


}

export async function testSearchVersion(c: Context, version: Version) {
	const { q, take, page, testament } = c.req.query();

	const options = ['old', 'new', 'both'];

	if (!q) {
		c.status(400);
		return c.json([]);
	}

	let test: | "both" | "old" | "new";
	if (testament && !options.includes(testament)) {
		c.status(400);
		return c.json([]);
	} else if (!testament) {
		test = "both";
	} else {
		test = testament as "old" | "new" | "both";
	}

	let data;
	if (!take && !page) {
		data = await dbSearch({ version, query: q, testament: test });
	} else if (!page) {
		data = await dbSearch({ version, query: q, take: Number(take), testament: test });
	} else if (!take) {
		data = await dbSearch({ version, query: q, page: Number(page), testament: test });
		return c.json(data);
	} else {
		data = await dbSearch({ version, query: q, take: Number(take), page: Number(page), testament: test });
	}

	//if (!data.error) {
	//	c.status(400);
	//	return c.json(data);
	//}

	return c.json(data);

}


const testGetChapterBook = async (c: Context) => {
	try {
		const bookName = format(c.req.param("book"));
		const number = parseInt(c.req.param("chapter"));


		const data = await db.queryObject(`
		SELECT verse, study, verses_dhh.number, verses_dhh.id FROM verses_dhh 
		JOIN chapters ON verses_dhh.chapter_id = chapters.id
		JOIN books ON books.id = chapters.book_id WHERE chapter = ${number} AND books.name = '${bookName}';
		`)
		const { rows } = await db.queryObject(`select name, num_chapters, testament FROM books WHERE name = '${bookName}'`);
		const book = rows[0]

		const info = {
			book,
			chapter: number,
			vers: data.rows
		}

		return c.json(info);
	} catch (_error) {
		console.log(_error)
		return c.notFound();
	}
}

const getOldTestamentBook = async (c: Context, folder: Path) => {
	try {
		const bookName = c.req.param("book");

		if (isInNewTestament(bookName)) {
			return c.json({
				"error": "Not found",
				"try to endpoints": `/api/${folder}/newTestament/:book`,
			}, 400);
		}
		const path = `${Deno.cwd()}/db/${folder}/oldTestament/${bookName}.json`;
		const book = await Deno.readTextFile(path);

		return c.json(JSON.parse(book));
	} catch (_error) {
		return c.notFound();
	}
}

const getoldTestamentChapterBook = async (c: Context, version: Version, folder: Path) => {
	try {
		const book = c.req.param("book");
		if (isInNewTestament(book)) {
			return c.json({
				"error": "Not found",
				"try to endpoints": `/api/${folder}/newTestament/:book`,
			}, 400);
		}

		const chapterBook = await getChapter(c, "Antiguo Testamento", version);

		return chapterBook;
	} catch (_error) {
		console.log(_error)
		return c.notFound();
	}
}

const getNewTestamentBook = async (c: Context, folder: Path) => {
	try {
		const bookName = c.req.param("book");

		if (isInOldTestament(bookName)) {
			return c.json({
				"error": "Not found",
				"try to endpoints": `/api/${folder}/oldTestament/:book`,
			}, 400);
		}

		const path = `${Deno.cwd()}/db/${folder}/newTestament/${bookName}.json`;
		const book = await Deno.readTextFile(path);

		return c.json(JSON.parse(book));
	} catch (_error) {
		return c.notFound();
	}
}


const getNewTestamentChapter = async (c: Context, version: Version, folder: Path) => {
	try {
		const book = c.req.param("book");
		if (isInOldTestament(book)) {
			return c.json({
				"error": "Not found",
				"try to endpoints": `/api/${folder}/oldTestament/:book`,
			}, 400);
		}

		const chapterBook = await getChapter(c, "Nuevo Testamento", version);

		return chapterBook;
	} catch (_error) {
		return c.notFound();
	}
}


const getBook = async (c: Context, folder: Path) => {
	try {
		const book = c.req.param("bookName");

		let rawBook;
		if (isInOldTestament(book)) {
			const path = `${Deno.cwd()}/db/${folder}/oldTestament/${book}.json`;
			rawBook = await Deno.readTextFile(path);
		} else {
			const path = `${Deno.cwd()}/db/${folder}/newTestament/${book}.json`;
			rawBook = await Deno.readTextFile(path);
		}

		return c.json(JSON.parse(rawBook));
	} catch (_error) {
		return c.notFound();
	}
}

const getChapterBook = async (c: Context, version: Version) => {
	try {
		const book = c.req.param("bookName");
		let chapterBook;
		if (isInOldTestament(book)) {
			chapterBook = await getChapter(c, "Antiguo Testamento", version);
		} else {
			chapterBook = await getChapter(c, "Nuevo Testamento", version);
		}

		return chapterBook;
	} catch (_error) {
		return c.notFound();
	}
}

export {
	getEndpoits,
	getOldTestamentBook,
	getoldTestamentChapterBook,
	getNewTestamentBook,
	getNewTestamentChapter,
	getChapterBook,
	getBook,
	getChapter,
	testGetChapterBook,
}
