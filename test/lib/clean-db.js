'use strict';

const User = require('../../model/user.js');
// const Profile = require('../../model/profile.js');
// const Cook = require('../../model/cook.js');
// const Meal = require('../../model/meal.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
    // Profile.remove({}),
    // Cook.remove({}),
    // Meal.remove({}),
  ]);
};
