import { app } from "$/mod.ts";
import { assertEquals } from "https://deno.land/std@0.210.0/testing/asserts.ts";
import { runTest } from "./setup.ts";

Deno.test("Should return book info", async () => {
	await runTest( async () => {
		const response = await app.request("/api/book/Genesis", { method: "GET" });

		const json = await response.json();

		assertEquals(json, {
			abrev: "GN",
			chapters: 50,
			name: "Genesis",
			testament: "Antiguo Testamento",
		});
	})
});

Deno.test("Should return 404 if book is not valid", async () => {
	await runTest(async () => {

		const response = await app.request("/api/book/123", { method: "GET" });

		const json = await response.json();

		assertEquals(json, {
			error: "book not found",
		})
	})
})

