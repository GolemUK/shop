const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Модель користувача та товару (використовуйте базу даних для реального проекту)
const users = [];
const products = [];

// Реєстрація користувача
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const userExists = users.find(user => user.username === username);

  if (userExists) {
    res.send('Користувач вже існує');
  } else {
    const newUser = { username, password };
    users.push(newUser);
    req.session.user = newUser;
    res.send('Реєстрація успішна');
  }
});

// Аутентифікація користувача
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    req.session.user = user;
    res.send('Аутентифікація успішна');
  } else {
    res.send('Неправильний логін або пароль');
  }
});

// Адмін-панель - додавання товару
app.post('/admin/addProduct', (req, res) => {
  const { name, price } = req.body;
  const newProduct = { name, price };
  products.push(newProduct);
  res.send('Товар додано успішно');
});

// Захист маршрутів адмін-панелі
app.use('/admin', (req, res, next) => {
  if (req.session.user && req.session.user.admin) {
    next();
  } else {
    res.send('Доступ заборонено');
  }
});

// Адмін-панель - отримання списку товарів
app.get('/admin/products', (req, res) => {
  res.json(products);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
});