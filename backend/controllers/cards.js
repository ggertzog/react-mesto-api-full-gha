const { CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');
const { IncorrectError, NotFoundError, AccessError } = require('../errors/errors');

module.exports.getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch(err) {
    return next(err);
  }
}

module.exports.createCard = (req, res, next) => {
    const { name, link } = req.body;
    const  owner = req.user._id;
    Card.create({ name, link, owner })
      .then((card) => {
        card
          .populate('owner')
          .then((newCard) => res.status(ERROR_CODE.CREATED).send(newCard));
      })
      .catch((err) => {
        if(err instanceof ValidationError) {
          return next(new IncorrectError('Переданы некорректные данные'));
        }
        return next(err);
      });
}

module.exports.deleteCard =  (req, res, next) => {
    Card
      .findByIdAndRemove(req.params.cardId)
      .orFail(() => {
        throw new NotFoundError('Карточка не найдена');
      })
      .then((card) => {
        if(card.owner.toString() !== req.user._id.toString()) {
          throw new AccessError('Ошибка прав доступа');
        }
        res.status(ERROR_CODE.OK).send({ message: 'Карточка удалена'});
      })
      .catch((err) => {
        if(err instanceof CastError) {
          return next(new IncorrectError('Переданы некорректные данные'));
        }
        return next(err);
      })
}

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if(!card) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.status(ERROR_CODE.OK).send(card);
    })
    .catch((err) => {
      if(err instanceof CastError) {
        return next(new IncorrectError('Переданы некорректные данные'));
      }
      return next(err);
    });
}

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if(!card) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.status(ERROR_CODE.OK).send(card);
    })
    .catch((err) => {
      if(err instanceof CastError) {
        return next(new IncorrectError('Переданы некорректные данные'));
      }
      return next(err);
    });
}