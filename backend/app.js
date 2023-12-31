require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { signinValidate, signupValidate } = require('./middlewares/requestValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { centralErrorHandler } = require('./middlewares/centalErrorHandler');

const { PORT, DB_ADDRESS } = process.env;

mongoose.connect(DB_ADDRESS);

const app = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// логгер запросов
app.use(requestLogger);

// роуты авторизации
app.post('/signin', signinValidate, login);
app.post('/signup', signupValidate, createUser);

// мидлвэр авторизации
app.use(auth);

// остальные роуты
app.use(router);

// логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик ошибок
app.use(centralErrorHandler);

app.listen(PORT);