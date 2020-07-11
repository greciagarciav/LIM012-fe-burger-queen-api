const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;
const usersSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is necessary'],
  },
  password: {
    type: String,
    required: [true, 'Password is necessary'],
  },
  roles: {
    type: Object,
  },
});
// se agrera el plugin de validacion unica y exportamos el schema
usersSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser único',
});
usersSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Users', usersSchema);
