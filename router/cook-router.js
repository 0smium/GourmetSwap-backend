import { Router } from 'express';
import parserBody from '../middleware/parser-body.js';
import Cook from '../model/cook.js';
import { bearerAuth } from '../middleware/parser-auth.js';

const cookRouter = module.exports = new Router();

cookRouter.post('/api/cook', bearerAuth, parserBody, (req, res, next) => {
  req.body.userId = req.user._id;
  // req.body.email = req.user.email;
  new Cook(req.body)
    .save()
    .then(cook => res.status(201).json(cook))
    .catch(next);
});
// try this yall
cookRouter.get('/api/cook', bearerAuth, parserBody, (req, res, next) => {
  Cook.findOne({userId: req.user._id})
    .then(() => {
      res.text('true');
    })
    .catch(next);
  //then on success send response, with which state on front end is state
});
