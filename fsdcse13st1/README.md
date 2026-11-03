# Library Book Management Web Application

## Requirements
- Node.js and npm installed
- VS Code (recommended)
- EchoAPI or another API client for testing

## Setup
Open this folder in VS Code, then open the integrated terminal and run:

```bash
npm install
```

## Run Part A: Node.js HTTP + FS server
In terminal 1:

```bash
npm run http
```

Open:
- http://localhost:3000/
- http://localhost:3000/books
- http://localhost:3000/about
- http://localhost:3000/home

POST endpoint:
- POST http://localhost:3000/add-book
- Body type: raw JSON
- Example:
```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550
}
```

## Run Part B: Express REST API
Open a second terminal (leave the first server running), then run:

```bash
npm run express
```

Test these endpoints at http://localhost:4000:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /books | Get all books |
| GET | /books/1 | Get a book by ID |
| POST | /books | Add a book |
| PUT | /books/1 | Update a book |
| DELETE | /books/1 | Delete a book |

POST example JSON:
```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "category": "Programming"
}
```

PUT example JSON:
```json
{
  "title": "The Alchemist - Updated",
  "author": "Paulo Coelho",
  "price": 400,
  "category": "Fiction"
}
```

## Notes
- No database is used; book records are stored in JavaScript arrays as required by the lab manual.
- Data added or changed through an API remains in memory while that server is running. Restarting the server resets the array.
- Run the two servers in separate terminals because they use ports 3000 and 4000.
- Save your lab screenshots in the `screenshots` folder. See `API-TESTING.md` for the complete EchoAPI test sequence and expected status codes.
