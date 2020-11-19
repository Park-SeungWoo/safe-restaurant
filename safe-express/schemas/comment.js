const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const commentSchema = new Schema({
  restaurantname: {
    type: ObjectId,
    required: true,
    ref: 'restaurant',
  },
  nickname: {
    type:String,
  },
  rating:{
    type: Number,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
