import { VersionBible, getVersionTable, testaments, validVersion } from "$/controllers/read.ts";
import { Context } from "hono/mod.ts";
import { connect } from "$/database/index.ts";

function generateRandom(maxLimit: number){
  let rand = Math.random() * maxLimit;

  rand = Math.floor(rand); 

  return rand;
}


export const randomVerse = async (c: Context) => {
	const { version } = c.req.valid("param");
	const queryTestament = c.req.query("testament");

	const hasTestament = queryTestament !== undefined && testaments.includes(queryTestament);

	const sql = connect();
	const table = getVersionTable(version as VersionBible);

	const isOld = queryTestament === "old" || queryTestament === "Antiguo Testamento"
	let row = []

	if (hasTestament) {
		row = await sql`SELECT count(*)
		FROM ${sql(table)} 
		JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
		JOIN books ON books.id = chapters.book_id ${
			isOld 
				? sql`WHERE book_id < 40` 
				: sql`WHERE book_id > 39`
		}`;
	} else {
		row = await sql`SELECT count(*) FROM ${sql(table)}`
	}

	const count = row[0].count;
	let rand = generateRandom(count);

	if (!isOld) {
		const total = await sql`SELECT count(*) FROM ${sql(table)}`;
		const dif = total[0].count - count;
		rand = dif + rand
	}


	const data = await sql`
	SELECT verse, books.name as book, chapter, study, ${sql(table)}.number, ${sql(table)}.id FROM ${
		sql(table)
	} 
	JOIN chapters ON ${sql(table)}.chapter_id = chapters.id
	JOIN books ON books.id = chapters.book_id 
	AND ${sql(table)}.id = ${rand}`;

	const verse = data[0];

	return c.json(verse)

}


