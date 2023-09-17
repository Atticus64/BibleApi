import { Hono } from "hono/mod.ts";
import { getBookInfo } from "$/controllers/book.ts";

const router_book = new Hono();

router_book.get("/:book", getBookInfo);

export default router_book;
