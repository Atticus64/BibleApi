import { books } from "$/constants.ts";
import * as cherio from "https://esm.sh/cheerio";
import { log, loggers } from "$/scraping/logger.ts";

const uri = "https://www.bibliatodo.com/la-biblia"

const versions = [
	"Palabra-de-Dios-para-todos",
	"Reina-valera-1995",
	"Dios-habla-hoy"
]

const getUrls = (book: string, chapters: number, version: string) => {
  const urls = [];
  for (let i = 1; i <= chapters; i++) {
    urls.push(
      `${uri}/${version}/${book}-${i}`,
    );
  }

  return urls;
};

function getFolderName(version: string) {
	
	if (version === "Palabra-de-Dios-para-todos") {
		return "pdt"
	} else if (version === "Reina-valera-1995") {
		return "rv1995"
	} else if (version === "Dios-habla-hoy") {
		return "dhh"
	}
}


async function fillVersion(version: string) {

	const versionName = getFolderName(version)
	Deno.mkdirSync(`./${versionName}`)
	Deno.mkdirSync(`./${versionName}/old`)
	Deno.mkdirSync(`./${versionName}/new`)
	for (const b of books) {
		const testament = b.testament === "Nuevo Testamento" ? "new" : "old"
		const cs = []
		let coded = ''
		const chaps = b.chapters;

		if (b.name.includes("-")) {
			const [entry, name] = b.name.split("-")
			coded = `${entry}${name.toLowerCase()}`
		} else {
			coded = b.name.toLowerCase()
		}


		const urls = getUrls(coded, chaps, version)
		const requests = urls.map((url) => fetch(url));

		const responses = await Promise.all(requests)

		let i = 1
		for (const resp of responses) {
			const vers = await getChapter(resp)
			const chapter = {
				chapter: i,
				verses: vers
			}
			cs.push(chapter)
			i++
		}

		const data = {
			name: b.name,
			testament,
			chapters: cs
		}
		const json = JSON.stringify(data, null, '\t')
		if (testament === "new") {
			Deno.writeTextFile(`./${versionName}/new/${b.name.toLowerCase()}.json`, json)
		} else {
			Deno.writeTextFile(`./${versionName}/old/${b.name.toLowerCase()}.json`, json)
		}
		log(b.name, "info")

	}
}


function parse(text: string) {

	const chars = text.split('')
	let idx = 0
	for (const c of chars) {
		if (!isNaN(Number(c))) {
			text = text.replace(c, ' ')
		} else if (c === ' ' && isNaN(Number(chars[idx+1])) || idx > 4) {
			break
		}
		idx++
	}

	text = text.trim()
	
	return text
}

async function getChapter(resp: Response) {
	const html = await resp.text()
	const $ = cherio.load(html);
	const info = $("#info_capitulo").children()

	let i = 0
	let j = 0
	const verses = []
	for (const c of info) {
		const next = info[j+1]
		const prev = info[j-1]
		let insert = false;
		const isVerse = (c) => c.tagName === "p"
		const isStudy = (c) => c.tagName === "h2" || c.tagName === "span"
		if (c.tagName === "p" || c.tagName === "h2" || c.tagName === "span") {
			if (isStudy(c)) {
				if (next !== undefined && isVerse(next) || next.tagName === "span" ) {
					if (isStudy(next)) {
						const realN = info[j+2]
						if (realN !== undefined && isVerse(realN)) {
							let text = parse($(realN).text())
							text = text.replaceAll('  ', '');
							verses.push({
								study: $(c).text(),
								verse: text,
								number: i + 1
							})
							insert = true;
							i++;
						}

					} else if (isVerse(next)) {
						let text = parse($(next).text())
						text = text.replaceAll('  ', '');
						verses.push({
							study: $(c).text(),
							verse: text,
							number: i + 1
						})
						i++;

					}
				}
			} else if (c.tagName === "p") {
				if (prev !== undefined && !isStudy(prev)  || i === 0) {
					if (insert || prev !== undefined &&  prev.tagName !== "p") {
						i++;
						insert = false
					} else {
						let text = parse($(c).text())
						text = text.replaceAll('  ', '');

						verses.push({
							verse: text,
							number: i + 1
						})
						i++
					}
				}
			}

		}
		j++
	}

	return verses
}

await fillVersion("Dios-habla-hoy")


