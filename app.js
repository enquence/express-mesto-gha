const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const { StatusCodes } = require('http-status-codes');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const regexPatterns = require('./utils/regex-patterns');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  // eslint-disable-next-line no-console
  .then(() => console.log('MongoDB connected'));

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(regexPatterns.email),
    password: Joi.string().required(),
  }),
}), require('./controllers/users').login);

app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(regexPatterns.email),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexPatterns.url),
  }),
}), require('./controllers/users').createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(StatusCodes.NOT_FOUND).send({ message: 'Несуществующий эндпоинт' }));

app.use(errors());
app.use(require('./middlewares/error-handler'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server started on port ${PORT}`);
});
