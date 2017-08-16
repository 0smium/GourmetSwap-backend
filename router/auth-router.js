'use strict';

const { Router } = require('express');
const User = require('../model/user.js');
const jsonParser = require('body-parser').json();
// import basicAuth from '../middleware/basic-auth-middleware.js';
import parserBody from '../middleware/parser-body.js';
import { basicAuth, bearerAuth } from '../middleware/parser-auth.js';
import superagent from 'superagent';
// import cors from 'cors';

const authRouter = module.exports = new Router();

authRouter.post('/api/signup', jsonParser, (req, res, next) => {
  User.create(req.body)
    .then(token => {
      res.cookie('Gourmet-Swap-Token', token);
      res.send(token);
      // res.status(201).send(token);
      // console.log('res: ', res);
    })
    .catch(next);
});


// .post('/signup', bodyParser.json() , (req, res, next) => {
//   new User.createFromSignup(req.body)
//   .then(user => user.tokenCreate())
//   .then(token => {
//     res.cookie('X-Slugchat-Token', token)
//     res.send(token)
//   })
//   .catch(next)
// })



authRouter.get('/api/signin', basicAuth, (req, res, next) => {
  req.user.tokenCreate().then(token => res.send(token)).catch(next);
});

authRouter.get('/api/users/auth', bearerAuth, (req, res) => {
  console.log('authRouter', req.user);
  if(req.user.cook) res.send('true');
  res.send('false');
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

// eslint-disable-next-line no-unused-vars
authRouter.get('/oauth/google/code', (req, res, next) => {
  console.log('req.query', req.query);
  if(!req.query.code) {
    // user has denied access
    res.redirect(process.env.CLIENT_URL);
  } else {
    // exchange the code for a google access token
    console.log('code', req.query.code);
    superagent.post('https://www.googleapis.com/oauth2/v4/token')
      .type('form')
      .send({
        code: req.query.code,
        grant_type: 'authorization_code',
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.API_URL}/oauth/google/code`,
      })
      .then(response => {
        console.log('google token data', response.body);
        // get the user profile
        return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
          .set('Authorization', `Bearer ${response.body.access_token}`);
      })
      .then(response => {
        console.log('google profile', response.body);
        // login or create user from profile
        return User.handleOAUTH(response.body);
      })
      .then(user => user.tokenCreate())
      .then(token => {
        res.cookie('Gourmet-Swap-Token', token);
        res.redirect(process.env.CLIENT_URL);
      })
      .catch((error) => {
        console.error(error);
        res.redirect(process.env.CLIENT_URL);
      });
  }
});
