import { Router } from 'express';
import parserBody from '../lib/parser-body.js';
import Profile from '../model/profile.js';
import { bearerAuth } from '../lib/parser-auth.js';

const profileRouter = module.exports = new Router();

// profileRouter.post('/api/profiles', bearerAuth, parserBody, (req, res, next) => {
profileRouter.post('/api/profiles', bearerAuth, (req, res, next) => {
  console.log('profile req.body: ', req.body);
  Profile.create(req)
    .then(res.json)
    .catch(next);
});
