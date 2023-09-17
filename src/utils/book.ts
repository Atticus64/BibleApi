import { books } from "$/scraping/index.ts";

const oldTestamentbooks = books.filter((b) => {
  return b.testament === "Antiguo Testamento";
});

const newTestamentbooks = books.filter((b) => {
  return b.testament === "Nuevo Testamento";
});

export const isInOldTestament = (book: string) => {
  return oldTestamentbooks.some((b) => b.name.toLowerCase() === book);
};

export const isInNewTestament = (book: string) => {
  return newTestamentbooks.some((b) => b.name.toLowerCase() === book);
};

export const getInfoBook = (book: string) => {
  return books.find((b) => b.name.toLowerCase() === book.toLowerCase());
};
