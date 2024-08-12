import { Hono } from "hono";
import { existBook, getInfoBook } from "$/utils/book.ts";
import { invalidBookError, invalidChapterError, validVerse } from "$/validators/book.ts";
import { validator } from "jsr:@hono/hono/validator";
import { GetAcrossVersions } from "$/controllers/verses.ts";

export const router_verses = new Hono();

router_verses.get(
  "/across/:book/:chapter/:verse",
  validator("param", (v, c) => {
    const { book } = v;
    if (!existBook(book)) {
      return invalidBookError(c, book);
    }
    return v;
  }),
  validator("param", (v, c) => {
    const { chapter } = v;
    const info = getInfoBook(v.book);
    const chap = Number(chapter);
    if (info.chapters < chap || chap < 1 || isNaN(chap)) {
      return invalidChapterError(c, chapter, info.chapters);
    }
    return v;
  }),
  validator("param", validVerse),
  (c) => {
    const { book, chapter, verse } = c.req.valid("param");

    return GetAcrossVersions(book, chapter, verse)
      .then((data) => {
        return c.json({
          results: data
        })
      })
})