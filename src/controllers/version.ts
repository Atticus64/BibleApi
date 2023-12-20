import { Context } from "hono/context.ts";
import { getVersionName, Version } from "$/scraping/scrape.ts";
import { connect } from "$/database/index.ts";
import { searchProps } from "$/middlewares/search.ts";
import { books } from "$/scraping/index.ts";

const sql = connect();

export enum Path {
  RV60 = "rv1960",
  RV95 = "rv1995",
  NVI = "nvi",
  DHH = "dhh",
}

const getEndpoits = (c: Context, folder: Path, version: Version) => {
  const endpoints = [];

  const nameVersion = getVersionName(version);

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
  const fm = name[0].toUpperCase() + name.slice(1);
  return fm;
}

function getVersionTable(version: Version) {
  switch (version) {
    case Version.Rv60:
      return "verses_rv1960";
    case Version.Rv95:
      return "verses_rv1995";
    case Version.Nvi:
      return "verses_nvi";
    case Version.Dhh:
      return "verses_dhh";
  }
}

async function searchTable(
  table: "verses_rv1960" | "verses_rv1995" | "verses_nvi" | "verses_dhh",
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

export async function SearchVersion(c: Context, version: Version) {
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
	
	return books.some(b => {
		if (b.name.toLowerCase() === book.toLowerCase()) {
			return true
		}
	})
}

const getChapterVersion = async (
  c: Context,
  table: "verses_rv1960" | "verses_rv1995" | "verses_nvi" | "verses_dhh",
) => {
  try {
    const bookName = format(c.req.param("book"));
    const number = parseInt(c.req.param("chapter"));

	if (!existBook(bookName) || isNaN(number)) {
		return c.notFound();
	}

    const data = await sql`
		SELECT verse, study, ${sql(table)}.number, ${sql(table)}.id FROM ${
      sql(table)
    } 
		JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
		JOIN books ON books.id = chapters.book_id WHERE chapter = ${number} AND books.name = ${bookName};
		`;
    const rows =
      await sql`select name, num_chapters, testament FROM books WHERE name = ${bookName}`;
    const book = rows[0];

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
  getEndpoits,
};
