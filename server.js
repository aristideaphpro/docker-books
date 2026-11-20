const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const Book = require("./models/books");

app.get("/", (req, res) => res.json({ message: "API Livres", status: "ok" }));

app.get("/books", async (req, res) => {
  res.json(await Book.find());
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Livre introuvable" });
    res.json(book);
  } catch {
    res.status(400).json({ error: "ID invalide" });
  }
});

app.post("/books", async (req, res) => {
  try {
    res.status(201).json(await Book.create(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ error: "Livre introuvable" });
    res.json(book);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Livre introuvable" });
    res.status(204).end();
  } catch {
    res.status(400).json({ error: "ID invalide" });
  }
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/books";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`));
  })
  .catch((err) => {
    console.error("Connexion MongoDB impossible :", err.message);
    process.exit(1);
  });
