# Bible API

## Endpoints

*Get chapter book*

`/api/<version>/book/<book>/<chapter`

```ts
enum Version {
  "rv1960",
  "rv1995",
  "dhh"
  "nvi"
}
```

`/api/rv1960/book/<book>/<chapter>`

`/api/rv1960/chapter/<book>/<chapter>`

- Examples

https://bible-api.deno.dev/api/rv1960/book/genesis/1

GET `/api/rv1960/book/genesis/1`

GET `/api/nvi/chapter/apocalipsis/22`

### Search query

`api/<version>/search?q=Dios&testament=old&take=5&page=4`

*query is required*

```ts
interface Parameters {
  q: string,
  testament?: string,
  take?: number,
  page?: number
}
```

- Examples

https://bible-api.deno.dev/api/nvi/search?q=Dios

GET `api/nvi/search?q=Dios&page=2`

GET `api/nvi/search?q=Dios&page=2&take=3`

## Dev server

```
deno task dev
```

## Scrape

```
deno task scrape
```

