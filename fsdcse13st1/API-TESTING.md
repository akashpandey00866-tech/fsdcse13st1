# API Testing Guide (EchoAPI)

Run both servers in two separate VS Code terminals before testing.

## Part A — Node.js HTTP server (port 3000)

| Method | URL | Expected status | Expected result |
|---|---|---:|---|
| GET | `http://localhost:3000/` | 200 | Welcome HTML page |
| GET | `http://localhost:3000/books` | 200 | Array of books in JSON |
| GET | `http://localhost:3000/about` | 200 | About information |
| GET | `http://localhost:3000/home` | 200 | `public/index.html` served using `fs.readFile` |
| POST | `http://localhost:3000/add-book` | 201 | Adds a book to the HTTP server array |
| GET | `http://localhost:3000/unknown` | 404 | Route not found |

For POST `/add-book`, select Body → raw → JSON:


{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550
}
```

## Part B — Express REST API (port 4000)

| Method | URL | Expected status | Expected result |
|---|---|---:|---|
| GET | `http://localhost:4000/books` | 200 | All books |
| GET | `http://localhost:4000/books/1` | 200 | Book with ID 1 |
| POST | `http://localhost:4000/books` | 201 | Creates a new book |
| PUT | `http://localhost:4000/books/1` | 200 | Updates book with ID 1 |
| DELETE | `http://localhost:4000/books/1` | 200 | Deletes book with ID 1 |
| GET | `http://localhost:4000/books/999` | 404 | Book not found |
| GET | `http://localhost:4000/unknown` | 404 | Route not found |

POST body (Body → raw → JSON):

```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "category": "Programming"
}
```

PUT body (Body → raw → JSON):

```json
{
  "title": "The Alchemist - Updated",
  "author": "Paulo Coelho",
  "price": 400,
  "category": "Fiction"
}
```

Recommended test order: GET all → GET by ID → POST a new ID → GET that new ID → PUT an existing ID → GET to verify update → DELETE → GET to verify deletion.

For POST and PUT, set `Content-Type: application/json` (EchoAPI normally does this when JSON body mode is selected).
