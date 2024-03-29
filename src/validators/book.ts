import { Context } from "hono";
import {
	existBook,
	getInfoBook,
	getNameByAbbreviation,
	isAbbreviation,
} from "$/utils/book.ts";

export const checkBook = (value: { book: string }, c: Context) => {
	const { book } = value;

	if (isAbbreviation(book)) {
		value.book = getNameByAbbreviation(book) || book;
	}

	if (!existBook(value.book)) {
		c.status(400);
		return c.json({
			error: "Invalid book",
			book,
			validBooks: "/api/books",
		});
	}

	return value;
};

export const validChapter = (
	value: { chapter: string; book: string },
	c: Context,
) => {
	const { chapter, book } = value;

	const info = getInfoBook(book);

	const chap = Number(chapter);

	if (info.chapters < chap || chap < 1 || isNaN(chap)) {
		c.status(400);
		return c.json({
			error: "Invalid chapter",
			chapter: value.chapter,
			chaptersInBook: info.chapters,
		});
	}

	return value;
};

export const validVerse = (value: { verse: string }, c: Context) => {
	const { verse } = value;

	const is_range = verse.includes("-");

	const num_verse = Number(verse);

	if (!is_range && isNaN(num_verse)) {
		c.status(400);
		return c.json({
			error: "Invalid verse",
			verse,
		});
	} else if (is_range) {
		const [r_start, r_end] = verse.split("-");
		const start = Number(r_start);
		const end = Number(r_end);

		const are_numbers = !isNaN(start) && !isNaN(end);
		const is_in_order = start < end;
		const is_zero = start === 0 && end === 0;

		if (!are_numbers || !is_in_order || is_zero) {
			c.status(400);
			return c.json({
				error: "Invalid range",
				range: verse,
			});
		}
	}

	return value;
};
