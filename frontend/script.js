const tasksList = document.querySelector('#task-list');
const addBtn = document.querySelector('#add-button');
const input = document.querySelector('input');

const API_URL = 'https://my-todo-backend-n09p.onrender.com/tasks';

// 1. ЗАГРУЗКА: Просим задачи у сервера (GET)
function loadTasks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            renderTasks(data); // Рисуем то, что прислал сервер
        })
        .catch(err => console.error("Ошибка загрузки:", err));
}

// 2. ОТРИСОВКА (теперь работает с массивом объектов {id, title})
function renderTasks(tasks) {
    tasksList.innerHTML = '';
    tasks.forEach((task) => {
        const newTask = document.createElement('li');
        newTask.textContent = task.title;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.style.marginLeft = '10px';

        // Удаление (DELETE)
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        newTask.appendChild(deleteBtn);
        tasksList.appendChild(newTask);
    });
}

// 3. ДОБАВЛЕНИЕ (POST)
addBtn.addEventListener('click', () => {
    const title = input.value.trim();
    if (!title) return;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title })
    })
    .then(res => res.json())
    .then(() => {
        input.value = '';
        loadTasks(); // Перезагружаем список с сервера
    });
});

const quotes = [
    "Сделай это сегодня, а не завтра! 💪",
    "Маленькие шаги ведут к большим результатам. 🚀",
    "Продуктивность — это не количество дел, а их качество. ✨",
    "Твой успех начинается с твоего списка задач. 📝",
    "Дисциплина — это мост между целью и достижением. 🔥"
];

function setRandomQuote() {
    const quoteElement = document.querySelector('#quote');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex];
}

// 4. УДАЛЕНИЕ (DELETE)
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(() => loadTasks()); // Перезагружаем список после удаления
}

// Запуск при старте
loadTasks();
