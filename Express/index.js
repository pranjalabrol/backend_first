const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store (replace with database in production)
let tasks = require('./task.json').tasks;

// GET /tasks: Retrieve all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id: Retrieve a single task by its ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
  } else {
    res.json(task);
  }
});

// POST /tasks: Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, completed } = req.body;

  // Input validation
  if (!title || !description || typeof completed !== 'boolean') {
    res.status(400).json({ error: 'Invalid data format' });
    return;
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    completed
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id: Update an existing task by its ID
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;

  // Input validation
  if (!title || !description || typeof completed !== 'boolean') {
    res.status(400).json({ error: 'Invalid data format' });
    return;
  }

  let taskUpdated = false;
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.title = title;
      task.description = description;
      task.completed = completed;
      taskUpdated = true;
    }
    return task;
  });

  if (taskUpdated) {
    res.json({ message: 'Task updated successfully' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// DELETE /tasks/:id: Delete a task by its ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== taskId);

  if (tasks.length < initialLength) {
    res.json({ message: 'Task deleted successfully' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
