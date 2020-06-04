const mongoose = require('mongoose');

const followerSchema = mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  followerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  isFollower: {
    type: Boolean,
    default: false
  },
  dateAdd: {
    type: Date,
    default: Date.now()
  }
});

const Follower = mongoose.model('Friend', followerSchema);

module.exports = Follower;
