import { books } from "$/constants.ts"
import * as cherio from "https://esm.sh/cheerio"
import { log, loggers } from "$/scraping/logger.ts"

// const uri = "https://www.bibliatodo.com/la-biblia"
const uri = "https://www.kingjamesbibleonline.org"

const versions = [
	"King-James-Bible-Online",
]

const getUrls = (book: string, chapters: number) => {
  const urls = []
  for (let i = 1; i <= chapters; i++) {
    urls.push(
      `${uri}/${book}-Chapter-${i}`,
    )
  }

  return urls
}

function getFolderName(version: string) {
  if (version === "Palabra-de-Dios-para-todos") {
    return "pdt"
  } else if (version === "Reina-valera-1995") {
    return "rv1995"
  } else if (version === "Dios-habla-hoy") {
    return "dhh"
  } else if (version === "King-James-Bible-Online") {
	return "kjv"
  }
}

async function fillVersion(version: string) {
  const versionName = getFolderName(version)
  Deno.mkdirSync(`./${versionName}`)
  Deno.mkdirSync(`./${versionName}/old`)
  Deno.mkdirSync(`./${versionName}/new`)
  for (const b of books) {

    const testament = b.testament === "Nuevo Testamento" ? "new" : "old"
    const chapters_1 = []
    let coded = ""
    const chaps = b.chapters
	  const bkname = b.names[b.names.length - 1]

    const urls = getUrls(bkname, chaps)
    const requests = urls.map((url) => fetch(url))

    const responses = await Promise.all(requests)

    let i = 1
    for (const resp of responses) {
      const vers = await getChapter(resp)
      const chapter = {
        chapter: i,
        verses: vers,
      }
      chapters_1.push(chapter)
      i++
    }

    const data = {
      name: bkname,
      testament,
      chapters: chapters_1,
    }

    const json = JSON.stringify(data, null, "\t")
    if (testament === "new") {
      Deno.writeTextFile(
        `./${versionName}/new/${bkname.toLowerCase()}.json`,
        json,
      )
    } else {
      Deno.writeTextFile(
        `./${versionName}/old/${bkname.toLowerCase()}.json`,
        json,
      )
    }
    log(bkname, "info")
  }
}



function parse(text: string) {
  const chars = text.split("")
  let idx = 0
  for (const c of chars) {
    if (!isNaN(Number(c))) {
      text = text.replace(c, " ")
    } else if (c === " " && isNaN(Number(chars[idx + 1])) || idx > 4) {
      break
    }
    idx++
  }

  text = text.trim()

  return text
}


async function getChapter(resp: Response) {
  const html = await resp.text()
  const $ = cherio.load(html)
  const items_chapter = $("#div").children()

  const isVerse = (htmlElem) => htmlElem.tagName === "p"
  const isStudy = (htmlElem) => htmlElem.tagName === "span"

  let verse_num = 0
  let index_child = 0 
  const verses = []
  for (let i = 0; i < items_chapter.length; i++) {
	const verse_html = items_chapter[index_child]
    const next = items_chapter[index_child + 1]

	if (isStudy(verse_html)) {
		if (next !== undefined && isVerse(next)) {
			let text = parse($(next).text())
			text = text.replaceAll("  ", "")
			if (text !== "") {
				verses.push({
					study: $(verse_html).text(),
					verse: text,
					number: verse_num + 1,
				})
				verse_num++
				i += 1
			}
		}
	} else if (isVerse(verse_html)) {
			let text = parse($(verse_html).text())
			text = text.replaceAll("  ", "")
			if (text !== "") {
				verses.push({
					verse: text,
					number: verse_num + 1,
				})
				verse_num++
			}
	}
    index_child++
  }

  return verses
}

for (const v of versions) {
  await fillVersion(v)
}


