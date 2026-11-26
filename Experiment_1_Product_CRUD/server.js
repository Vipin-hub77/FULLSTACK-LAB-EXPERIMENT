const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, "products.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readProducts() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
function saveProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}
function validate(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = Number(body.price);
  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!name) return "Product name is required.";
  if (!Number.isFinite(price) || price < 0) return "Price must be a valid non-negative number.";
  return null;
}

// READ all products
app.get("/api/products", (req, res) => res.json(readProducts()));

// READ one product
app.get("/api/products/:id", (req, res) => {
  const product = readProducts().find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
});

// CREATE product
app.post("/api/products", (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  const products = readProducts();
  const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const product = {
    id,
    name: req.body.name.trim(),
    price: Number(req.body.price),
    description: (req.body.description || "").trim()
  };
  products.push(product);
  saveProducts(products);
  res.status(201).json(product);
});

// UPDATE product
app.put("/api/products/:id", (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  const products = readProducts();
  const index = products.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found." });
  products[index] = {
    id: products[index].id,
    name: req.body.name.trim(),
    price: Number(req.body.price),
    description: (req.body.description || "").trim()
  };
  saveProducts(products);
  res.json(products[index]);
});

// DELETE product
app.delete("/api/products/:id", (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found." });
  const deleted = products.splice(index, 1)[0];
  saveProducts(products);
  res.json({ message: "Product deleted successfully.", product: deleted });
});

app.listen(PORT, () => console.log(`Experiment 1 server: http://localhost:${PORT}`));
