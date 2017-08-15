import Mongoose, {Schema} from 'mongoose';

const cookSchema = new Schema ({
  approved: {type: Boolean, default: true, required: true},
  signatureDishes: {type: String, required: true},
  restaurantsCookedIn: {type: Number, required: true},
  bestDescribes: {type: String, require: true},
  mealsPerWeek: {type: Number, required: true},
  services: {type: Array, required: true},
  cuisines: {type: Array, required: true},
  offerDelivery: {type: Boolean, required: true},
  profile: {type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true},
  meals: {type: Array, required: true},
  community: {type: String, required: true}, 
  hoursPerWeek: {type: Number, required: true},
  moreIinfo: {type: String},
  howDidYouHear: {type: String}
});

module.exports = Mongoose.model('cook', cookSchema);