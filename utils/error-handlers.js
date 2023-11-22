const {StatusCodes} = require("http-status-codes");
const mongoose = require("mongoose");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Not Found Error'
  }
}
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Bad Request Error'
  }
}

const handleError = (err, response) => {
  if (err instanceof mongoose.Error) return response.status(StatusCodes.BAD_REQUEST).send({message: err.message})
  if (err instanceof NotFoundError) return response.status(StatusCodes.NOT_FOUND).send({message: err.message})
  if (err instanceof BadRequestError) return response.status(StatusCodes.BAD_REQUEST).send({message: err.message})
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: 'На сервере произошла ошибка'})
}

module.exports = {
  handleError,
  NotFoundError,
  BadRequestError
}
