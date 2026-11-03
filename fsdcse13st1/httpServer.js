import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// In-memory array (database is not required for this lab).
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350 },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 250 },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 450 }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(data, null, 2));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Request body must contain valid JSON."));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  // GET /
  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>Library HTTP Server</title></head>
      <body>
        <h1>Welcome to Library Book Management</h1>
        <p>Node.js HTTP server is working on port ${PORT}.</p>
        <p><a href="/books">View books JSON</a> | <a href="/home">Open home page</a> | <a href="/about">About</a></p>
      </body>
      </html>
    `);
  }

  // GET /books
  if (req.method === "GET" && url.pathname === "/books") {
    return sendJson(res, 200, books);
  }

  // POST /add-book
  if (req.method === "POST" && url.pathname === "/add-book") {
    try {
      const body = await readJsonBody(req);
      const id = Number(body.id);
      const price = Number(body.price);

      if (
        body.id === undefined ||
        !Number.isInteger(id) ||
        id <= 0 ||
        typeof body.title !== "string" || !body.title.trim() ||
        typeof body.author !== "string" || !body.author.trim() ||
        body.price === undefined ||
        body.price === null || body.price === "" ||
        !Number.isFinite(price) || price < 0
      ) {
        return sendJson(res, 400, {
          message: "Required fields: valid id, title, author and non-negative price."
        });
      }

      if (books.some(book => book.id === id)) {
        return sendJson(res, 409, { message: "A book with this ID already exists." });
      }

      const newBook = {
        id,
        title: body.title.trim(),
        author: body.author.trim(),
        price
      };
      books.push(newBook);
      return sendJson(res, 201, {
        message: "Book added successfully",
        book: newBook
      });
    } catch (error) {
      return sendJson(res, 400, { message: error.message });
    }
  }

  // GET /about
  if (req.method === "GET" && url.pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end("<h1>About Library Management</h1><p>A simple library application built with Node.js HTTP and FS modules.</p>");
  }

  // GET /home - serve public/index.html with the FS module
  if (req.method === "GET" && url.pathname === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");
    return fs.readFile(filePath, "utf8", (error, html) => {
      if (error) {
        return sendJson(res, 500, { message: "Unable to read the home page file." });
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  }

  return sendJson(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
