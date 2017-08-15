'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');
const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');

const API_URL = process.env.API_URL;

describe('Testing Profile Model', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Profile POST', () => {
    it('should return 201 and the profile', () => {
      let tempUser;
      return mockUser.createOne()
        .then(userData => {
          tempUser = userData;
          return superagent.post(`${API_URL}/api/profiles`)
            .set('Authorization', `Bearer ${userData.token}`)
            .field('firstName', 'Bart')
            .field('lastName', 'Simpson')
            .field('streetAddress', '742 Evergreen Ter')
            .field('zip', '00000')
            .field('city', 'Springfield')
            .field('state', 'TS')
            .field('phone', '1234567890')
            .field('isCook', true);
        //  .attach('image', `${__dirname}/assets/me.jpg`);
        })
        .then(res => {
          expect(res.status).toEqual(201);
          expect(res.body.userId).toEqual(tempUser.user._id.toString());
          expect(res.body.firstName).toEqual('Bart');
          expect(res.body.lastName).toEqual('Simpson');
          expect(res.body.streetAddress).toEqual('742 Evergreen Ter');
          expect(res.body.zip).toEqual('00000');
          expect(res.body.city).toEqual('Springfield');
          expect(res.body.state).toEqual('TS');
          expect(res.body.phone).toEqual('1234567890');
          expect(res.body.isCook).toEqual(true);
          // expect(res.body.image).toExist();
        });
    });//.timeout(3000);
    it('should return 400 bad request', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profiles`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              nope: 'non existent',
            })
            .then(res => {
              throw res;
            })
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(() => {
          return superagent.post(`${API_URL}/api/profiles`)
            .field('firstName', 'Bart')
            .field('lastName', 'Simpson')
            .field('streetAddress', '742 Evergreen Ter')
            .field('zip', '00000')
            .field('city', 'Springfield')
            .field('state', 'TS')
            .field('phone', '1234567890')
            .field('isCook', true)
            //  .attach('image', `${__dirname}/assets/me.jpg`)
            .then(res => {
              throw res;
            })
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
  });

  describe('Profile GET', () => {
    let tempUser;
    it('should return 200 and the profile', () => {
      return mockUser.createOne()
        .then(userData => {
          tempUser = userData;
          return superagent.post(`${API_URL}/api/profiles`)
            .set('Authorization', `Bearer ${userData.token}`)
            .field('firstName', 'Bart')
            .field('lastName', 'Simpson')
            .field('streetAddress', '742 Evergreen Ter')
            .field('zip', '00000')
            .field('city', 'Springfield')
            .field('state', 'TS')
            .field('phone', '1234567890')
            .field('isCook', true);
          //  .attach('image', `${__dirname}/assets/me.jpg`)
        })
        .then(profile => {
          return superagent.get(`${API_URL}/api/profiles/${profile.body.userId}`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body.userId).toEqual(tempUser.user._id.toString());
              expect(res.body.firstName).toEqual('Bart');
              expect(res.body.lastName).toEqual('Simpson');
              expect(res.body.streetAddress).toEqual('742 Evergreen Ter');
              expect(res.body.zip).toEqual('00000');
              expect(res.body.city).toEqual('Springfield');
              expect(res.body.state).toEqual('TS');
              expect(res.body.phone).toEqual('1234567890');
              expect(res.body.isCook).toEqual(true);
              // expect(res.body.image).toExist();
            });
        });
    });//.timeout(3000);
    it('Should return 404 not found', () => {
      return superagent.get(`${API_URL}/api/profiles/dasdasdasdasd`)
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  // describe('Profile PUT', () => {
  //   it('should return 202 and the new profile', () => {
  //     let tempUser;
  //     return mockResidence.createOne()
  //       .then(residence => {
  //         return mockUser.createOne()
  //           .then(userData => {
  //             tempUser = userData;
  //             return superagent.post(`${API_URL}/api/profiles`)
  //               .set('Authorization', `Bearer ${userData.token}`)
  //               .field('name', 'Phil')
  //               .field('phone', '9998881234')
  //               .field('bio', 'I am Phil')
  //               .field('residenceId', residence.id.toString())
  //               .attach('image', `${__dirname}/assets/me.jpg`);
  //           })
  //           .then(profile => {
  //             return superagent.put(`${API_URL}/api/profiles/${profile.body._id}`)
  //               .set('Authorization', `Bearer ${tempUser.token}`)
  //               .send({
  //                 name: 'Paul',
  //                 bio: 'I am no longer Phil, I am Paul'
  //               });
  //           })
  //           .then(res => {
  //             expect(res.status).toEqual(202);
  //             expect(res.body.userId).toEqual(tempUser.user._id.toString());
  //             expect(res.body.name).toEqual('Paul');
  //             expect(res.body.phone).toEqual('9998881234');
  //             expect(res.body.bio).toEqual('I am no longer Phil, I am Paul');
  //             expect(res.body.residenceId).toEqual(residence.id.toString());
  //             expect(res.body.image).toExist();
  //           });
  //       });
  //   }).timeout(3000);
  //   it('should return 400 bad request', () => {
  //     let tempUser;
  //     return mockResidence.createOne()
  //       .then(residence => {
  //         return mockUser.createOne()
  //           .then(userData => {
  //             tempUser = userData;
  //             return superagent.post(`${API_URL}/api/profiles`)
  //               .set('Authorization', `Bearer ${userData.token}`)
  //               .field('name', 'Phil')
  //               .field('phone', '9998881234')
  //               .field('bio', 'I am Phil')
  //               .field('residenceId', residence.id.toString())
  //               .attach('image', `${__dirname}/assets/me.jpg`);
  //           })
  //           .then(profile => {
  //             return superagent.put(`${API_URL}/api/profiles/${profile.body._id}`)
  //               .set('Authorization', `Bearer ${tempUser.token}`)
  //               .send({
  //                 userId: 123,
  //                 name: 321,
  //                 bio: {none: 'none'},
  //               });
  //           })
  //           .then(res => {
  //             throw res;
  //           })
  //           .catch(res => {
  //             expect(res.status).toEqual(400);
  //           });
  //       });
  //   });
  //   it('should return 401 unauthorized', () => {
  //     return mockResidence.createOne()
  //       .then(residence => {
  //         return superagent.post(`${API_URL}/api/profiles`)
  //           .field('name', 'Phil')
  //           .field('phone', '9998881234')
  //           .field('bio', 'I am Phil')
  //           .field('residenceId', residence.id.toString())
  //           .attach('image', `${__dirname}/assets/me.jpg`);
  //       })
  //       .then(profile => {
  //         return superagent.put(`${API_URL}/api/profiles/${profile.body._id}`)
  //           .field('name', 'Mike')
  //           .field('phone', '1234881234')
  //           .field('bio', 'I am mike');
  //       })
  //       .then(res => {
  //         throw res;
  //       })
  //       .catch(res => {
  //         expect(res.status).toEqual(401);
  //       });
  //   });
  //   it('should return 404 not found', () => {
  //     return mockResidence.createOne()
  //       .then(residence => {
  //         return mockUser.createOne()
  //           .then(userData => {
  //             return superagent.post(`${API_URL}/api/profiles`)
  //               .set('Authorization', `Bearer ${userData.token}`)
  //               .field('name', 'Phil')
  //               .field('phone', '9998881234')
  //               .field('bio', 'I am Phil')
  //               .field('residenceId', residence.id.toString())
  //               .attach('image', `${__dirname}/assets/me.jpg`)
  //               .then(() => {
  //                 return superagent.put(`${API_URL}/api/profiles/sdasdasdasdasdasdasdasdasdasd`)
  //                   .set('Authorization', `Bearer ${userData.token}`)
  //                   .send({
  //                     userId: 'jflkasjdlksajdl',
  //                     name: 'Paul',
  //                     bio: 'I am no longer Phil, I am Paul',
  //                   });
  //               })
  //               .then(res => {
  //                 throw res;
  //               })
  //               .catch(res => {
  //                 expect(res.status).toEqual(404);
  //               });
  //           });
  //       });
  //   });
  // });
});
