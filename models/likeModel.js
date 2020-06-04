const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post'
  },
  isLike: {
    type: Boolean,
    default: false
  },
  dateAdd: {
    type: Date,
    default: Date.now()
  }
});

likeSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'postId'
//   });

  this.populate({
    path: 'user',
    select: 'firstName lastName photo'
  });
  next();
});

likeSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});
const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
