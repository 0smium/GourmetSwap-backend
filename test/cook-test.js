// 'use strict';
//
// require('dotenv').config({path: `${__dirname}/../.test.env`});
// const superagent = require('superagent');
// const expect = require('expect');
// const server = require('../lib/server.js');
// const cleanDB = require('./lib/clean-db.js');
// const mockUser = require('./lib/mock-user.js');
//
// const API_URL = process.env.API_URL;
//
// describe('Testing Cook Model', () => {
//   before(server.start);
//   after(server.stop);
//   afterEach(cleanDB);
//
//   describe.only('Cook POST', () => {
//     it('should return 201 and the cook profile', () => {
//       let tempUser;
//       return mockUser.createOne()
//         .then(userData => {
//           tempUser = userData;
//           return superagent.post(`${API_URL}/api/cooks`)
//             .set('Authorization', `Bearer ${userData.token}`)
//             .field('signatureDishes', 'Spaghetti')
//             .field('restaurantsCookedIn', 5)
//             .field('mealsPerWeek', 10)
//             .field('services', 'catering')
//             .field('cuisines', 'Italian')
//             .field('community', 'I would get people TOGETHER!')
//             .field('hoursPerWeek', '20')
//             .field('moreInfo', 'I am just an awesome person.  It\'s true!')
//             .field('howDidYouHear', 'word of mouth');
//         })
//         .then(res => {
//           expect(res.status).toEqual(201);
//           expect(res.body.userId).toEqual(tempUser.user._id.toString());
//           expect(res.body.restaurantsCookedIn).toEqual(5);
//         });
//     }).timeout(3000);
//     it('should return 400 bad request', () => {
//       return mockUser.createOne()
//         .then(userData => {
//           return superagent.post(`${API_URL}/api/profiles`)
//             .set('Authorization', `Bearer ${userData.token}`)
//             .send({
//               nope: 'non existent',
//             })
//             .then(res => {
//               throw res;
//             })
//             .catch(res => {
//               expect(res.status).toEqual(400);
//             });
//         });
//     });
//     it('should return 401 unauthorized', () => {
//       return mockUser.createOne()
//         .then(() => {
//           return superagent.post(`${API_URL}/api/profiles`)
//             .field('firstName', 'Bart')
//             .field('lastName', 'Simpson')
//             .field('streetAddress', '742 Evergreen Ter')
//             .field('zip', '00000')
//             .field('city', 'Springfield')
//             .field('state', 'TS')
//             .field('phone', '1234567890')
//             .field('wantsToBeCook', true)
//             .attach('avatarURL', `${__dirname}/assets/bart.png`)
//             .then(res => {
//               throw res;
//             })
//             .catch(res => {
//               expect(res.status).toEqual(401);
//             });
//         });
//     });
//   });
//
//   describe('Profile GET', () => {
//     it('should return 200 and the profile', () => {
//       let tempUser;
//       return mockUser.createOne()
//         .then(userData => {
//           tempUser = userData;
//           return superagent.post(`${API_URL}/api/profiles`)
//             .set('Authorization', `Bearer ${userData.token}`)
//             .field('firstName', 'Bart')
//             .field('lastName', 'Simpson')
//             .field('streetAddress', '742 Evergreen Ter')
//             .field('zip', '00000')
//             .field('city', 'Springfield')
//             .field('state', 'TS')
//             .field('phone', '1234567890')
//             .field('wantsToBeCook', true)
//             .attach('avatarURL', `${__dirname}/assets/bart.png`);
//         })
//         .then(profile => {
//           return superagent.get(`${API_URL}/api/profiles/${profile.body.userId}`)
//             .then(res => {
//               expect(res.status).toEqual(200);
//               expect(res.body.userId).toEqual(tempUser.user._id.toString());
//               expect(res.body.firstName).toEqual('Bart');
//               expect(res.body.lastName).toEqual('Simpson');
//               expect(res.body.streetAddress).toEqual('742 Evergreen Ter');
//               expect(res.body.zip).toEqual('00000');
//               expect(res.body.city).toEqual('Springfield');
//               expect(res.body.state).toEqual('TS');
//               expect(res.body.phone).toEqual('1234567890');
//               expect(res.body.wantsToBeCook).toEqual(true);
//               expect(res.body.avatarURL).toExist();
//             });
//         });
//     }).timeout(3000);
//     it('Should return 404 not found', () => {
//       return superagent.get(`${API_URL}/api/profiles/dasdasdasdasd`)
//         .then(res => {
//           throw res;
//         })
//         .catch(res => {
//           expect(res.status).toEqual(404);
//         });
//     });
//   });
//
//   describe('Profile PUT', () => {
//     it('should return 202 and the new profile', () => {
//       let tempUser;
//       return mockUser.createOne()
//         .then(userData => {
//           tempUser = userData;
//           return superagent.post(`${API_URL}/api/profiles`)
//             .set('Authorization', `Bearer ${userData.token}`)
//             .field('firstName', 'Bart')
//             .field('lastName', 'Simpson')
//             .field('streetAddress', '742 Evergreen Ter')
//             .field('zip', '00000')
//             .field('city', 'Springfield')
//             .field('state', 'TS')
//             .field('phone', '1234567890')
//             .field('wantsToBeCook', true)
//             .attach('avatarURL', `${__dirname}/assets/bart.png`);
//         })
//         .then(profile => {
//           return superagent.put(`${API_URL}/api/profiles/${profile.body.userId}`)
//             .set('Authorization', `Bearer ${tempUser.token}`)
//             .field('firstName', 'Lisa')
//             .attach('avatarURL', `${__dirname}/assets/lisa.png`);
//         })
//         .then(res => {
//           expect(res.status).toEqual(202);
//           expect(res.body.userId).toEqual(tempUser.user._id.toString());
//           expect(res.body.firstName).toEqual('Lisa');
//           expect(res.body.avatarURL).toExist();
//         });
//     }).timeout(3000);
//     it('should return 400 bad request', () => {
//       let tempUser;
//       return mockUser.createOne()
//         .then(userData => {
//           tempUser = userData;
//           return superagent.post(`${API_URL}/api/profiles`)
//             .set('Authorization', `Bearer ${userData.token}`)
//             .field('firstName', 'Bart')
//             .field('lastName', 'Simpson')
//             .field('streetAddress', '742 Evergreen Ter')
//             .field('zip', '00000')
//             .field('city', 'Springfield')
//             .field('state', 'TS')
//             .field('phone', '1234567890')
//             .field('wantsToBeCook', true);
//         })
//         .then(profile => {
//           return superagent.put(`${API_URL}/api/profiles/${profile.body.userId}`)
//             .set('Authorization', `Bearer ${tempUser.token}`);
//         })
//         .then(res => {
//           throw res;
//         })
//         .catch(res => {
//           expect(res.status).toEqual(400);
//         });
//     }).timeout(3000);
//     it('should return 401 unauthorized', () => {
//       return superagent.post(`${API_URL}/api/profiles`)
//         .field('firstName', 'Bart')
//         .field('lastName', 'Simpson')
//         .field('streetAddress', '742 Evergreen Ter')
//         .field('zip', '00000')
//         .field('city', 'Springfield')
//         .field('state', 'TS')
//         .field('phone', '1234567890')
//         .field('wantsToBeCook', true)
//         .then(profile => {
//           return superagent.put(`${API_URL}/api/profiles/${profile.body._id}`)
//             .field('phone', '1234881234');
//         })
//         .then(res => {
//           throw res;
//         })
//         .catch(res => {
//           expect(res.status).toEqual(401);
//         });
//     });
//     it('should return 404 not found', () => {
//       let tempUser;
//       return mockUser.createOne()
//         .then(userData => {
//           tempUser = userData;
//           return superagent.post(`${API_URL}/api/profiles`)
//             .set('Authorization', `Bearer ${userData.token}`)
//             .field('firstName', 'Bart')
//             .field('lastName', 'Simpson')
//             .field('streetAddress', '742 Evergreen Ter')
//             .field('zip', '00000')
//             .field('city', 'Springfield')
//             .field('state', 'TS')
//             .field('phone', '1234567890')
//             .field('wantsToBeCook', true);
//         })
//         .then(() => {
//           return superagent.put(`${API_URL}/api/profiles/lkfjwelkjfldjflksdjgf`)
//             .set('Authorization', `Bearer ${tempUser.token}`)
//             .field('firstName', 'Lisa');
//         })
//         .then(res => {
//           throw res;
//         })
//         .catch(res => {
//           expect(res.status).toEqual(404);
//         });
//     });
//   });
// });
