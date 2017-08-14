import {Router} from 'express';
import parserBody from '../lib/parser-body.js';
import Profile from '../model/profile.js';
import {bearerAuth} from '../lib/parser-auth.js';

export default new Router()
  .post('/profiles', bearerAuth, parserBody, (req, res, next) => {
    console.log('profile req.body: ', req.body);
    Profile.create(req)
      .then(res.json)
      .catch(next);
  });
