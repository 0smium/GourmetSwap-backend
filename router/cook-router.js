import { Router } from 'express';
import parserBody from '../middleware/parser-body.js';
import Cook from '../model/cook.js';
import { bearerAuth } from '../middleware/parser-auth.js';

const cookRouter = module.exports = new Router();

cookRouter.post('/api/cooks', bearerAuth, parserBody, (req, res, next) => {
  console.log(req.body);
  req.body.userId = req.user._id;
  new Cook(req.body)
    .save()
    .then(cook => res.status(201).json(cook))
    .catch(next);
});
// try this yall
cookRouter.get('/api/cooks/:id', (req, res, next) => {
  Cook.findOne({userId: req.params.id})
    .then((cook) => {
      res.json(cook);
    })
    .catch(next);
  //then on success send response, with which state on front end is state
});

cookRouter.put('/api/cooks/:id', bearerAuth, parserBody, (req, res, next) => {
  let options = {
    new: true,
    runValidators: true,
  };
  req.body.userId = req.params.id;
  Cook.findOneAndUpdate(req.body.userId, req.body, options)
    .then(cook => {
      res.status(202).json(cook);
    })
    .catch(next);
});
