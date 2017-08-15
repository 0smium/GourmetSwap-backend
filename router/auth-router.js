'use strict';

const { Router } = require('express');
const User = require('../model/user.js');
const jsonParser = require('body-parser').json();
// import basicAuth from '../middleware/basic-auth-middleware.js';
import parserBody from '../middleware/parser-body.js';
import { basicAuth, bearerAuth } from '../middleware/parser-auth.js';

const authRouter = module.exports = new Router();

authRouter.post('/api/signup', jsonParser, (req, res, next) => {
  User.create(req.body)
    .then(token => {
      res.status(201).send(token);
      // console.log('res: ', res);
    })
    .catch(next);
});

authRouter.get('/api/signin', basicAuth, (req, res, next) => {
  req.user.tokenCreate().then(token => res.send(token)).catch(next);
});

authRouter.put('/api/users', bearerAuth, parserBody, (req, res, next) => {
  let options = {
    new: true,
    runValidators: true,
  };

  User.findOneAndUpdate(req.user._id, req.body, options)
    .then(profile => res.status(202).json(profile))
    .catch(next);
});

// authRouter.put('/api/passwords', basicAuth, parserBody, (req, res, next) => {
//   let options = {
//     new: true,
//     runValidators: true,
//   };

//   User.findOneAndUpdate(req.user._id, req.body, options)
//     .then(profile => res.status(202).json(profile))
//     .catch(next);
// });
