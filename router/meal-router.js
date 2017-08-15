import { Router } from 'express';
import parserBody from '../middleware/parser-body.js';
import Meal from '../model/meal.js';
import { bearerAuth } from '../middleware/parser-auth.js';

const mealRouter = module.exports = new Router();

mealRouter.post('/api/meals', bearerAuth, parserBody, (req, res, next) => {
  req.body.userId = req.user._id;
  new Meal(req.body)
    .save()
    .then(meal => res.status(201).json(meal))
    .catch(next);
});

mealRouter.put('/api/meals/:id', bearerAuth, parserBody, (req, res, next) => {
  let options = {
    new: true,
    runValidators: true,
  };
  req.body.userId = req.user._id;
  Meal.findOneAndUpdate(req.body.userId, req.body, options)
    .then(meal => res.status(202).json(meal))
    .catch(next);
});

mealRouter.get('/api/meals/:id', (req, res, next) => {
  Meal.findOne({ userId: req.params.id })
    .then(meal => {
      res.json(meal);
    })
    .catch(next);
});

mealRouter.delete('/api/meals:id', (req, res, next) => {
  Meal.findOneAndDelete({ userId: req. params.id })
    .then(() => {
      res.setStatus(204);
    })
    .catch(next);
});
