import { Verse } from "$/constants.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { Redis, connect } from "https://deno.land/x/redis@v0.32.0/mod.ts";

interface Info {
	book: string; 
	chapter: number; 
}

interface Cache {
	instance: Redis | null
}

type CacheData = {
	book: string,
	chapters: number[],
	weight: number
}

class CacheChapters {
	#register: CacheData[]
	#cache: Cache;
	name: string

	constructor(name: string) {
		this.name = name;
		this.#register = [];
		this.#cache = {
			instance: null,
		}
	}

	private async cachedRegister() {
		if (!this.#cache.instance) {
			return
		}

		const reg = await this.command(["JSON.GET", `register:${this.name}`]);
		if (!reg) {
			return
		}

		this.#register = JSON.parse(reg as string)

		return this.#register
	}


	status() {
		return this.cachedRegister()
	}

	private async getTotalChapters() {
		if (!this.#cache.instance) {
			return 0
		}

		const reg = await this.cachedRegister();

		if (!reg) {
			return 0
		}

		let total = 0;
		for (const r of reg) {
			total += r.chapters.length
		}

		return total
	}

	private async removeUnused() {
		if (!this.#cache.instance) {
			return
		}

		if (this.isRegisterEmpty()) {
			await this.cachedRegister();
		}

		const order = this.#register.sort((right: CacheData, left: CacheData) => {
			return right.weight - left.weight
		})

		console.log(order)

		const toDelete: {key: string, chapter: number}[] = []
		const limit = Math.ceil(order.length / 4)
		for (let i = 0; i < limit; i++) {
			const item = order[i]
			item.chapters.forEach(c => {
				this.#register = this.#register.filter((b) => {
					if (b.book === item.book) {
						// mutating register book chapters
						// [1, 2] -> [1]
						b.chapters = b.chapters.filter((chapter) => chapter !== c)
						return b
					}
					return b
				})
				
				toDelete.push({
					key: `${this.name}-${item.book}:${c}`,
					chapter: c
				})
			})
		}

		if (toDelete.length === 0) {
			return
		}

		this.#register = this.#register.filter((b) => b.chapters.length > 0)
		await this.saveRegister(this.#register)

		try {
			const keys = toDelete.map((d) => d.key)
			const cmd = ["DEL", ...keys]
			await this.command(cmd)
		} catch (error) {
			throw error
		}

	}

	async init() {
		this.#cache.instance = await connect({
			  hostname: Deno.env.get("REDIS_HOST") || "127.0.0.1",
			  port: 31138,
			  password: Deno.env.get("REDIS_PASSWORD"),
			  tls: true
		})

		await this.cachedRegister();

	}

	private async initRegister(book: string, chapter: number) {
		if (!this.#cache.instance) {
			return
		}

		this.#register.push({
			book,
			chapters: [chapter],
			weight: 0
		})
		await this.saveRegister(this.#register)
	}

	private async saveRegister(register: CacheData[]) {
		if (!this.#cache.instance) {
			return
		}

		await this.command(
			["JSON.SET", `register:${this.name}`, 
			"$", JSON.stringify(register)]
		)

	}

	private searchBook(book: string, reg: CacheData[]) {
		return reg.find((b) => b.book === book)
	}

	private checkKey(key: string) {
		if (!this.#cache.instance) {
			return
		}

		return this.command(["EXISTS", key])
	}

	async delKey(key: string) {
		if (!this.#cache.instance) {
			return
		}

		const value = await this.checkKey(key)
		if (value !== 1) {
			return
		}

		const reply = await this.command(["JSON.DEL", key])
		return reply
	}

	private command(command: string[]) {
		if (!this.#cache.instance) {
			return
		}

		const cmd = command[0]
		const args = command.slice(1)

		if (args.length === 0) {
			return this.#cache.instance.sendCommand(cmd)
		} else {
			return this.#cache.instance.sendCommand(cmd, args)
		}
	}

	private async saveChapter(book:string, chapter: number, verses: Verse[]) {
		if (!this.#cache.instance) {
			return
		}

		await this.command(
			["JSON.SET",
			`${this.name}-${book}:${chapter}`, "$", JSON.stringify(verses)]
		)
	}

	async deleteChapter(book: string, chapter: number) {
		if (!this.#cache.instance) {
			return
		}

		if (this.isRegisterEmpty()) {
			await this.cachedRegister();
		}

		const bk = this.#register.find((b) => {
			if (b.book === book) {
				// mutating register book chapters
				// [1, 2] -> [1]
				b.chapters = b.chapters.filter((c) => c !== chapter)
				return b
			}
		})

		if (!bk) {
			return
		}

		try {

			if (bk.chapters.length === 0) {
				this.#register = this.#register.filter((b) => b.chapters.length > 0)
			}

			const key = `${this.name}-${book}:${chapter}`

			await this.delKey(key)
			this.saveRegister(this.#register)

		} catch (error) {
			console.log(error)
			return 
		}


	}

	async getChapter(book: string, chapter: number) {
		if (!this.#cache.instance) {
			return
		}
		
		if (this.isRegisterEmpty()) {
			await this.cachedRegister();
		}

		const bk = book.toLowerCase()

		this.#register.forEach((b) => {
			if (b.book === bk) {
				b.weight = b.weight + 1
			} else {
				if (b.weight > 0) {
					b.weight = b.weight - 1
				}
			}
		})

		await this.saveRegister(this.#register)

		const data = await this.command(
			["JSON.GET",
			`${this.name}-${bk}:${chapter}`]
		)

		return data
	}

	async add(verses: Verse[], info: Info) {

		let { book, chapter } = info
		chapter = Number(chapter)
		book = book.toLowerCase()

		const cached = await this.cachedRegister();

		if (!cached) {
			this.initRegister(book, chapter);
		}

		const chapters = await this.getTotalChapters();
		const some_arbitrary_number_of_chapters = 22;

		if (chapters > some_arbitrary_number_of_chapters) {
			await this.removeUnused();
		}

		if (!this.#cache.instance || verses.length === 0) {
			return { ok: false }
		}

		const exists = this.searchBook(book, cached || this.#register); 

		const newRegis = []
		if (!exists) {
			this.#register.push({
				weight: 0,
				book,
				chapters: [chapter],
			})

			await this.saveRegister(this.#register)
		} else {
			const isEqual = exists.chapters.includes(chapter)
			const existKey = await this.checkKey(`${this.name}-${book}:${info.chapter}`)
			if (existKey === 1) {
				return { ok: false }
			}

			if (!isEqual) {
				exists.chapters.push(chapter)
				exists.weight = exists.weight + 1

				newRegis.push(exists)
				const others = cached!.filter((b) => b.book !== book)
				others.map((b) => {
					newRegis.push(b)
				})


				await this.saveRegister(newRegis)
			}
		}

		await this.saveChapter(book, chapter, verses)
		return { ok: true }

	}


	async existCh(book: string, chapter: number) {
		if (!this.#cache.instance || !this.#register) {
			return false
		}

		const bName = book.toLowerCase()

		await this.cachedRegister();
		const bk = this.#register.find((b) => b.book.toLowerCase() === bName)

		if (!bk) {
			return false
		}


		const contains = bk.chapters.includes(Number(chapter))
		return contains

	}

	async getVerses(book: string, chapter: number) {
		if (!this.#cache.instance) {
			throw new Error("No cache")
		}

		if (!this.#register) {
			throw new Error("No register")
		}

		const info = this.searchBook(book, this.#register);

		if (!info || !info.chapters.includes(chapter)) {
			throw new Error("No chapter found in cache")
		}

		const json = await this.getChapter(book, chapter)
		const verses = JSON.parse(json as string)

		return verses
	}

	isRegisterEmpty() {
		return this.#register?.length === 0
	}

	async search(book: string, ch: number) {
		if (!this.#cache.instance) {
			return null
		}

		if (!this.#register) {
			return null
		}

		if (this.isRegisterEmpty()) {
			await this.cachedRegister();
		}

		const chapter = Number(ch)

		const info = this.searchBook(book.toLowerCase(), this.#register);

		if (!info || !info.chapters.includes(chapter)) {
			return null
		}


		const json = await this.getChapter(book, chapter);
		const verses = JSON.parse(json as string)
		return verses
	}

	quit() {
		if (!this.#cache.instance) {
			return
		}
		this.#cache.instance.close();
	}
}

export default CacheChapters



