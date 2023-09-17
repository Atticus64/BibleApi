import { describe, it } from "std/testing/bdd.ts";
import { app } from "$/mod.ts";
import { assertEquals } from "std/testing/asserts.ts";

describe("Books test", () => {
  it("Should return book info", async () => {
    const response = await app.request("/api/book/Genesis", { method: "GET" });

    const json = await response.json();

    assertEquals(json, {
      abrev: "GEN",
      chapters: 50,
      name: "Genesis",
      testament: "Antiguo Testamento",
    });
  });
});
