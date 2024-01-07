import { app } from "$/mod.ts";

if (import.meta.main) {
	Deno.serve(app.fetch);
}
