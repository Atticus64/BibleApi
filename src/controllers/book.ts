import { Context } from "hono/context.ts";
import { getInfoBook, isInNewTestament, isInOldTestament } from "$/utils/book.ts";
import { books } from "$/scraping/index.ts";

export const getBookInfo = (c: Context) => {
	const book = c.req.param("book");

	if(!isInNewTestament(book) && !isInOldTestament(book)) {
		c.status(400)

		return c.json({
			error: "book not found"
		})
	}

	const info = getInfoBook(book)

	c.status(200);
	return c.json({
		...info
	})
}


export const getBooks = (c: Context) => {
	c.status(200);

	const data = books.map(b => ({
			name: b.name,
			chapters: b.chapters,
			testament: b.testament
	}));

	return c.json(data)
}

