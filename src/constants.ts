const Testaments = ["Antiguo Testamento", "Nuevo Testamento"] as const;
export type Testament = typeof Testaments[number];

export interface Book {
  name: string;
  chapters: number;
  abrev: string;
  testament: Testament;
}

export enum Version {
  Rv60 = "rv1960",
  Rv95 = "rv1995",
  Nvi = "nvi",
  Dhh = "dhh",
  Pdt = "pdt",
}

export enum VersionBible {
  RV60 = "rv1960",
  RV95 = "rv1995",
  NVI = "nvi",
  DHH = "dhh",
  PDT = "pdt",
}

export type Table = 
	"verses_rv1960" 
| "verses_rv1995" 
| "verses_nvi" 
| "verses_pdt" 
| "verses_dhh";


export const getVersionName = (v: Version | VersionBible): string => {
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
	default:
		return v;
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


/*
 * Array of Bible books
 * Elements
 * {string} name
 * {number} chapters
 */
export const books: Book[] = [
  {
    name: "Genesis",
    abrev: "GN",
    chapters: 50,
    testament: "Antiguo Testamento",
  },
  {
    name: "Exodo",
    abrev: "EX",
    chapters: 40,
    testament: "Antiguo Testamento",
  },
  {
    name: "Levitico",
    abrev: "LV",
    chapters: 27,
    testament: "Antiguo Testamento",
  },
  {
    name: "Numeros",
    abrev: "NM",
    chapters: 36,
    testament: "Antiguo Testamento",
  },
  {
    name: "Deuteronomio",
    abrev: "DT",
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
    abrev: "JUE",
    chapters: 21,
    testament: "Antiguo Testamento",
  },
  {
    name: "Rut",
    abrev: "RT",
    chapters: 4,
    testament: "Antiguo Testamento",
  },
  {
    name: "1-Samuel",
    abrev: "1S",
    chapters: 31,
    testament: "Antiguo Testamento",
  },
  {
    name: "2-Samuel",
    abrev: "2S",
    chapters: 24,
    testament: "Antiguo Testamento",
  },
  {
    name: "1-Reyes",
    abrev: "1R",
    chapters: 22,
    testament: "Antiguo Testamento",
  },
  {
    name: "2-Reyes",
    abrev: "2R",
    chapters: 25,
    testament: "Antiguo Testamento",
  },
  {
    name: "1-Cronicas",
    abrev: "1CR",
    chapters: 29,
    testament: "Antiguo Testamento",
  },
  {
    name: "2-Cronicas",
    abrev: "2CR",
    chapters: 36,
    testament: "Antiguo Testamento",
  },
  {
    name: "Esdras",
    abrev: "ESD",
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
    abrev: "SAL",
    chapters: 150,
    testament: "Antiguo Testamento",
  },
  {
    name: "Proverbios",
    abrev: "PR",
    chapters: 31,
    testament: "Antiguo Testamento",
  },
  {
    name: "Eclesiastes",
    abrev: "EC",
    chapters: 12,
    testament: "Antiguo Testamento",
  },
  {
    name: "Cantares",
    abrev: "CNT",
    chapters: 8,
    testament: "Antiguo Testamento",
  },
  {
    name: "Isaias",
    abrev: "IS",
    chapters: 66,
    testament: "Antiguo Testamento",
  },
  {
    name: "Jeremias",
    abrev: "JER",
    chapters: 52,
    testament: "Antiguo Testamento",
  },
  {
    name: "Lamentaciones",
    abrev: "LM",
    chapters: 5,
    testament: "Antiguo Testamento",
  },
  {
    name: "Ezequiel",
    abrev: "EZ",
    chapters: 48,
    testament: "Antiguo Testamento",
  },
  {
    name: "Daniel",
    abrev: "DN",
    chapters: 12,
    testament: "Antiguo Testamento",
  },
  {
    name: "Oseas",
    abrev: "OS",
    chapters: 14,
    testament: "Antiguo Testamento",
  },
  {
    name: "Joel",
    abrev: "JL",
    chapters: 3,
    testament: "Antiguo Testamento",
  },
  {
    name: "Amos",
    abrev: "AM",
    chapters: 9,
    testament: "Antiguo Testamento",
  },
  {
    name: "Abdias",
    abrev: "ABD",
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
    abrev: "MI",
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
    abrev: "SOF",
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
    abrev: "ZAC",
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
    abrev: "MT",
    chapters: 28,
    testament: "Nuevo Testamento",
  },
  {
    name: "Marcos",
    abrev: "MR",
    chapters: 16,
    testament: "Nuevo Testamento",
  },
  {
    name: "Lucas",
    abrev: "LC",
    chapters: 24,
    testament: "Nuevo Testamento",
  },
  {
    name: "Juan",
    abrev: "JN",
    chapters: 21,
    testament: "Nuevo Testamento",
  },
  {
    name: "Hechos",
    abrev: "HCH",
    chapters: 28,
    testament: "Nuevo Testamento",
  },
  {
    name: "Romanos",
    abrev: "RO",
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
    abrev: "GA",
    chapters: 6,
    testament: "Nuevo Testamento",
  },
  {
    name: "Efesios",
    abrev: "EF",
    chapters: 6,
    testament: "Nuevo Testamento",
  },
  {
    name: "Filipenses",
    abrev: "FIL",
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
    abrev: "1TS",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Tesalonicenses",
    abrev: "2TS",
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
    abrev: "FLM",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "Hebreos",
    abrev: "HE",
    chapters: 13,
    testament: "Nuevo Testamento",
  },
  {
    name: "Santiago",
    abrev: "STG",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Pedro",
    abrev: "1P",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Pedro",
    abrev: "2P",
    chapters: 3,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Juan",
    abrev: "1JN",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Juan",
    abrev: "2JN",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "3-Juan",
    abrev: "3JN",
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
    abrev: "AP",
    chapters: 22,
    testament: "Nuevo Testamento",
  },
];


