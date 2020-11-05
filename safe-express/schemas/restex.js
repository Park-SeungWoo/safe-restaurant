const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const restaurantSchema = new Schema({
  restaurantid: {
    type: Number,
    required: true,
  },
  restaurantname: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  kraddr: {
    type: String,
    required: true,
  },
  enaddr: {
    type: String,
    required: true,
  },
  resGubun: {
    type: String,
    required: true,
  },
  resGubunDetail: {
    type: String,
    required: true,
  },
  resTEL: {
    type: String,
    required: true,
  },
  isSaferes: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('restaurant', restaurantSchema);
