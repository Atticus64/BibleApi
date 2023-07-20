# Bible API

## Endpoints

### Reina Valera 1960

*Get all book*

`/api/rv1960/book/<book>`

`/api/rv1960/oldtestament/<book>`

`/api/rv1960/newTestament/<book>`

- Example 

https://bible-api.deno.dev/api/rv1960/book/genesis

GET `/api/rv1960/book/genesis`

GET `/api/rv1960/oldTestament/genesis`

*Get chapter book*

`/api/rv1960/book/<book>/<chapter>`

`/api/rv1960/oldtestament/<book>/<chapter>`

`/api/rv1960/newTestament/<book>/<chapter>`

- Examples

https://bible-api.deno.dev/api/rv1960/book/genesis/1

GET `/api/rv1960/book/genesis/1`

GET `/api/rv1960/oldTestament/genesis/1`

## Dev server

```
deno task dev
```

## Scrape

```
deno task scrape
```

