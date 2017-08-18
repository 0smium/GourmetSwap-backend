import Mongoose, {Schema} from 'mongoose';

const profileSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true},
  // email: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  streetAddress: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  phone: {type: String, required: true},
  wantsToBeCook: {type: Boolean, required: true},
  isCook: {type: Boolean, required: true, default: false},

  avatarURL: {type: String}
});

module.exports = Mongoose.model('profile', profileSchema);
