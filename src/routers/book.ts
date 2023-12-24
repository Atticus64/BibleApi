import { Hono, validator } from "hono/mod.ts";
import { getBookInfo } from "$/controllers/book.ts";
import { checkBook } from "$/validators/book.ts";

const router_book = new Hono();

router_book.get("/:book", validator("param", checkBook), getBookInfo);

export default router_book;
