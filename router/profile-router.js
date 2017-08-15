import { Router } from 'express';
import parserBody from '../middleware/parser-body.js';
import Profile from '../model/profile.js';
import { bearerAuth } from '../middleware/parser-auth.js';
import s3Upload from '../middleware/s3-upload-middleware.js';

const profileRouter = module.exports = new Router();

profileRouter.post('/api/profiles', bearerAuth, parserBody, s3Upload('avatarURL'), (req, res, next) => {
  if(req.s3Data) req.body.avatarURL = req.s3Data.Location;
  req.body.userId = req.user._id;
  // req.body.email = req.user.email;
  new Profile(req.body)
    .save()
    .then(profile => res.status(201).json(profile))
    .catch(next);
});

profileRouter.put('/api/profiles/:id', bearerAuth, parserBody, (req, res, next) => {
  let options = {
    new: true,
    runValidators: true,
  };
  req.body.userId = req.user._id;
  Profile.findOneAndUpdate(req.body.userId, req.body, options)
    .then(profile => res.status(202).json(profile))
    .catch(next);
});

profileRouter.get('/api/profiles/:id', (req, res, next) => {
  Profile.findOne({ userId: req.params.id })
    .then(profile => {
      res.json(profile);

    })
    .catch(next);
});

// profileRouter.get('/api/profiles/:id', (req, res, next) => {
//   Profile.findOne({ _id: req.params.id })
//     .then(profile => res.json(profile))
//     .catch(next);
// });
