import { Hono } from "hono";
import { validator } from "hono/validator";
import { getBookInfo } from "$/controllers/book.ts";
import { invalidBookError } from "$/validators/book.ts";
import { existBook, getNameByAbbreviation, isAbbreviation } from "$/utils/book.ts";

const router_book = new Hono();

router_book.get("/:book", validator("param", (value, c) => {
  const { book } = value;

  if (isAbbreviation(book)) {
    value.book = getNameByAbbreviation(book) || book;
  }

  if (!existBook(value.book)) {
    return invalidBookError(c, value.book);
  }

  return value;
}), (c) => {
  const { book } = c.req.valid("param");
  return getBookInfo(c, book);
});

export default router_book;
