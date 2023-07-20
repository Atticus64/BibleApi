import { Context } from "hono/context.ts";
import { getInfoBook, isInNewTestament, isInOldTestament } from "$/utils/book.ts";

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



