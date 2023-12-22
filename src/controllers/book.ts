import { Context } from "hono/context.ts";
import {
  getInfoBook,
  isInNewTestament,
  isInOldTestament,
} from "$/utils/book.ts";
import { Testament, books } from "$/constants.ts";

export const getBookInfo = (c: Context): Response => {
  const paramBook = c.req.param("book");

  if (!paramBook) {
    c.status(400);
    return c.json({
      error: "book not found",
    });
  }

  const book = paramBook.toLowerCase();

  if (!isInNewTestament(book) && !isInOldTestament(book)) {
    c.status(400);

    return c.json({
      error: "book not found",
    });
  }

  const info = getInfoBook(book);

  c.status(200);
  return c.json({
    ...info,
  });
};

export const getTestamentBooks = (c: Context, testament: "old" | "new") => {
	const esTestament = testament === "old" ? "Antiguo Testamento" : "Nuevo Testamento";
	return c.json(books.filter((b) => b.testament === esTestament));
}

export const getBooks = (c: Context) => {
  c.status(200);

  return c.json(books);
};
