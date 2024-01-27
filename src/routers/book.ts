import { Hono } from "hono";
import { validator } from "npm:hono/validator";
import { getBookInfo } from "$/controllers/book.ts";
import { checkBook } from "$/validators/book.ts";

const router_book = new Hono();

router_book.get("/:book", validator("param", checkBook), (c) => {
	const { book } = c.req.valid("param");
	return getBookInfo(c, book);
});

export default router_book;
