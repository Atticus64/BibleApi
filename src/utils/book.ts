import { books } from "$/constants.ts";
import { format, toValidName } from "$/controllers/api/read.ts";

const oldTestamentbooks = books.filter((b) => {
	return b.testament === "Antiguo Testamento";
});

const newTestamentbooks = books.filter((b) => {
	return b.testament === "Nuevo Testamento";
});

export const isAbbreviation = (book: string) => {
	return books.some((b) => {
		return b.abrev === book.toUpperCase();
	});
};

export function existBook(book: string): boolean {
	const exists = books.some((bk) => {
		return bk.names.some((name) => {
			return name.toLowerCase() === book.toLowerCase();
		});
	});

	return exists;
}

function getName(names: string[], book: string) {
	return names.find((n) => {
		if (n.toLowerCase() === book.toLowerCase()) {
			return n;
		}
	});
}

export const getNameByAbbreviation = (book: string) => {
	const bk = books.find((b) => {
		if (b.abrev === book.toUpperCase()) {
			return b;
		}
	});

	if (!bk) {
		return;
	}

	return bk.names[0];
};

export const isInOldTestament = (book: string) => {
	return oldTestamentbooks.some((b) => {
		b.names.forEach((n) => {
			return n.toLowerCase() === book.toLowerCase();
		});
	});
};

export const isInNewTestament = (book: string) => {
	return newTestamentbooks.some((b) => {
		b.names.forEach((n) => {
			return n.toLowerCase() === book.toLowerCase();
		});
	});
};

const isEnglishBook = (book: string) => {
	return books.some((b) => {
		const englishName = b.names[b.names.length - 1];
		if (englishName.toLowerCase() === book.toLowerCase()) {
			return b;
		}
	});
};

const getSpanishName = (book: string) => {
	const bk = books.find((b) => {
		const englishName = b.names[b.names.length - 1];
		if (englishName.toLowerCase() === book.toLowerCase()) {
			return b;
		}
	});

	return bk?.names[0];
};

export const getInfoBook = (book: string) => {
	let name: string | undefined = book;
	if (isAbbreviation(book)) {
		name = getNameByAbbreviation(book);
	}

	if (isEnglishBook(book)) {
		name = getSpanishName(book) ?? book;
	}

	const validName = toValidName(name ?? book);

	const bk = books.find((b) => {
		if (b.names.includes(validName)) {
			return b;
		}
	});

	return bk ?? books[0];
};
