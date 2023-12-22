import { Book, books } from "$/scraping/index.ts";
// import * as cherio from "cherio";
import { log } from "$/scraping/logger.ts";
const BiblePage = "https://www.biblia.es/biblia-buscar-libros-1.php";

interface Studies {
  v: number;
  study: string;
}

export enum Version {
  Rv60 = "rv1960",
  Rv95 = "rv1995",
  Nvi = "nvi",
  Dhh = "dhh",
  Pdt = "pdt",
}

export const getVersionName = (v: Version): string => {
  switch (v) {
    case Version.Dhh:
      return "Dios habla hoy";
    case Version.Nvi:
      return "Nueva version internacional";
    case Version.Rv95:
      return "Reina Valera 1995";
    case Version.Rv60:
      return "Reina Valera 1960";
	case Version.Pdt:
		return "Palabra de Dios para todos";
  }
};

export type Verse = {
  verse: string;
  number: number;
  study?: string;
  id: string;
};

export type DataBook = {
  name: string;
  num_chapters: number;
  chapters: { chapter: string; vers: Verse[] }[];
  book_id: string;
};

export const existDir = (dir: string): boolean => {
  try {
    Deno.readDirSync(dir);
    return true;
  } catch (_err) {
    return false;
  }
};

const getUrls = (book: string, chapters: number, version: Version) => {
  const urls = [];
  for (let i = 1; i <= chapters; i++) {
    urls.push(
      `${BiblePage}?libro=${book}&capitulo=${i}&version=${version}`,
    );
  }

  return urls;
};

// const scrapeBook = async (book: Book, version: Version) => {
  // const { name, chapters } = book;
  //
  // const acc = [];
  // const urls = getUrls(name, chapters, version);
  //
  // const requests = urls.map((url) => fetch(url));
  //
  // const resps = await Promise.all(requests);
  //
  // let i = 1;
  // for (const resp of resps) {
  //   const page = await resp.text();
  //
  //   // const $ = cherio.load(page);
  //
  //   const vers: Verse[] = [];
  //   const rawTitle = $("h3.capitulo").text().split(" ");
  //   //let book = "";
  //   let chapter = "";
  //
  //   const childrens = $("h2.estudio").parent().children().toArray();
  //
  //   // { name: fdafsdf, vers }
  //   const studies: Studies[] = [];
  //   const numbers: number[] = [];
  //   for (const child of childrens) {
  //     const hasStudio = $(child).hasClass("estudio");
  //     if (hasStudio) {
  //       const estudio = $(child).text();
  //       const versiculo = child.nextSibling;
  //       if (versiculo) {
  //         studies.push({
  //           v: Number($(versiculo).text()),
  //           study: estudio,
  //         });
  //         numbers.push(Number($(versiculo).text()));
  //       }
  //     }
  //   }
  //
  //   if (rawTitle[0].length > 1) {
  //     //book = rawTitle[0];
  //     chapter = rawTitle[1];
  //   } else {
  //     //book = `${rawTitle[0]} ${rawTitle[1]}`;
  //     chapter = rawTitle[2];
  //   }
  //
  //   $("span.texto").each((indx: number, item) => {
  //     const verse = $(item).text();
  //     const number = indx + 1;
  //     if (numbers.some((n) => n === number)) {
  //       const s = studies.find((study) => study.v === number);
  //       if (s !== undefined) {
  //         vers.push({
  //           verse,
  //           number,
  //           study: s.study,
  //           id: crypto.randomUUID(),
  //         });
  //         return;
  //       }
  //     }
  //     vers.push({
  //       verse,
  //       number,
  //       id: crypto.randomUUID(),
  //     });
  //   });
  //
  //   acc.push({ chapter, vers });
  //
  //   i++;
  // }
  //
//   const data: DataBook = {
//     name,
//     num_chapters: chapters,
//     chapters: acc,
//     book_id: crypto.randomUUID(),
//   };
//
//   return data;
// };

export const getFolder = (version: Version) => {
  if (version === Version.Nvi) {
    return "nvi";
  }

  if (version === Version.Rv60) {
    return "rv1960";
  }

  if (version === Version.Rv95) {
    return "rv1995";
  }

  if (version === Version.Dhh) {
    return "dhh";
  }
};

// export async function scrapeVersion(version: Version) {
//   const dir = `${Deno.cwd()}/db`;
//   const existPath = existDir(dir);
//   if (!existPath) {
//     Deno.mkdir(dir);
//   }
//
//   const folder = getFolder(version);
//   const path = `${Deno.cwd()}/db/${folder}`;
//   const existRv60Folder = existDir(path);
//   if (!existRv60Folder) {
//     Deno.mkdir(path);
//   }
//
//   for await (const book of books) {
//     const testamentFolder = book.testament === "Antiguo Testamento"
//       ? "oldTestament"
//       : "newTestament";
//     let Bookverses;
//     try {
//       Bookverses = await scrapeBook(book, version);
//       await Deno.writeTextFile(
//         `${Deno.cwd()}/db/${folder}/${testamentFolder}/${book.name.toLowerCase()}.json`,
//         JSON.stringify(Bookverses, null, "\t"),
//       );
//     } catch (error) {
//       if (error.message.includes("No such file or directory")) {
//         await Deno.mkdir(`${Deno.cwd()}/db/${folder}/${testamentFolder}/`);
//         Bookverses = await scrapeBook(book, version);
//         await Deno.writeTextFile(
//           `${Deno.cwd()}/db/rv1960/${testamentFolder}/${book.name.toLowerCase()}.json`,
//           JSON.stringify(Bookverses, null, "\t"),
//         );
//       } else {
//         throw new Error(error);
//       }
//     }
//
//     log(`Scraped ${book.name}`, "info");
//     Bookverses = [];
//   }
//
//   log(`Version ${version} scraped`, "info");
// }
