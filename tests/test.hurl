
GET https://bible-api.deno.dev/api/book/genesis

HTTP 200
[Asserts]
jsonpath "$.chapters" == 50
jsonpath "$.testament" == "Antiguo Testamento"
jsonpath "$.abrev" == "GN"


