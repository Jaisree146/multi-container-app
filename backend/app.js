const express = require("express");
const mysql = require("mysql2");
const client = require("prom-client");

const app = express();
app.use(express.json());

// ---------------- PROMETHEUS SETUP ----------------
client.collectDefaultMetrics();

// ---------------- CORS ----------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ---------------- MYSQL ----------------
const db = mysql.createPool({
  host: "db",
  user: "root",
  password: "password",
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
});

// Create table with retry
function createTable() {
  db.query(
    `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task VARCHAR(255),
      completed BOOLEAN DEFAULT FALSE
    )
  `,
    (err) => {
      if (err) {
        console.log("⏳ Waiting for MySQL...");
        setTimeout(createTable, 3000);
      } else {
        console.log("✅ Table ready");
      }
    }
  );
}
createTable();

// ---------------- ROUTES ----------------

// CREATE
app.post("/add", (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).send("Task missing");

  db.query("INSERT INTO tasks (task) VALUES (?)", [task], (err, result) => {
    if (err) return res.status(500).send("Insert Error");
    res.send("Added");
  });
});

// READ
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) return res.status(500).send("DB Error");
    res.json(result);
  });
});

// UPDATE
app.put("/update/:id", (req, res) => {
  const { completed } = req.body;
  db.query(
    "UPDATE tasks SET completed=? WHERE id=?",
    [completed, req.params.id],
    (err) => {
      if (err) return res.status(500).send("Update Error");
      res.send("Updated");
    }
  );
});

// DELETE
app.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM tasks WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Delete Error");
    res.send("Deleted");
  });
});

// HEALTH
app.get("/health", (req, res) => {
  res.send("OK");
});

// ---------------- METRICS ----------------
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// HOME
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ---------------- SERVER ----------------
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});