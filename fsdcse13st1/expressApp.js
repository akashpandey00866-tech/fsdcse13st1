import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

// In-memory array: data resets when this server is restarted.
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350, category: "Fiction" },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 250, category: "Biography" },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", price: 550, category: "Programming" }
];

function validateBookFields(book) {
  return (
    book &&
    typeof book.title === "string" && book.title.trim().length > 0 &&
    typeof book.author === "string" && book.author.trim().length > 0 &&
    book.price !== undefined && book.price !== null && book.price !== "" &&
    Number.isFinite(Number(book.price)) && Number(book.price) >= 0 &&
    typeof book.category === "string" && book.category.trim().length > 0
  );
}

// GET /books - retrieve all books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// GET /books/:id - retrieve one book
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(item => item.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json(book);
});

// POST /books - create a book
app.post("/books", (req, res) => {
  const { id, title, author, price, category } = req.body || {};
  const numericId = Number(id);

  if (
    id === undefined || id === null || id === "" ||
    !Number.isInteger(numericId) || numericId <= 0 ||
    !validateBookFields({ title, author, price, category })
  ) {
    return res.status(400).json({
      message: "Required fields: valid id, title, author, non-negative price and category."
    });
  }

  if (books.some(item => item.id === numericId)) {
    return res.status(409).json({ message: "A book with this ID already exists." });
  }

  const newBook = {
    id: numericId,
    title: title.trim(),
    author: author.trim(),
    price: Number(price),
    category: category.trim()
  };

  books.push(newBook);
  res.status(201).json({
    message: "Book added successfully",
    book: newBook
  });
});

// PUT /books/:id - update an existing book
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const updatedBook = { ...books[index], ...(req.body || {}), id };

  if (!validateBookFields(updatedBook)) {
    return res.status(400).json({
      message: "Provide valid title, author, non-negative price and category."
    });
  }

  books[index] = {
    id,
    title: updatedBook.title.trim(),
    author: updatedBook.author.trim(),
    price: Number(updatedBook.price),
    category: updatedBook.category.trim()
  };

  res.status(200).json({
    message: "Book updated successfully",
    book: books[index]
  });
});

// DELETE /books/:id - delete a book
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const deletedBook = books.splice(index, 1)[0];
  res.status(200).json({
    message: "Book deleted successfully",
    book: deletedBook
  });
});

// Handle malformed JSON bodies
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON request body" });
  }
  return res.status(500).json({ message: "Internal server error" });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
