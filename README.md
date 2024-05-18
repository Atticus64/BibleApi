# Bible API

> [!NOTE]
> This api is still in developmen, if you found an bug or want to request for documentation. create a issue in this repository 

## Endpoints

_Get chapter book_

`/api/read/<version>/<book>/<chapter`

```ts
enum Version {
  "rv1960",
  "rv1995",
  "dhh"
  "nvi"
}
```

`/api/read/rv1960/<book>/<chapter>`

`/api/read/rv1960/<book>/<chapter>`

- Examples

https://bible-api.deno.dev/api/read/rv1960/genesis/1

GET `/api/read/rv1960/genesis/1`

GET `/api/read/nvi/apocalipsis/22`

### Search query

`api/read/<version>/search?q=Dios&testament=old&take=5&page=4`

_query is required_

```ts
interface Parameters {
  q: string
  testament?: string
  take?: number
  page?: number
}
```

- Examples

https://bible-api.deno.dev/api/read/nvi/search?q=Dios

GET `api/nvi/read/search?q=Dios&page=2`

GET `api/nvi/read/search?q=Dios&page=2&take=3`

## Dev server

```
deno task dev
```

## Scrape

```
deno task scrape
```
