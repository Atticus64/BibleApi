import { Context } from "hono";
import { getInfoBook } from "$/utils/book.ts";
import { books } from "$/constants.ts";

export const getBookInfo = (c: Context, book: string): Response => {
	const info = getInfoBook(book);

	c.status(200);
	return c.json({
		...info,
	});
};

export const getTestamentBooks = (c: Context, testament: "old" | "new") => {
	const esTestament = testament === "old"
		? "Antiguo Testamento"
		: "Nuevo Testamento";
	return c.json(books.filter((b) => b.testament === esTestament));
};

export const getBooks = (c: Context) => {
	c.status(200);

	return c.json(books);
};
