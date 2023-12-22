import { books } from "$/constants.ts";

const oldTestamentbooks = books.filter((b) => {
  return b.testament === "Antiguo Testamento";
});

const newTestamentbooks = books.filter((b) => {
  return b.testament === "Nuevo Testamento";
});

export const isAbbreviation = (book: string) => {
	return books.some((b) => {
		return b.abrev === book.toUpperCase()
	})
}

export const getNameByAbbreviation = (book: string) => {
	return books.find((b) => {
		return b.abrev === book.toUpperCase()
	})?.name
}

export const isInOldTestament = (book: string) => {
  return oldTestamentbooks.some((b) => b.name.toLowerCase() === book.toLowerCase());
};

export const isInNewTestament = (book: string) => {
  return newTestamentbooks.some((b) => b.name.toLowerCase() === book.toLowerCase());
};

export const getInfoBook = (book: string) => {
  return books.find((b) => b.name.toLowerCase() === book.toLowerCase());
};
