import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { runTest } from "./setup.ts";
import { app } from "$/mod.ts";

Deno.test("Search endpoint", async () => {

	await runTest(async () => {

		const response = await app.request("/api/read/nvi/search?q=Dios", { method: "GET" });

		const json = await response.json();
		assertEquals(json.data.length, 10);
		assertEquals(json.data[0], {
			book: "Genesis",
			chapter: 1,
			id: 1,
			number: 1,
			study: "La Creación",
			verse: "Dios,  en el principio, creó los cielos y la tierra.",
		});
	})

})


