const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3002;
const DATA_FILE = path.join(__dirname, "products.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function getProducts() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
function saveProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

// API: get all products
app.get("/api/products", (req, res) => res.json(getProducts()));

// API: get a single product by ID
app.get("/api/products/:id", (req, res) => {
  const product = getProducts().find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
});

// API: add a product
app.post("/api/products", (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const price = Number(req.body.price);
  const rating = Number(req.body.rating);
  if (!name) return res.status(400).json({ message: "Product name is required." });
  if (!Number.isFinite(price) || price < 0) return res.status(400).json({ message: "Enter a valid non-negative price." });
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) return res.status(400).json({ message: "Rating must be from 0 to 5." });

  const products = getProducts();
  const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const product = { id, name, price, rating };
  products.push(product);
  saveProducts(products);
  res.status(201).json(product);
});

app.listen(PORT, () => console.log(`Experiment 2 API server: http://localhost:${PORT}`));
