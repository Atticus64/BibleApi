# Bible API

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

`api/<version>/search?q=Dios&testament=old&take=5&page=4`

_query is required_

```ts
interface Parameters {
  q: string;
  testament?: string;
  take?: number;
  page?: number;
}
```

- Examples

https://bible-api.deno.dev/api/nvi/search?q=Dios

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
