const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const cardIdCelebrateSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum(),
  }),
};

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,}\.[a-z]{2,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*#?$)/),
  }),
}), createCard);
router.delete('/:cardId', celebrate(cardIdCelebrateSchema), deleteCard);
router.put('/:cardId/likes', celebrate(cardIdCelebrateSchema), likeCard);
router.delete('/:cardId/likes', celebrate(cardIdCelebrateSchema), dislikeCard);

module.exports = router;
