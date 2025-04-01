const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("shop.db");

app.use(cors());
app.use(express.json());

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image TEXT,
    category_id INTEGER,
    stock INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Rutas para productos
app.get("/api/products", (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;
  let query =
    "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (p.name LIKE ? OR p.description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += " AND p.category_id = ?";
    params.push(category);
  }

  if (minPrice) {
    query += " AND p.price >= ?";
    params.push(minPrice);
  }

  if (maxPrice) {
    query += " AND p.price <= ?";
    params.push(maxPrice);
  }

  const products = db.prepare(query).all(...params);
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const { name, price, description, image, category_id, stock } = req.body;
  try {
    const result = db
      .prepare(
        "INSERT INTO products (name, price, description, image, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(name, price, description, image, category_id, stock);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas para órdenes
app.post("/api/orders", (req, res) => {
  const { user_id, items, total } = req.body;
  try {
    const order = db
      .prepare("INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)")
      .run(user_id, total, "pending");

    items.forEach((item) => {
      db.prepare(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
      ).run(order.lastInsertRowid, item.id, item.quantity, item.price);
    });

    res.json({ orderId: order.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
