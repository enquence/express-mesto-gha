const { StatusCodes } = require('http-status-codes');
const userModel = require('../models/user');
const { handleError, NotFoundError } = require('../utils/error-handlers');

module.exports.getUsers = (req, res) => {
  userModel.find({})
    .then((users) => {
      if (!users.length) throw new NotFoundError('Пользователи не найдены');
      res.status(StatusCodes.OK).send(users);
    })
    .catch((err) => handleError(err, res));
};

module.exports.getUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Запрашиваемый пользователь не найден');
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => handleError(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel.create({ name, about, avatar })
    .then((user) => res.status(StatusCodes.CREATED).send(user))
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
