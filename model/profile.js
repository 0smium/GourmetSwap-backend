// import createError from 'http-errors';
// import * as util from '../lib/util.js';
import Mongoose, {Schema} from 'mongoose';

const profileSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true},
  email: {type: String, required: true},
  firstName: {Type: String, required: true},
  lastName: {Type: String, required: true},
  streetAddress: {Type: String, required: true},
  zip: {Type: Number, required: true},
  city: {Type: String, required: true},
  state: {Type: String, required: true},
  phone: {Type: String, required: true},
  isCook: {Type: Boolean, required: true},
  avatarURL: {Type: String}
});

const Profile = Mongoose.model('profile', profileSchema);

Profile.create = function(req){
  return new Profile(req.body)
    .save()
    .then(profile => {
      req.user.profile = profile._id;
      return req.user.save()
        .then(() => profile);
    });
};

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
