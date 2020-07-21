const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;
const usersSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is necessary'],
    validate: {
      validator: (v) => /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(v),
      message: (props) => `${props.value} is not a valid Email!`,
    },
  },
  password: {
    type: String,
    required: [true, 'Password is necessary'],
    min: [5, 'Password is too weak'],
    validate: {
      validator: (v) => v.length >= 5,
      message: (props) => `${props.value} is not a valid Password!`,
    },
  },
  roles: {
    type: Object,
    default: {
      admin: false,
    },
  },
});
// se agrera el plugin de validacion unica
usersSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser único',
});
usersSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Users', usersSchema);
