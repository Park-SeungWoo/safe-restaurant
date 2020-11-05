const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Double = mongoose.Schema.Types.Double;

const { Schema } = mongoose;
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
    type: Double,
    required: true,
  },
  longitude: {
    type: Double,
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
