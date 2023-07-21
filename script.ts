import { connect } from "./src/database/index.ts"
import { books } from "$/scraping/index.ts";
import { DataBook } from "$/scraping/scrape.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const client = new Client(Deno.env.get("DATABASE_URL"));
await client.connect();

const sql = connect();

const r = await sql`select * from verses_nvi WHERE UNACCENT(LOWER(verse)) LIKE '%josue%'
 LIMIT 10;`
console.log(r)

sql.end()
// await sql`
// create table verses_rv1995 (
// 	id serial primary key,
// 	verse text not null,
// 	study text,
// 	number integer not null,
// 	chapter integer not null,
// 	chapter_id integer not null,
// 	foreign key (chapter_id) references chapters(id)
// )`
//
//
// const data = []
// for(const b of books.filter(b => b.testament === 'Antiguo Testamento')) {
// 	const raw = await Deno.readTextFile(`./db/rv1995/oldTestament/${b.name.toLowerCase()}.json`)
// 	const info: DataBook = await JSON.parse(raw)
//
// 	const {rows} = await client.queryArray(`select chapters.id from chapters JOIN books ON chapters.book_id = books.id WHERE books.name = '${b.name}'`)
//
// 	info.chapters.forEach(c => {
// 		const index = Number(c.chapter) 
// 		c.vers.forEach(v => {
// 			data.push({
// 				verse: v.verse,
// 				study: v.study,
// 				number: v.number,
// 				chapter: Number(c.chapter),
// 				chapter_id: rows[index - 1][0]
// 			})	
// 		})
// 	})
// }
//
// for(const b of books.filter(b => b.testament === 'Nuevo Testamento')) {
// 	const raw = await Deno.readTextFile(`./db/rv1995/newTestament/${b.name.toLowerCase()}.json`)
// 	const info: DataBook = await JSON.parse(raw)
//
// 	const {rows} = await client.queryArray(`select chapters.id from chapters JOIN books ON chapters.book_id = books.id WHERE books.name = '${b.name}'`)
// 	console.log(rows)
// 	info.chapters.forEach(c => {
// 		const index = Number(c.chapter) 
// 		c.vers.forEach(v => {
// 			data.push({
// 				verse: v.verse,
// 				study: v.study,
// 				number: v.number,
// 				chapter: Number(c.chapter),
// 				chapter_id: rows[index -1][0]
// 			})	
// 		})
//
// 	})
// }
//
// const r = await client.queryArray(`INSERT INTO verses_rv1995 (verse, study, number, chapter_id, chapter) VALUES ${data.map(d => `('${d.verse}', ${d.study ? `'${d.study}'`:  null}, ${d.number}, ${d.chapter_id}, ${d.chapter})`).join(',')}`)
// console.log(r)
//
