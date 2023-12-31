import { books } from "$/constants.ts";

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

export const getInfoBook = (book: string) => {
	const bk = books.find((b) => {
		if (b.names.includes(book)) {
			return b;
		}
	});

	return bk ?? books[0];
};
