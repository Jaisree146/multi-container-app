const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: "db",
  user: "root",
  password: "password",
  database: "testdb",
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("MySQL Connected");
});

// Create table
db.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255),
    completed BOOLEAN DEFAULT FALSE
  )
`);

// Create
app.post("/add", (req, res) => {
  const { task } = req.body;
  db.query("INSERT INTO tasks (task) VALUES (?)", [task]);
  res.send("Task Added");
});

// Read
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    res.json(result);
  });
});

// Update
app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const { completed } = req.body;

  db.query("UPDATE tasks SET completed=? WHERE id=?", [completed, id]);
  res.send("Updated");
});

// Delete
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM tasks WHERE id=?", [id]);
  res.send("Deleted");
});

// Health
app.get("/health", (req, res) => {
  res.send("OK");
});

// Home
app.get("/", (req, res) => {
  res.send("Task Manager Backend 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
