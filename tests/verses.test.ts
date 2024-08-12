import { assertEquals } from "jsr:@std/assert";
import { runTest } from "./setup.ts";
import { app } from "$/mod.ts";

Deno.test("Get verse Genesis 1:1", async () => {
	await runTest(async () => {
		const response = await app.request("/api/read/nvi/Genesis/1/1", {
			method: "GET",
		});

		const json = await response.json();
		assertEquals(json, {
			id: 1,
			number: 1,
			study: "La Creación",
			verse: "Dios,  en el principio, creó los cielos y la tierra.",
		});
	});
});

Deno.test("Get verses of Genesis 1", async () => {
	await runTest(async () => {
		const response = await app.request("/api/read/nvi/Genesis/1", {
			method: "GET",
		});

		const json = await response.json();

		assertEquals(json.vers.length, 31);
	});
});

Deno.test("Get verses of Corithians 1", async () => {
	await runTest(async () => {
		const response = await app.request("/api/read/nvi/1-Corintios/1", {
			method: "GET",
		});

		const json = await response.json();

		assertEquals(json.vers.length, 31);
		assertEquals(
			json.vers[0].verse,
			"Pablo,  llamado por la voluntad de Dios a ser apóstol de Cristo Jesús,  y nuestro hermano Sóstenes,",
		);
	});
});

Deno.test("Get verses of Genesis 1:1-2", async () => {
	await runTest(async () => {
		const response = await app.request("/api/read/nvi/Genesis/1/1-2", {
			method: "GET",
		});

		const json = await response.json();

		assertEquals(json.length, 2);
		assertEquals(
			json[1].verse,
			"La tierra era un caos total, las tinieblas cubrían el abismo, y el Espíritu de Dios iba y venía sobre la superficie de las aguas.",
		);
	});
});

Deno.test("Get verses of Psalms 1:1-2 in KJV", async () => {
	await runTest(async () => {
		const response = await app.request("/api/read/kjv/salmos/1/1-2", {
			method: "GET",
		});

		const json = await response.json();

		assertEquals(json.length, 2);
		assertEquals(
			json[1].verse,
			"But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
		);
	});
});

Deno.test("Get verses of Psalms 1:1-2 in KJV by abrevation", async () => {
	await runTest(async () => {
		const response = await app.request("/api/read/kjv/sal/1/1-2", {
			method: "GET",
		});

		const json = await response.json();

		assertEquals(json.length, 2);
		assertEquals(
			json[1].verse,
			"But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
		);
	});
});

Deno.test("Get verses of Psalms 1:1-2 in KJV by englishName", async () => {
	await runTest(async () => {
		const response = await app.request("/api/read/kjv/psalms/1/1-2", {
			method: "GET",
		});

		const json = await response.json();

		assertEquals(json.length, 2);
		assertEquals(
			json[1].verse,
			"But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
		);
	});
});

Deno.test("Invalid range should return 400", async () => {
	await runTest(async () => {
		const response = await app.request("/api/read/nvi/Genesis/1/2-1", {
			method: "GET",
		});

		const json = await response.json();

		assertEquals(response.status, 400);

		assertEquals(
			json,
			{ error: "Invalid range", range: "2-1" },
		);
	});
});
