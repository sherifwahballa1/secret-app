const mongoose = require('mongoose');
// const User = require('./userModel');
// const validator = require('validator');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true
    },
    commentImg: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    deleted: {
      type: Boolean,
      default: false,
      select: false
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user']
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'Comment must belong to a post']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
commentSchema.index({ post: 1, user: 1 }, { unique: true });

commentSchema.pre(/^find/, function(next) {
  this.find({ deleted: { $ne: true } });
  next();
});

commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'post'
  }).populate({
    path: 'user'
  });

  // this.populate({
  //   path: 'user',
  //   select: 'firstName lastName photo'
  // });
  next();
});

// findByIdAndUpdate
// findByIdAndDelete
commentSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
