import { Hono } from "hono";
import { validator } from "jsr:@hono/hono/validator";
import {
  getChapterVersion,
  getEndpoits,
  getOneVerseVersion,
  SearchVersion,
  validVersion,
} from "$/controllers/api/read.ts";
import { randomVerse } from "$/controllers/api/random.ts";
import { invalidVersionResponse } from "$/validators/version.ts";
import { invalidBookError, invalidChapterError, validVerse } from "$/validators/book.ts";
import { Query, validQueries } from "$/validators/search.ts";
import { Version } from "$/constants.ts";
import { existBook, getInfoBook, getNameByAbbreviation, isAbbreviation } from "$/utils/book.ts";

const router_read = new Hono();

router_read.get("/:version", validator("param", (v, c) => {
  const { version } = v;
  if (!validVersion(version)) {
    return invalidVersionResponse(c, version);
  }
  return version;
}), (c) => {
  const version = c.req.valid("param");
  return getEndpoits(c, version);
});

router_read.get(
  "/:version/verse/random",
  validator("param", (v, c) => {
    const { version } = v;
    if (!validVersion(version)) {
      return invalidVersionResponse(c, version);
    }
    return version;
  }),
  (c) => {
    const version = c.req.valid("param");
    return randomVerse(c, version);
  },
);

router_read.get(
  "/:version/search",
  validator("param", (v, c) => {
    const { version } = v;
    if (!validVersion(version)) {
      return invalidVersionResponse(c, version);
    }
    return version;
  }),
  validator("query", validQueries),
  (c) => {
    const query: Query = c.req.valid("query");
    const version = c.req.valid("param");

    return SearchVersion(c, version as Version, query);
  },
);

router_read.get(
  "/:version/:book/:chapter/:verse",
  validator("param", (v, c) => {
    const { version } = v;
    if (!validVersion(version)) {
      return invalidVersionResponse(c, version);
    }
    return { version };
  }),
  validator("param", (value, c) => {
    const { book } = value;

    if (isAbbreviation(book)) {
      value.book = getNameByAbbreviation(book) || book;
    }

    if (!existBook(value.book)) {
      return invalidBookError(c, value.book);
    }

    return value;
  }),
  validator("param", (value, c) => {
    const { chapter, book } = value;

    const info = getInfoBook(book);

    const chap = Number(chapter);

    if (info.chapters < chap || chap < 1 || isNaN(chap)) {
      return invalidChapterError(c, chapter, value.chapters);
    } 

    return value;
  }),
  validator("param", validVerse),
  (c) => {
    const bookData = c.req.valid("param");

    const data = {
      book: bookData.book,
      version: bookData.version,
      verse: bookData.verse,
      chapter: Number(bookData.chapter),
    };

    return getOneVerseVersion(c, data);
  },
);

router_read.get(
  "/:version/:book/:chapter",
  validator("param", (v, c) => {
    const { version } = v;
    if (!validVersion(version)) {
      return invalidVersionResponse(c, version);
    }
    return { version };
  }),
  validator("param", (value, c) => {
    const { chapter, book } = value;

    const info = getInfoBook(book);

    const chap = Number(chapter);

    if (info.chapters < chap || chap < 1 || isNaN(chap)) {
      return invalidChapterError(c, chapter, value.chapters);
    }

    return value;
  }),
  validator("param", (value, c) => {
    const { book } = value;

    if (isAbbreviation(book)) {
      value.book = getNameByAbbreviation(book) || book;
    }

    if (!existBook(value.book)) {
      return invalidBookError(c, value.book);
    }

    return value;
  }),
  (c) => {
    const bookData = c.req.valid("param");
    const data = {
      version: bookData.version,
      book: bookData.book,
      chapter: Number(bookData.chapter),
    };

    return getChapterVersion(c, data);
  },
);

export { router_read };
