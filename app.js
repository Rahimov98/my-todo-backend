const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Подключаем работу с файлами
const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = './db.json';

// Асинхронное чтение
async function readData() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch(error) {
        return[] //Если файла нет, вернем пустой массив
    }
};

// Асинхронная запись
async function writeData (data) {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
};

// Теперь обработчики тоже должны быть async
app.get('/tasks', async (req, res) => {
    const tasks = await readData();
    res.json(tasks);
});

// 2. Добавить задачу
app.post('/tasks', async (req, res) => {
    const tasks = await readData();
    const newTask = { id: Date.now(), title: req.body.title, completed: false };
    tasks.push(newTask);
    await writeData(tasks); // Сохраняем на диск!
    res.status(201).json(newTask);
});

// 3. Удалить задачу
app.delete('/tasks/:id', (req, res) => {
    let tasks = readData();
    tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    writeData(tasks); // Сохраняем на диск!
    res.status(204).send();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер запущен на порту ${PORT}'));