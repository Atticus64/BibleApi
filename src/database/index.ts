import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import postgres from "https://deno.land/x/postgresjs@v3.3.5/mod.js";

export function connect() {
	const dev = Deno.env.get("DEVELOP") ?? "";
	// if (dev !== "") {
	// return postgres(Deno.env.get("DATABASE_URL") ?? "");
	// }
	const sql = postgres(Deno.env.get("DATABASE_URL") ?? "", { ssl: false });
	return sql;
}
