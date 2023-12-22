import { Version } from "$/constants.ts";
import { Context } from "hono/mod.ts";
import { Book, books } from "$/constants.ts";
import { getFolder } from "$/scraping/scrape.ts";

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

function formatMatch(match: Match): Match {
  if (!match.study) {
    return {
      passage: match.passage,
      verse: match.verse,
      url: match.url,
      id: match.id,
    };
  }

  return {
    study: match.study,
    url: match.url,
    passage: match.passage,
    verse: match.verse,
    id: match.id,
  };
}

interface ErrorRes {
  error: string;
  data?: undefined;
  meta?: undefined;
}

interface Result {
  data: {
    books: Book[];
    vers: Match[];
  };
  meta: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  error?: undefined;
}

export async function searchVersion(c: Context, version: Version) {
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

  let data: Result | ErrorRes;
  if (!take && !page) {
    data = await search({ version, query: q, testament: test });
  } else if (!page) {
    data = await search({
      version,
      query: q,
      take: Number(take),
      testament: test,
    });
  } else if (!take) {
    data = await search({
      version,
      query: q,
      page: Number(page),
      testament: test,
    });
    return c.json(data);
  } else {
    data = await search({
      version,
      query: q,
      take: Number(take),
      page: Number(page),
      testament: test,
    });
  }

  if (data.error) {
    c.status(400);
    return c.json(data);
  }

  return c.json(data);
}

export interface searchProps {
  version: Version;
  query: string;
  take?: number;
  page?: number;
  testament?: "both" | "old" | "new";
}

export async function search(
  { version, query, take = 10, page = 1, testament = "both" }: searchProps,
) {
  const versionFolder = getFolder(version);
  const raw = await Deno.readTextFile(`./db/${versionFolder}/index.json`);
  const info: Verse[] = JSON.parse(raw);

  let booksFound: Book[] = [];
  const matches: Match[] = [];

  if (!testament) {
    testament = "both";
  }

  if (testament === "both") {
    info.forEach(({ book, chapter, verse, passage, study, id }) => {
      if (verse.toLowerCase().includes(query.toLowerCase())) {
        const url =
          `https://bible-study.vercel.app/chapter/${versionFolder}/${book.toLowerCase()}/${chapter}`;

        const match: Match = formatMatch({
          passage,
          url,
          verse,
          id,
          study,
        });

        matches.push(match);
      }
    });

    booksFound = books.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (testament === "old") {
    info.filter((v) => v.testament === "old").forEach(
      ({ book, chapter, verse, passage, study, id }) => {
        if (verse.toLowerCase().includes(query.toLowerCase())) {
          const url =
            `https://bible-study.vercel.app/chapter/${versionFolder}/${book.toLowerCase()}/${chapter}`;

          const match: Match = formatMatch({
            passage,
            url,
            verse,
            id,
            study,
          });

          matches.push(match);
        }
      },
    );

    booksFound = books.filter((b) => b.testament === "Antiguo Testamento")
      .filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));
  } else if (testament === "new") {
    info.filter((v) => v.testament === "new").forEach(
      ({ book, chapter, verse, passage, study, id }) => {
        if (verse.toLowerCase().includes(query.toLowerCase())) {
          const url =
            `https://bible-study.vercel.app/chapter/${versionFolder}/${book.toLowerCase()}/${chapter}`;

          const match: Match = formatMatch({
            passage,
            url,
            verse,
            id,
            study,
          });

          matches.push(match);
        }
      },
    );

    booksFound = books.filter((b) => b.testament === "Nuevo Testamento").filter(
      (b) => b.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  let count = 0;
  let items = [];
  const box: Match[][] = [];
  for (const v of matches) {
    count++;
    if (items.length === take) {
      box.push(items);
      items = [];
    }
    items.push(v);
  }
  box.push(items);

  if (page <= 0) {
    return {
      error: "page must be greater than 0",
    };
  }

  if (page > box.length) {
    return {
      error: "page must be less than or equal to the number of pages",
    };
  }

  return {
    data: {
      books: booksFound,
      vers: box[page - 1],
    },
    meta: {
      page: page,
      pageSize: take,
      pageCount: box.length,
      total: matches.length,
    },
  };
}

interface Chap {
  chapter: string;
  vers: Verse[];
}

interface Data {
  "name": string;
  "num_chapters": number;
  "chapters": Chap[];
}

async function task() {
  const verses: Verse[] = [];

  for await (const entry of Deno.readDir(`./db/dhh/oldTestament`)) {
    const file = await Deno.readTextFile(`./db/dhh/oldTestament/${entry.name}`);
    const info: Data = JSON.parse(file);
    info.chapters.forEach((c) => {
      if (!c.chapter) {
        console.log("no existe chap");
        console.log(c.vers[0].verse);
        console.log(entry.name);
      }
      c.vers.forEach((v) => {
        v.chapter = c.chapter;

        v.passage = `${entry.name.split(".")[0]} ${v.chapter}:${v.number}`;
        v.book = entry.name.split(".")[0];
        verses.push(v);
      });
    });
  }

  for await (const entry of Deno.readDir(`./db/dhh/newTestament`)) {
    const file = await Deno.readTextFile(`./db/dhh/newTestament/${entry.name}`);
    const info: Data = JSON.parse(file);
    info.chapters.forEach((c) => {
      c.vers.forEach((v) => {
        v.chapter = c.chapter;
        v.passage = `${entry.name.split(".")[0]} ${v.chapter}:${v.number}`;
        v.book = entry.name.split(".")[0];
        verses.push(v);
      });
    });
  }

  const data = JSON.stringify(verses, null, "\t");
  Deno.writeTextFile(`./db/dhh/index.json`, data);
}
