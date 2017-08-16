import Mongoose, {Schema} from 'mongoose';

const transactionSchema = new Schema({
  creationDate: {type: Date, required: true, default: Date.now},
  customer: {type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true},
  cook: {type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true},
  meals: [{type: String}],
  delivered: {type: Boolean},
  pickedUp: {type: Boolean},
  total: {type: Number},
  status: {type: String} //inCart, Paid, Complete
});

module.exports = Mongoose.model('profile', transactionSchema);
