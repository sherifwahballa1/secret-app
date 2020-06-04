const mongoose = require('mongoose');
// const User = require('./userModel');
// const validator = require('validator');

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true
    },
    postImg: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      trim: true
    },
    //images: [String],
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
      required: [true, 'Post must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

postSchema.index({ text: 1 });

postSchema.pre(/^find/, function(next) {
  this.find({ deleted: { $ne: true } });
  next();
});

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt'
  });

  next();
});
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
