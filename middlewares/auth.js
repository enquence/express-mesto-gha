// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { AuthError, handleError } = require('../utils/error-handlers');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { auth } = req.headers;

  if (!auth || !auth.startsWith('Bearer ')) return handleError(new AuthError('Необходима авторизация'), res);
  const token = auth.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch {
    handleError(new AuthError('Необходима авторизация'), res);
  }

  req.user = payload;
  next();
};
