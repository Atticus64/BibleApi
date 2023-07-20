
const path = 'db/dhh'

import { books } from "$/scraping/index.ts";

const dataNewTestament = [];
const dataOldTestament = [];

const old = books.filter(book => book.testament === 'Antiguo Testamento');
const newBooks = books.filter(book => book.testament === 'Nuevo Testamento');

for (const entry of old) {
	const file = await Deno.readTextFile(`./${path}/oldTestament/${entry.name.toLowerCase()}.json`);
	dataOldTestament.push(JSON.parse(file));
}

for (const entry of newBooks) {
	const file = await Deno.readTextFile(`./${path}/newTestament/${entry.name.toLowerCase()}.json`);
	dataNewTestament.push(JSON.parse(file));
}

const data = {
	version: 'dhh',
	oldTestament: dataOldTestament,
	newTestament: dataNewTestament
}

Deno.writeTextFile(`./${path}/index.json`, JSON.stringify(data, null, "\t"));
