import { describe, it } from "https://deno.land/std@0.201.0/testing/bdd.ts";
import { app } from "../src/mod.ts";
import { assertEquals } from "https://deno.land/std@0.201.0/testing/asserts.ts";

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
