require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- Initialization: Create Tables if don't exist ---
const initDB = () => {
  const sqlTasks = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      completed TINYINT(1) DEFAULT 0,
      priority VARCHAR(50) DEFAULT 'medium',
      project VARCHAR(50) DEFAULT 'inbox',
      due_date VARCHAR(50) DEFAULT 'today',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.execute(sqlTasks, (err) => {
    if (err) console.error('Error creating tasks table:', err);
    else console.log('Tasks table ready.');
  });
};

initDB();

// --- API Routes ---

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.execute('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add task
app.post('/api/tasks', (req, res) => {
  const { title, priority, project, due_date } = req.body;
  const sql = 'INSERT INTO tasks (title, priority, project, due_date) VALUES (?, ?, ?, ?)';
  db.execute(sql, [title, priority, project, due_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

// Toggle task completion
app.put('/api/tasks/:id/toggle', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
  db.execute(sql, [completed ? 1 : 0, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.execute(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
