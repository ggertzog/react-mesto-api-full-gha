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

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', signinValidate, login);
app.post('/signup', signupValidate, createUser);

app.use(auth);
app.use(router);

// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});