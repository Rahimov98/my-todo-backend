const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, 'db.json');

// Чтение данных
async function readData() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Запись данных
async function writeData(data) {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}

// Маршруты
app.get('/tasks', async (req, res) => {
    const tasks = await readData();
    res.json(tasks);
});

app.post('/tasks', async (req, res) => {
    const tasks = await readData();
    const newTask = { id: Date.now(), title: req.body.title, completed: false };
    tasks.push(newTask);
    await writeData(tasks);
    res.status(201).json(newTask);
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        let tasks = await readData();
        const idToDelete = parseInt(req.params.id);
        tasks = tasks.filter(t => t.id !== idToDelete);
        await writeData(tasks);
        res.status(204).send();
    } catch (error) {
        res.status(500).send("Ошибка сервера");
    }
});

// ПРАВИЛЬНЫЙ ЗАПУСК ДЛЯ RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});