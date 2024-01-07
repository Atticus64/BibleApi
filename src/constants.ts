import { z } from "zod";

const Testaments = ["Antiguo Testamento", "Nuevo Testamento"] as const;
export type Testament = typeof Testaments[number];

export interface Book {
	names: string[];
	chapters: number;
	abrev: string;
	testament: Testament;
	englishName?: string;
}

export enum Version {
	Rv60 = "rv1960",
	Rv95 = "rv1995",
	Nvi = "nvi",
	Dhh = "dhh",
	Pdt = "pdt",
	KJV = "kjv",
}

export type Table =
	| "verses_rv1960"
	| "verses_kjv"
	| "verses_rv1995"
	| "verses_nvi"
	| "verses_pdt"
	| "verses_dhh";

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
		case Version.KJV:
			return "King James Version";
		default:
			return v;
	}
};

export const VerseSchema = z.object({
	verse: z.string(),
	number: z.number(),
	study: z.string().nullish(),
	id: z.number(),
});

export type Verse = z.infer<typeof VerseSchema>;

export type DataBook = {
	name: string;
	num_chapters: number;
	chapters: { chapter: string; vers: Verse[]; verses: Verse[] }[];

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

/*
 * Array of Bible books
 * Elements
 * {string} name
 * {number} chapters
 */
export const books: Book[] = [
	{
		names: ["Genesis"],
		abrev: "GN",
		chapters: 50,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Exodo", "Exodus"],
		abrev: "EX",
		chapters: 40,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Levitico", "Leviticus"],
		abrev: "LV",
		chapters: 27,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Numeros", "Numbers"],
		abrev: "NM",
		chapters: 36,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Deuteronomio", "Deuteronomy"],
		abrev: "DT",
		chapters: 34,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Josue", "Joshua"],
		abrev: "JOS",
		chapters: 24,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Jueces", "Judges"],
		abrev: "JUE",
		chapters: 21,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Rut", "Ruth"],
		abrev: "RT",
		chapters: 4,
		testament: "Antiguo Testamento",
	},
	{
		names: ["1-Samuel"],
		abrev: "1S",
		chapters: 31,
		testament: "Antiguo Testamento",
	},
	{
		names: ["2-Samuel"],
		abrev: "2S",
		chapters: 24,
		testament: "Antiguo Testamento",
	},
	{
		names: ["1-Reyes", "1-Kings"],
		abrev: "1R",
		chapters: 22,
		testament: "Antiguo Testamento",
	},
	{
		names: ["2-Reyes", "2-Kings"],
		abrev: "2R",
		chapters: 25,
		testament: "Antiguo Testamento",
	},
	{
		names: ["1-Cronicas", "1-Chronicles"],
		abrev: "1CR",
		chapters: 29,
		testament: "Antiguo Testamento",
	},
	{
		names: ["2-Cronicas", "2-Chronicles"],
		abrev: "2CR",
		chapters: 36,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Esdras", "Ezra"],
		abrev: "ESD",
		chapters: 10,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Nehemias", "Nehemiah"],
		abrev: "NEH",
		chapters: 13,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Ester", "Esther"],
		abrev: "EST",
		chapters: 10,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Job"],
		abrev: "JOB",
		chapters: 42,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Salmos", "Psalms"],
		abrev: "SAL",
		chapters: 150,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Proverbios", "Proverbs"],
		abrev: "PR",
		chapters: 31,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Eclesiastes", "Ecclesiastes"],
		abrev: "EC",
		chapters: 12,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Cantares", "Song of Solomon"],
		abrev: "CNT",
		chapters: 8,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Isaias", "Isaiah"],
		abrev: "IS",
		chapters: 66,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Jeremias", "Jeremiah"],
		abrev: "JER",
		chapters: 52,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Lamentaciones", "Lamentations"],
		abrev: "LM",
		chapters: 5,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Ezequiel", "Ezekiel"],
		abrev: "EZ",
		chapters: 48,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Daniel"],
		abrev: "DN",
		chapters: 12,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Oseas", "Hosea"],
		abrev: "OS",
		chapters: 14,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Joel"],
		abrev: "JL",
		chapters: 3,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Amos"],
		abrev: "AM",
		chapters: 9,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Abdias", "Obadiah"],
		abrev: "ABD",
		chapters: 1,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Jonas", "Jonah"],
		abrev: "JON",
		chapters: 4,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Miqueas", "Micah"],
		abrev: "MI",
		chapters: 7,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Nahum"],
		abrev: "NAH",
		chapters: 3,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Habacuc", "Habakkuk"],
		abrev: "HAB",
		chapters: 3,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Sofonias", "Zephaniah"],
		abrev: "SOF",
		chapters: 3,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Hageo", "Haggai"],
		abrev: "HAG",
		chapters: 2,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Zacarias", "Zechariah"],
		abrev: "ZAC",
		chapters: 14,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Malaquias", "Malachi"],
		abrev: "MAL",
		chapters: 4,
		testament: "Antiguo Testamento",
	},
	{
		names: ["Mateo", "Matthew"],
		abrev: "MT",
		chapters: 28,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Marcos", "Mark"],
		abrev: "MR",
		chapters: 16,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Lucas", "Luke"],
		abrev: "LC",
		chapters: 24,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Juan", "John"],
		abrev: "JN",
		chapters: 21,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Hechos", "Acts"],
		abrev: "HCH",
		chapters: 28,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Romanos", "Romans"],
		abrev: "RO",
		chapters: 16,
		testament: "Nuevo Testamento",
	},
	{
		names: ["1-Corintios", "Corinthians"],
		abrev: "1CO",
		chapters: 16,
		testament: "Nuevo Testamento",
	},
	{
		names: ["2-Corintios", "2-Corinthians"],
		abrev: "2CO",
		chapters: 13,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Galatas", "Galatians"],
		abrev: "GA",
		chapters: 6,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Efesios", "Ephesians"],
		abrev: "EF",
		chapters: 6,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Filipenses", "Philippians"],
		abrev: "FIL",
		chapters: 4,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Colosenses", "Colossians"],
		abrev: "COL",
		chapters: 4,
		testament: "Nuevo Testamento",
	},
	{
		names: ["1-Tesalonicenses", "1-Thessalonians"],
		abrev: "1TS",
		chapters: 5,
		testament: "Nuevo Testamento",
	},
	{
		names: ["2-Tesalonicenses", "2-Thessalonians"],
		abrev: "2TS",
		chapters: 3,
		testament: "Nuevo Testamento",
	},
	{
		names: ["1-Timoteo", "Timothy"],
		abrev: "1TI",
		chapters: 6,
		testament: "Nuevo Testamento",
	},
	{
		names: ["2-Timoteo", "2-Timothy"],
		abrev: "2TI",
		chapters: 4,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Tito", "Titus"],
		abrev: "TIT",
		chapters: 3,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Filemon", "Philemon"],
		abrev: "FLM",
		chapters: 1,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Hebreos", "Hebrews"],
		abrev: "HE",
		chapters: 13,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Santiago", "James"],
		abrev: "STG",
		chapters: 5,
		testament: "Nuevo Testamento",
	},
	{
		names: ["1-Pedro", "1-Peter"],
		abrev: "1P",
		chapters: 5,
		testament: "Nuevo Testamento",
	},
	{
		names: ["2-Pedro", "2-Peter"],
		abrev: "2P",
		chapters: 3,
		testament: "Nuevo Testamento",
	},
	{
		names: ["1-Juan", "1-John"],
		abrev: "1JN",
		chapters: 5,
		testament: "Nuevo Testamento",
	},
	{
		names: ["2-Juan", "2-John"],
		abrev: "2JN",
		chapters: 1,
		testament: "Nuevo Testamento",
	},
	{
		names: ["3-Juan", "3-John"],
		abrev: "3JN",
		chapters: 1,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Judas", "Jude"],
		abrev: "JUD",
		chapters: 1,
		testament: "Nuevo Testamento",
	},
	{
		names: ["Apocalipsis", "Revelation"],
		abrev: "AP",
		chapters: 22,
		testament: "Nuevo Testamento",
	},
];
