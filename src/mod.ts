import { Hono } from "hono";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { cors } from "jsr:@hono/hono/cors";
import router_book from "$/routers/api/book.ts";
import router_auth from "$/routers/auth/index.ts";
import router_notes from "$/routers/api/notes.ts";
import { isAuthenticated } from "$/middlewares/authorization.ts";
import router_user from "$/routers/auth/user.ts";
import { getBooks, getTestamentBooks } from "$/controllers/api/book.ts";
import { deleteUser } from "$/controllers/auth/user.ts";
import { router_read } from "$/routers/api/read.ts";
import { getVersions, versions } from "$/controllers/api/version.ts";
import { router_verses } from "$/routers/api/verses.ts";

const DEV_ORIGINS: string[] = JSON.parse(Deno.env.get("ORIGINS") || "[]");
const origin = [
	...DEV_ORIGINS || [],
	"https://bible-api.deno.dev",
	"https://bible-study.vercel.app",
];

const app = new Hono();

app.use("/notes/*", cors({ origin, credentials: true }));
app.use("/auth/*", cors({ origin, credentials: true }));
app.use("/user/*", cors({ origin, credentials: true }));
app.use("/notes/*", isAuthenticated);

app.route("/auth", router_auth);

app.route("/notes", router_notes);

app.use("/user/*", isAuthenticated);

app.post("/admin/user", deleteUser);

app.route("/user", router_user);

app.use("/api/*", cors());

app.get("/api/checkhealth", (c) => {
  return c.json({ ok: true });
})

app.get("/api", (c) => {
	const versions = getVersions();

	const endpoints = versions.map((version) => {
		return `${version.uri}/genesis/1`;
	});

	return c.json({
		versions,
		endpoints,
	});
});

app.route("/api/read", router_read);

app.route("/api/verses", router_verses);

app.route("/api/book", router_book);

app.get("/api/books", getBooks);

app.get("/api/books/oldTestament", (c) => getTestamentBooks(c, "old"));

app.get("/api/books/newTestament", (c) => getTestamentBooks(c, "new"));

app.get("/api/versions", versions);

app.notFound((c) => {
	const { pathname } = new URL(c.req.url);

	if (c.req.url.at(-1) === "/") {
		return c.redirect(pathname.slice(0, -1));
	}

	return c.json({ message: "Not Found" }, 404);
});

export { app };
