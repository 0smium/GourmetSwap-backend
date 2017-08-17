import Mongoose, {Schema} from 'mongoose';

const cookSchema = new Schema ({
  approved: {type: Boolean, default: true},
  signatureDishes: {type: String},
  restaurantsCookedIn: {type: Number},
  bestDescribes: {type: String, require: true},
  mealsPerWeek: {type: Number},
  services: {type: String},
  cuisines: {type: String},
  offerDelivery: {type: Boolean},
  userId: {type: Schema.Types.ObjectId, ref: 'user', unique: true},
  meals: [{type: String}],
  community: {type: String},
  hoursPerWeek: {type: String},
  moreInfo: {type: String},
  howDidYouHear: {type: String}
});

module.exports = Mongoose.model('cook', cookSchema);
