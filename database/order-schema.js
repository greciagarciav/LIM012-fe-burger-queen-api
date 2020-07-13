const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const ordersSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'userId is necessary'],
  },
  client: {
    type: String,
  },
  products: {
    type: Array,
    required: [true, 'products are necessary'],
  },
  status: {
    type: String,
    enum: ['pending', 'canceled', 'delivering', 'delivered'],
    default: 'pending',
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
  dateProcessed: {
    type: Date,
  },
});
ordersSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Orders', ordersSchema);
