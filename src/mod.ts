import { Hono } from "hono/mod.ts";
import { cors } from "middleware/cors/index.ts";
import router_rv60 from "$/routers/rv60.ts";
import router_rv95 from "$/routers/rv95.ts";
import router_nvi from "$/routers/nvi.ts";
import router_dhh from "$/routers/Dhh.ts";
import router_book from "$/routers/book.ts";
import router_auth from "$/routers/auth.ts";
import router_notes from "$/routers/notes.ts";
import { isAuthenticated } from "$/middlewares/authorization.ts";
import router_user from "$/routers/user.ts";
import { getBooks } from "$/controllers/book.ts";
import { deleteUser } from "$/controllers/user.ts";

const origin = ['http://localhost:5173', 'http://localhost:8000', 'https://bible-api.deno.dev', 'https://bible-study.vercel.app']

const app = new Hono();

app.use("/notes/*", cors({ origin, credentials: true })); 

app.use("/auth/*", cors({ origin, credentials: true })); 

app.use("/user/*", cors({ origin, credentials: true })); 

app.route("/auth", router_auth);

app.use("/notes/*", isAuthenticated);

app.route("/notes", router_notes);

app.use("/user/*", isAuthenticated);

app.post("/admin/user", deleteUser);

app.route("/user", router_user);

app.use("/api/*", cors());

app.get("/api", (c) => {
	return c.json({
		versions: [
			"rv1960",
			"rv1995",
			"Nvi",
			"Dhh"
		],
		endpoints: [
			"/api/rv1960/book/genesis/1",
			"/api/rv1995/book/genesis/1",
			"/api/nvi/book/genesis/1",
			"/api/dhh/book/genesis/1",
		],
	});
});

// servir la version reina valera 1960
app.route("/api/rv1960", router_rv60);

// servir la version reina valera 1909
app.route("/api/rv1995", router_rv95);

// servir la  version traduccion lenguaje actual
app.route("/api/nvi", router_nvi);

app.route("/api/dhh", router_dhh);

app.route("/api/book", router_book)

app.get("/api/books", getBooks);

app.notFound((c) => {
	const { pathname } = new URL(c.req.url);

	if (c.req.url.at(-1) === "/") {
		return c.redirect(pathname.slice(0, -1));
	}

	return c.json({ message: "Not Found" }, 404);
});


export default app;


