import { Router } from 'express';
import parserBody from '../lib/parser-body.js';
import Cook from '../model/cook.js';
import { bearerAuth } from '../lib/parser-auth.js';

const cookRouter = module.exports = new Router();

// profileRouter.post('/api/profiles', bearerAuth, parserBody, (req, res, next) => {
// profileRouter.post('/api/profiles', bearerAuth, (req, res, next) => {
//   console.log('profile req.body: ', req.body);
//   Profile.create(req)
//     .then(profile => res.status(201).json(profile))
//     .catch(next);
// });

cookRouter.post('/api/cook', bearerAuth, parserBody, (req, res, next) => {
    console.log('look here', req.body);
  req.body.profile = req.user._id;
  // req.body.email = req.user.email;
  new Cook(req.body)
    .save()
    .then(cook => res.status(201).json(cook))
    .catch(next);
});