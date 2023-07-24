// import { connect } from "./src/database/index.ts"
import { books } from "$/scraping/index.ts";
import { DataBook } from "$/scraping/scrape.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
//
const client = new Client(Deno.env.get("DATABASE_URL"));
await client.connect();

// const r = await client.queryArray("CREATE EXTENSION unaccent;");
// console.log(r);
// const sql = connect();

// console.log(Deno.env.get("DATABASE_URL"))
// client.queryArray("drop table if exists books");
// client.queryArray("create type testa as enum ('old', 'new')");
// const res = await client.queryArray(`create table books (
// 	id serial primary key,
// 	name text not null,
// 	testament testa,
// 	num_chapters integer not null
// )`)

// const data: { name: string, num_chapters: number, testament: string }[] = []
// books.forEach(b => {
// 	data.push({
// 		name: b.name,
// 		testament: b.testament === 'Nuevo Testamento' ? 'new' : 'old',
// 		num_chapters: b.chapters
// 	})
// })
//
// const res = await client.queryArray(`INSERT INTO books (name, testament, num_chapters) VALUES ${data.map(d => `('${d.name}', '${d.testament}', ${d.num_chapters})`).join(',')}`);


// # Chapters

// const r = await client.queryArray(`
// 	create table chapters (
// 		id serial primary key,
// 		number integer not null,
// 		book_id integer not null,
// 		foreign key (book_id) references books(id)
// 	)`)

//
// const chapts: { book_id:number, number: number}[] = []
// for (const b of books.filter(b => b.testament === 'Antiguo Testamento')) {
// 	const raw = await Deno.readTextFile(`./db/rv1995/oldTestament/${b.name.toLowerCase()}.json`)
// 	const data: DataBook = await JSON.parse(raw)
//
// 	const { rows } = await client.queryArray(`select id from books where name = '${b.name}'`)
// 	const b_id = rows[0][0]
// 	data.chapters.forEach(c => {
// 		chapts.push({
// 			book_id: b_id as number,
// 			number: Number(c.chapter)
// 		})	
// 	})
//
// }
//
// for (const b of books.filter(b => b.testament === 'Nuevo Testamento')) {
// 	const raw = await Deno.readTextFile(`./db/rv1995/newTestament/${b.name.toLowerCase()}.json`)
// 	const data: DataBook = await JSON.parse(raw)
//
// 	const { rows } = await client.queryArray(`select id from books where name = '${b.name}'`)
// 	const b_id = rows[0][0]
// 	data.chapters.forEach(c => {
// 		chapts.push({
// 			book_id: b_id as number,
// 			number: Number(c.chapter)
// 		})	
// 	})
//
// }
//
// const res = await client.queryArray(`INSERT INTO chapters (number, book_id) VALUES ${chapts.map(d => `(${d.number}, ${d.book_id})`).join(',')}`)
//
// console.log(res)

// const r = await sql`select * from verses_nvi WHERE UNACCENT(LOWER(verse)) LIKE '%josue%'
//  // LIMIT 10;`
// console.log(r)

// sql.end()
// await client.queryArray(`
// create table verses_dhh (
// 	id serial primary key,
// 	verse text not null,
// 	study text,
// 	number integer not null,
// 	chapter integer not null,
// 	chapter_id integer not null,
// 	foreign key (chapter_id) references chapters(id)
// )`)
//
// const data = []
// for(const b of books.filter(b => b.testament === 'Antiguo Testamento')) {
// 	const raw = await Deno.readTextFile(`./db/dhh/oldTestament/${b.name.toLowerCase()}.json`)
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
// 	console.log(b.name)
// }
//
// for(const b of books.filter(b => b.testament === 'Nuevo Testamento')) {
// 	const raw = await Deno.readTextFile(`./db/dhh/newTestament/${b.name.toLowerCase()}.json`)
// 	const info: DataBook = await JSON.parse(raw)
//
// 	const {rows} = await client.queryArray(`select chapters.id from chapters JOIN books ON chapters.book_id = books.id WHERE books.name = '${b.name}'`)
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
// 	console.log(b.name)
// }
//
// const r = await client.queryArray(`INSERT INTO verses_dhh (verse, study, number, chapter_id, chapter) VALUES ${data.map(d => `('${d.verse}', ${d.study ? `'${d.study}'`:  null}, ${d.number}, ${d.chapter_id}, ${d.chapter})`).join(',')}`)
// console.log(r)
//
