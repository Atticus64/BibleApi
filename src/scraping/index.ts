import { parse } from "flags";
import { DataBook, scrapeVersion, Version } from "$/scraping/scrape.ts";

const start = performance.now();

const flags = parse(Deno.args, {
  boolean: ["help"],
  string: ["version"],
  default: { help: false },
});

const Testaments = ["Antiguo Testamento", "Nuevo Testamento"] as const;
export type Testament = typeof Testaments[number];

export interface Book {
  name: string;
  chapters: number;
  abrev: string;
  testament: Testament;
}

/*
 * Array of Bible books
 * Elements
 * {string} name
 * {number} chapters
 */
export const books: Book[] = [
  {
    name: "Genesis",
    abrev: "GEN",
    chapters: 50,
    testament: "Antiguo Testamento",
  },
  {
    name: "Exodo",
    abrev: "EXO",
    chapters: 40,
    testament: "Antiguo Testamento",
  },
  {
    name: "Levitico",
    abrev: "LEV",
    chapters: 27,
    testament: "Antiguo Testamento",
  },
  {
    name: "Numeros",
    abrev: "NUM",
    chapters: 36,
    testament: "Antiguo Testamento",
  },
  {
    name: "Deuteronomio",
    abrev: "DEU",
    chapters: 34,
    testament: "Antiguo Testamento",
  },
  {
    name: "Josue",
    abrev: "JOS",
    chapters: 24,
    testament: "Antiguo Testamento",
  },
  {
    name: "Jueces",
    abrev: "JDG",
    chapters: 21,
    testament: "Antiguo Testamento",
  },
  {
    name: "Rut",
    abrev: "RUT",
    chapters: 4,
    testament: "Antiguo Testamento",
  },
  {
    name: "1-Samuel",
    abrev: "1SA",
    chapters: 31,
    testament: "Antiguo Testamento",
  },
  {
    name: "2-Samuel",
    abrev: "2SA",
    chapters: 24,
    testament: "Antiguo Testamento",
  },
  {
    name: "1-Reyes",
    abrev: "1KI",
    chapters: 22,
    testament: "Antiguo Testamento",
  },
  {
    name: "2-Reyes",
    abrev: "2KI",
    chapters: 25,
    testament: "Antiguo Testamento",
  },
  {
    name: "1-Cronicas",
    abrev: "1CH",
    chapters: 29,
    testament: "Antiguo Testamento",
  },
  {
    name: "2-Cronicas",
    abrev: "2CH",
    chapters: 36,
    testament: "Antiguo Testamento",
  },
  {
    name: "Esdras",
    abrev: "EZR",
    chapters: 10,
    testament: "Antiguo Testamento",
  },
  {
    name: "Nehemias",
    abrev: "NEH",
    chapters: 13,
    testament: "Antiguo Testamento",
  },
  {
    name: "Ester",
    abrev: "EST",
    chapters: 10,
    testament: "Antiguo Testamento",
  },
  {
    name: "Job",
    abrev: "JOB",
    chapters: 42,
    testament: "Antiguo Testamento",
  },
  {
    name: "Salmos",
    abrev: "PSA",
    chapters: 150,
    testament: "Antiguo Testamento",
  },
  {
    name: "Proverbios",
    abrev: "PRO",
    chapters: 31,
    testament: "Antiguo Testamento",
  },
  {
    name: "Eclesiastes",
    abrev: "ECC",
    chapters: 12,
    testament: "Antiguo Testamento",
  },
  {
    name: "Cantares",
    abrev: "SON",
    chapters: 8,
    testament: "Antiguo Testamento",
  },
  {
    name: "Isaias",
    abrev: "ISA",
    chapters: 66,
    testament: "Antiguo Testamento",
  },
  {
    abrev: "JER",
    name: "Jeremias",
    chapters: 52,
    testament: "Antiguo Testamento",
  },
  {
    name: "Lamentaciones",
    abrev: "LAM",
    chapters: 5,
    testament: "Antiguo Testamento",
  },
  {
    name: "Ezequiel",
    abrev: "EZE",
    chapters: 48,
    testament: "Antiguo Testamento",
  },
  {
    name: "Daniel",
    abrev: "DAN",
    chapters: 12,
    testament: "Antiguo Testamento",
  },
  {
    name: "Oseas",
    abrev: "HOS",
    chapters: 14,
    testament: "Antiguo Testamento",
  },
  {
    name: "Joel",
    abrev: "JOE",
    chapters: 3,
    testament: "Antiguo Testamento",
  },
  {
    name: "Amos",
    abrev: "AMO",
    chapters: 9,
    testament: "Antiguo Testamento",
  },
  {
    name: "Abdias",
    abrev: "OBA",
    chapters: 1,
    testament: "Antiguo Testamento",
  },
  {
    name: "Jonas",
    abrev: "JON",
    chapters: 4,
    testament: "Antiguo Testamento",
  },

  {
    name: "Miqueas",
    abrev: "MIC",
    chapters: 7,
    testament: "Antiguo Testamento",
  },
  {
    name: "Nahum",
    abrev: "NAH",
    chapters: 3,
    testament: "Antiguo Testamento",
  },
  {
    name: "Habacuc",
    abrev: "HAB",
    chapters: 3,
    testament: "Antiguo Testamento",
  },
  {
    name: "Sofonias",
    abrev: "ZEP",
    chapters: 3,
    testament: "Antiguo Testamento",
  },
  {
    name: "Hageo",
    abrev: "HAG",
    chapters: 2,
    testament: "Antiguo Testamento",
  },
  {
    name: "Zacarias",
    abrev: "ZEC",
    chapters: 14,
    testament: "Antiguo Testamento",
  },
  {
    name: "Malaquias",
    abrev: "MAL",
    chapters: 4,
    testament: "Antiguo Testamento",
  },
  {
    name: "Mateo",
    abrev: "MAT",
    chapters: 28,
    testament: "Nuevo Testamento",
  },
  {
    name: "Marcos",
    abrev: "MAR",
    chapters: 16,
    testament: "Nuevo Testamento",
  },
  {
    name: "Lucas",
    abrev: "LUK",
    chapters: 24,
    testament: "Nuevo Testamento",
  },
  {
    name: "Juan",
    abrev: "JOH",
    chapters: 21,
    testament: "Nuevo Testamento",
  },
  {
    name: "Hechos",
    abrev: "ACT",
    chapters: 28,
    testament: "Nuevo Testamento",
  },
  {
    name: "Romanos",
    abrev: "ROM",
    chapters: 16,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Corintios",
    abrev: "1CO",
    chapters: 16,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Corintios",
    abrev: "2CO",
    chapters: 13,
    testament: "Nuevo Testamento",
  },
  {
    name: "Galatas",
    abrev: "GAL",
    chapters: 6,
    testament: "Nuevo Testamento",
  },
  {
    name: "Efesios",
    abrev: "EPH",
    chapters: 6,
    testament: "Nuevo Testamento",
  },
  {
    name: "Filipenses",
    abrev: "PHI",
    chapters: 4,
    testament: "Nuevo Testamento",
  },
  {
    name: "Colosenses",
    abrev: "COL",
    chapters: 4,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Tesalonicenses",
    abrev: "1TH",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Tesalonicenses",
    abrev: "2TH",
    chapters: 3,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Timoteo",
    abrev: "1TI",
    chapters: 6,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Timoteo",
    abrev: "2TI",
    chapters: 4,
    testament: "Nuevo Testamento",
  },
  {
    name: "Tito",
    abrev: "TIT",
    chapters: 3,
    testament: "Nuevo Testamento",
  },
  {
    name: "Filemon",
    abrev: "PHM",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "Hebreos",
    abrev: "HEB",
    chapters: 13,
    testament: "Nuevo Testamento",
  },
  {
    name: "Santiago",
    abrev: "JAS",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Pedro",
    abrev: "1PE",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Pedro",
    abrev: "2PE",
    chapters: 3,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Juan",
    abrev: "1JO",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Juan",
    abrev: "2JO",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "3-Juan",
    abrev: "3JO",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "Judas",
    abrev: "JUD",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "Apocalipsis",
    abrev: "REV",
    chapters: 22,
    testament: "Nuevo Testamento",
  },
];

//if (import.meta.main) {
//	if (!flags.version) {
//		console.log('Scraping all')
//		await scrapeVersion(Version.Nvi);
//		await scrapeVersion(Version.Rv60);
//		await scrapeVersion(Version.Rv95);
//		await scrapeVersion(Version.Dhh);
//	}

//	if (flags.version === "rv60" || flags.version === "rv1960") {
//		await scrapeVersion(Version.Rv60);
//	}

//	if (flags.version === "r95" || flags.version === "rv1995") {
//		await scrapeVersion(Version.Rv95);
//	}

//	if (flags.version === "dhh") {
//		await scrapeVersion(Version.Dhh);
//	}

//	if (flags.version === "nvi") {
//		await scrapeVersion(Version.Nvi);
//	}
//	console.log(`Call to scrape took ${performance.now() - start} milliseconds.`);
//}
