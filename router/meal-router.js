import { Router } from 'express';
import parserBody from '../middleware/parser-body.js';
import Meal from '../model/meal.js';
import { bearerAuth } from '../middleware/parser-auth.js';
import s3upload from '../middleware/s3-upload-middleware.js';
import Cook from '../model/cook.js';

const mealRouter = module.exports = new Router();

mealRouter.post('/api/meals', bearerAuth, s3upload('photoURL'), (req, res, next) => {
  req.body.userId = req.user._id;
  req.body.photoURL = req.s3Data.Location;
  // req.body.meals = [];
  new Meal(req.body)
    .save()
    .then(meal => {
      return Cook.findOne({userId: req.user._id})
        .then(cook => {
          console.log('meal', meal);
          cook.meals.push(meal._id);
          console.log('cook', cook);
          return cook.save()
            .then(() => res.status(201).json(meal));
        });
    })
    .catch(next);
});

mealRouter.put('/api/meals/:id', bearerAuth, parserBody, (req, res, next) => {
  let options = {
    new: true,
    runValidators: true,
  };
  req.body.userId = req.params.id;
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

mealRouter.get('/api/meals', (req, res, next) => {

  if(req.query.sortBy) {
    let sortBy = req.query.sortBy;
  }
  let pageNumber = Number(req.query.page);
  if (!pageNumber || pageNumber < 1) pageNumber = 1;
  pageNumber--;

  Meal.find({})
    .sort({ title: 'asc' })
    .skip(pageNumber * 50)
    .limit(50)
    .then(meals => res.status(200).json(meals))
    .catch(next);
});

mealRouter.delete('/api/meals/:id', bearerAuth, (req, res, next) => {
  Meal.findOneAndDelete({ userId: req.params.id })
    .then(() => {
      res.setStatus(204);
    })
    .catch(next);
});
