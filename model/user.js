'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
import Mongoose, {Schema} from 'mongoose';
import createError from 'http-errors';

const userSchema = Mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  tokenSeed: { type: String, unique: true },
  profile: { type: Schema.Types.ObjectId },
  cook: {type: Boolean, required: true, default: false}
});

userSchema.methods.passwordHashCreate = function(password) {
  return bcrypt.hash(password, 8).then(hash => {
    this.passwordHash = hash;
    return this;
  });
};

userSchema.methods.passwordHashCompare = function(password) {
  return bcrypt.compare(password, this.passwordHash).then(isCorrect => {
    if (isCorrect) return this;
    throw new Error('Unauthorized, password does not match');
  });
};

userSchema.methods.tokenSeedCreate = function() {
  return new Promise((resolve, reject) => {
    let tries = 1;

    let _tokenSeedCreate = () => {
      this.tokenSeed = crypto.randomBytes(32).toString('hex');
      this.save().then(() => resolve(this)).catch((err) => {
        if (tries < 1)
          return reject(new Error(err));
        tries--;
        _tokenSeedCreate();
      });
    };
    _tokenSeedCreate();
  });
};

userSchema.methods.tokenCreate = function() {
  return this.tokenSeedCreate().then(() =>
    jwt.sign({ tokenSeed: this.tokenSeed }, process.env.APP_SECRET)
  );
};

// userSchema.methods.tokenCreate  = function(){
//   this.tokenSeed = randomBytes(32).toString('base64')
//   return this.save()
//   .then(user => {
//     return jwt.sign({tokenSeed: this.tokenSeed}, process.env.SECRET)
//   })
//   .then(token => {
//     return token
//   })
// }

const User = module.exports = Mongoose.model('user', userSchema);

User.create = data => {
  let password = data.password;
  delete data.password;
  return new User(data)
    .passwordHashCreate(password)
    .then(user => user.tokenCreate());
};

User.handleOAUTH = function(data) {
  if(!data || !data.email)
    return Promise.reject(
      createError(400, 'VALIDATION ERROR: missing username email or password '));
  return User.findOne({email: data.email})
  .then(user => {
    if(!user)
      throw new Error('create the user');
    console.log('logging in account');
    return user;
  })
  .catch(() => {
    // create user from the email
    console.log('creating account');
    return new User({
      email: data.email,
    }).save();
  });
};
