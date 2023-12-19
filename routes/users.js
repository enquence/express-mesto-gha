const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserInfo, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');
const regexPatterns = require('../utils/regex-patterns');

const userIdCelebrateSchema = {
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum(),
  }),
};

router.get('/', getUsers);
router.get('/:userId', celebrate(userIdCelebrateSchema), getUserById);
router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexPatterns.url),
  }),
}), updateAvatar);

module.exports = router;
