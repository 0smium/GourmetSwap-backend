import * as jwt from 'jsonwebtoken';
import User from '../model/user.js';
import createError from 'http-errors';
import {promisify, partial} from '../middleware/util.js';

export const basicAuth = (req, res, next) => {
  // console.log('parser-auth basicAuth req.body', req.body);
  let {authorization} = req.headers;
  if(!authorization)
    return next(createError(400, 'AUTH ERROR: no authorization header'));

  let encoded = authorization.split('Basic ')[1];
  if(!encoded)
    return next(createError(400, 'unauthorized: no basic auth provided.'));

  let decoded = new Buffer(encoded, 'base64').toString();
  let [email, password] = decoded.split(':');
  if(!email || !password)
    return next(createError(401, 'unauthorized: no email or password provided.'));

  User.findOne({email})
    .then(user => {
      if(!user)
        throw createError(401, 'unauthorized: user does not exist.');
      return user.passwordHashCompare(password);
    })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};

export const bearerAuth = (req, res, next) => {
  let {authorization} = req.headers;
  if(!authorization)
    return next(createError(400, 'AUTH ERROR: no authorization header'));

  let token = authorization.split('Bearer ')[1];
  if(!token)
    return next(createError(400, 'AUTH ERROR: not bearer auth'));

  promisify(jwt.verify)(token, process.env.APP_SECRET)
    // .then(({randomHash}) => {
    //   console.log(randomHash);
    //   User.findOne({randomHash});
    // })
    .then(decoded => User.findOne({tokenSeed: decoded.tokenSeed}))
    .then((user) => {
      if(!user)
        throw createError(401, 'AUTH ERROR: user not found');
      req.user = user;
      next();
    })
    .catch(partial(createError, 401));
};
