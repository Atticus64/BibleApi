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

## Dev server

```
deno task dev
```

## Scrape

```
deno task scrape
```

