const cardModel = require('../models/card')
const {StatusCodes} = require('http-status-codes')
const {handleError, BadRequestError, NotFoundError} = require('../utils/error-handlers')

module.exports.getCards = (req, res) => {
  cardModel.find({})
    .then(cards => {
      if (!cards.length) throw new NotFoundError('Карточки не найдены')
      res.status(StatusCodes.OK).send(cards)
    })
    .catch((err) => handleError(err, res))
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body
  const owner = req.user._id
  cardModel.create({name, link, owner})
    .then(card => res.status(StatusCodes.CREATED).send(card))
    .catch((err) => handleError(err, res))
}

module.exports.deleteCard = (req, res) => {
  cardModel.findById(req.params.cardId)
    .then(card => {
      if (!card) throw new NotFoundError('Запрашиваемая карточка не найдена')
      if (!card?.owner.equals(req.user._id)) throw new BadRequestError('Невозможно удалить чужую карточку')
      return cardModel.findByIdAndDelete(req.params.cardId)
    })
    .then(() => res.status(StatusCodes.OK).send({message: 'Карточка успешно удалена'}))
    .catch((err) => handleError(err, res))
}

module.exports.likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true})
    .then((card) => {
      if (!card) throw new NotFoundError('Запрашиваемая карточка не найдена')
      res.status(StatusCodes.OK).send(card)
    })
    .catch((err) => handleError(err, res))
}

module.exports.dislikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true})
    .then((card) => {
      if (!card) throw new NotFoundError('Запрашиваемая карточка не найдена')
      res.status(StatusCodes.OK).send(card)
    })
    .catch((err) => handleError(err, res))
}
