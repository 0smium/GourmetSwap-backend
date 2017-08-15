// import createError from 'http-errors';
// import * as util from '../middleware/util.js';
import Mongoose, {Schema} from 'mongoose';

const profileSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true},
  // email: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  streetAddress: {type: String, required: true},
  zip: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  phone: {type: String, required: true},
  isCook: {type: Boolean, required: true},
  avatarURL: {type: String}
});

module.exports = Mongoose.model('profile', profileSchema);

// const Profile = Mongoose.model('profile', profileSchema);
//
// Profile.create = function(req){
//   console.log('req: ', req);
//   return new Profile(req.body)
//     .save()
//     .then(profile => {
//       req.user.profile = profile._id;
//       return req.user.save()
//         .then(() => profile);
//     });
// };

// Profile.validateReqFile = (req) => {
//   if(req.files.length > 1){
//     return util.removeMulterFiles(req.files)
//       .then(() => {
//         throw createError(400, 'VALIDATION ERROR: only one file permitted');
//       });
//   }
//   let [file] = req.files;
//
// };


// export default Profile;
