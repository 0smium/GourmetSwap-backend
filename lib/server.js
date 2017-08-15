'use strict';

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(require('../router/auth-router.js'));
app.use(require('../router/profile-router.js'));
app.use(require('../router/cook-router.js'));
app.use(require('../router/meal-router.js'));

// eslint-disable-next-line no-unused-vars
app.all('/api/*', (req, res, next) => res.sendStatus(404));

app.use(require('../middleware/error-middleware.js'));

const server = module.exports = {};
server.isOn = false;
server.start = () => {
  return new Promise((resolve, reject) => {
    if (!server.isOn) {
      server.http = app.listen(process.env.PORT, () => {
        server.isOn = true;
        resolve();
      });
      return;
    }
    reject(new Error('server already running'));
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if (server.http && server.isOn) {
      return server.http.close(() => {
        server.isOn = false;
        resolve();
      });
    }
    reject(new Error('server not running'));
  });
};
