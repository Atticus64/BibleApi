import { app } from "$/mod.ts";
import { assertEquals } from "https://deno.land/std@0.210.0/testing/asserts.ts";
import { runTest } from "./setup.ts";

Deno.test("Should return book info", async () => {
  await runTest(async () => {
    const response = await app.request("/api/book/Genesis", { method: "GET" });

    const json = await response.json();

    assertEquals(json, {
      abrev: "GN",
      chapters: 50,
      names: ["Genesis"],
      testament: "Antiguo Testamento",
    });
  });
});

Deno.test("Should return book info with abrev", async () => {
  await runTest(async () => {
    const response = await app.request("/api/book/gn", { method: "GET" });

    const json = await response.json();

    assertEquals(json, {
      abrev: "GN",
      chapters: 50,
      names: ["Genesis"],
      testament: "Antiguo Testamento",
    });
  });
});

Deno.test("Should return 404 if book is not valid", async () => {
  await runTest(async () => {
    const response = await app.request("/api/book/123", { method: "GET" });

    const json = await response.json();

    assertEquals(json, {
      book: "123",
      error: "Invalid book",
      validBooks: "/api/books",
    });
  });
});
