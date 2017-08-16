import Mongoose, {Schema} from 'mongoose';

const mealSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'user', required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  deliveryOffered: {type: Boolean, required: true},
  portions: {type: Number, required: true},
  photoURL: {type: String},
  ingredients: {type: String, required: true},
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  location: {type: String, required: true},
  enabled: {type: Boolean, required: true},
  price: {type: Number, required: true},
  allTimeOrders: {type: Number}
});

module.exports = Mongoose.model('meal', mealSchema);
