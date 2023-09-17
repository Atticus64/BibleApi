import { connect } from "$/database/index.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { Context } from "hono/mod.ts";
import { create, insertMultiple, search } from "npm:@orama/orama";
const sql = connect();

export async function createMemoryDB() {
  const db = await create({
    language: "spanish",
    schema: {
      id: "string",
      verse: "string",
      book: "string",
      number: "number",
      study: "string",
      chapter: "number",
      chapter_id: "number",
    },
  });

  return db;
}

export async function fillMemoryDB(db: any) {
  const r =
    await sql`Select verses_nvi.id as id, verses_nvi.number as number, verse, study, name, chapter, chapter_id from verses_nvi join chapters on verses_nvi.chapter_id = chapters.id join books on books.id = chapters.book_id`;

  const vers: Verse[] = r.map((r) => {
    const info = r as Data;
    return {
      verse: info.verse,
      study: info.study ?? "",
      book: info.name,
      number: info.number,
      chapter: Number(info.chapter),
      chapter_id: Number(info.chapter_id),
    };
  });

  await insertMultiple(db, vers);
}

type Verse = {
  verse: string;
  study?: string;
  book: string;
  number: number;
  chapter: number;
  chapter_id: number;
};

type Data = {
  verse: string;
  study?: string;
  name: string;
  number: number;
  chapter: number;
  chapter_id: number;
  vers: Verse[];
};

const findVerses = async (db: any, term: string, take = 10, page = 1) => {
  const offset = (page - 1) * take;
  return await search(db, {
    term,
    tolerance: 10,
    limit: take,
    offset,
    properties: ["verse"],
    sortBy: {
      property: "id",
      order: "ASC",
    },
  });
};

const nvi = await createMemoryDB();

await fillMemoryDB(nvi);

export const searchNviBeta = async (c: Context) => {
  const { q, take, page } = c.req.query();

  if (!q) {
    c.status(400);
    return c.json([]);
  }

  const t = take ? Number(take) : 10;
  const p = page ? Number(page) : 1;
  const vers = await findVerses(nvi, q, t, p);

  const total = vers.count as number;
  const data = {
    matches: vers.hits,
    page: p,
    pageSize: t,
    pageCount: Math.ceil(total / t),
    total,
  };

  return c.json(data);
};
