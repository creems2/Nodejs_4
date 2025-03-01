const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Путь к файлу с пользователями
const usersFilePath = path.join(__dirname, 'users.json');

// Функция для чтения данных из файла
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; 
  }
};

// Функция для записи данных в файл
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

// Получение всех пользователей
app.get('/users', (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

// Получение пользователя по ID
app.get('/users/:id', (req, res) => {
  const users = readUsersFromFile();
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  

// Создание нового пользователя
app.post('/users', (req, res) => {
  const users = readUsersFromFile();
  const newUser = req.body;
  newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  
  users.push(newUser);
  writeUsersToFile(users);
  
  res.status(201).json(newUser);
});

// Обновление данных пользователя
app.put('/users/:id', (req, res) => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex !== -1) {
    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex] = updatedUser;
    writeUsersToFile(users);
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Удаление пользователя
app.delete('/users/:id', (req, res) => {
  let users = readUsersFromFile();
  users = users.filter(u => u.id !== parseInt(req.params.id));
  writeUsersToFile(users);
  
  res.status(204).send();
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту http://localhost:${PORT}`);
});