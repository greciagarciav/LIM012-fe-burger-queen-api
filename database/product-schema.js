const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const productsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A name is necessary'],
  },
  price: {
    type: String,
    required: [true, 'A price is necessary'],
  },
  type: {
    type: String,
  },
  image: {
    type: String,
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
});
productsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Products', productsSchema);
