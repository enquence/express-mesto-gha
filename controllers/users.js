// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { handleError, NotFoundError } = require('../utils/error-handlers');

module.exports.getUsers = (req, res) => {
  userModel.find({})
    .then((users) => {
      if (!users.length) return Promise.reject(NotFoundError('Пользователи не найдены'));
      return res.status(StatusCodes.OK).send(users);
    })
    .catch((err) => handleError(err, res));
};

module.exports.getUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      if (!user) return Promise.reject(new NotFoundError('Запрашиваемый пользователь не найден'));
      return res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => handleError(err, res));
};

module.exports.createUser = (req, res) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(StatusCodes.CREATED).send(user))
    .catch((err) => handleError(err, res));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return userModel.findUserByCredentials(email, password)
    .then(() => {
      const token = jwt.sign(
        { _id: 'd285e3dceed844f902650f40' },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true }).end();
    })
    .catch((err) => handleError(err, res));
};

module.exports.getUserInfo = (req, res) => {
  const { _id } = req.user;

  return userModel.findById(_id)
    .then((user) => {
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => handleError(err, res));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  if (req.body.avatar) return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Чтобы изменить аватар воспользуйтесь методом PATCH на эндпоинте /users/me/avatar' });
  return userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Запрашиваемый пользователь не найден');
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => handleError(err, res));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Запрашиваемый пользователь не найден');
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => handleError(err, res));
};
