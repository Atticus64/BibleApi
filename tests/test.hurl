
GET http://localhost:8000/api/book/genesis

HTTP 200
[Asserts]
jsonpath "$.chapters" == 50
jsonpath "$.testament" == "Antiguo Testamento"
jsonpath "$.abrev" == "GEN"
jsonpath "$.name" == "Genesis"


