import { Context } from "hono/mod.ts";
import { Testament } from "$/scraping/index.ts";
import { getFolder, Version } from "$/scraping/scrape.ts";
import { getInfoBook } from "$/utils/book.ts";

export const getChapter = async (
  c: Context,
  testament: Testament,
  version: Version,
): Promise<Response> => {
  const number = parseInt(c.req.param("chapter"));

  if (isNaN(number)) return c.notFound();

  const bookName = c.req.param("book") ?? c.req.param("bookName");
  const testamentFolder = testament === "Nuevo Testamento"
    ? "newTestament"
    : "oldTestament";
  const versionFolder = getFolder(version);

  const path =
    `${Deno.cwd()}/db/${versionFolder}/${testamentFolder}/${bookName}.json`;

  const book = await Deno.readTextFile(path);
  const chapter = number - 1;
  const data = JSON.parse(book);

  if (data.num_chapters < number || number === 0) {
    return c.notFound();
  }

  const chapterBook = data.chapters.at(chapter);

  const info = getInfoBook(bookName);

  const chapterData = {
    chapters: info!.chapters,
    testament: info!.testament,
    name: info!.name,
    ...chapterBook,
  };

  return c.json(chapterData);
};
