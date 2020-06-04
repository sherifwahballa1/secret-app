const User = require('../models/userModel');
const Post = require('../models/postModel');
const Follower = require('../models/followerModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');
const catchAsync = require('../utils/catchAsync');

exports.getRegisterForm = (req, res) => {
  res.status(200).render('register', {
    title: 'Register your account'
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login With your account'
  });
};

exports.getSettingForm = (req, res) => {
  res.status(200).render('me', {
    title: 'Account Settings'
  });
};

exports.getHomeForm = (req, res) => {
  res.status(200).render('home', {
    title: 'Home Page'
  });
};

exports.geAllMyPosts = catchAsync(async (req, res, next) => {
  //console.log(users);
  const followers = await Follower.find({
    ownerId: req.user.id,
    isFollower: { $eq: true }
  }).select('followerId -_id');
  const numberOfFollowing = followers.length;

  const followers2 = await Follower.find({
    followerId: req.user.id,
    isFollower: { $eq: true }
  });
  const numberOfFollower = followers2.length;

  let followerArr = [];
  followers.forEach(follow => {
    followerArr.push(follow.followerId);
  });
  followerArr.push(req.user.id);

  const posts = await Post.find({
    user: { $in: followerArr },
    deleted: { $ne: true }
  }).populate('user').sort({ createdAt: -1 });

  const userPosts = await Post.find({
    user: req.user.id,
    deleted: { $ne: true }
  });
  const numOfUserPosts = userPosts.length;

  const users = await User.find({
    _id: { $nin: followerArr }
  }).limit(6);

  const likes = await Like.find({
    userId: { $eq: req.user.id }
  });

  res.status(200).render('home', {
    title: 'Home Page',
    posts,
    users,
    numberOfFollowing,
    numberOfFollower,
    numOfUserPosts,
    likes
  });
  //next();
});

exports.getMyProfile = catchAsync(async (req, res, next) => {
  const posts = await Post.find({
    user: req.user.id,
    deleted: { $ne: true }
  }).sort({ createdAt: -1 });

  const followers = await Follower.find({
    ownerId: req.user.id,
    isFollower: { $eq: true }
  }).select('followerId -_id');
  const numberOfFollowing = followers.length;

  const followers2 = await Follower.find({
    followerId: req.user.id,
    isFollower: { $eq: true }
  });
  const numberOfFollower = followers2.length;

  res.status(200).render('profile', {
    title: 'Profile Page',
    posts,
    numberOfFollowing,
    numberOfFollower
  });
  //next();
});

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user2 = await User.findOne({ _id: req.params.id });
  const user3 = await Follower.findOne({
    $and: [
      {
        followerId: { $eq: req.params.id }
      },
      {
        ownerId: { $eq: req.user.id }
      }
    ]
  }).select('isFollower');
  const followers2 = await Follower.find({
    followerId: req.params.id,
    isFollower: { $eq: true }
  });
  const numberOfFollower = followers2.length;

  const followers = await Follower.find({
    ownerId: req.params.id,
    isFollower: { $eq: true }
  }).select('followerId -_id');
  const numberOfFollowing = followers.length;

  const idd = req.params.id;
  const ownerId = req.user.id;
  const posts = await Post.find({
    user: req.params.id,
    deleted: { $ne: true }
  }).sort({ createdAt: -1 });

  res.status(200).render('userProfile', {
    title: 'User Page',
    user2,
    posts,
    idd,
    ownerId,
    user3,
    numberOfFollower,
    numberOfFollowing
  });
  //next();
});

exports.deletePost = catchAsync(async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.id);
});

exports.followUnfollow = catchAsync(async (req, res, next) => {
  const ifFollow = await Follower.findOne({
    ownerId: req.user.id,
    followerId: { $eq: req.params.id }
  });
  if (ifFollow.length === 0 || !ifFollow) {
    const newFollow = {
      ownerId: req.user.id,
      followerId: req.params.id,
      isFollower: true
    };

    const newFollowM = await Follower.create(newFollow);
    res.status(200).json({
      status: 'success',
      message: 'you follow new user',
      newFollowM
    });
  } else {
    const m = '';
    if (ifFollow.isFollower === true) {
      const newFollowUpdate = {
        isFollower: false
      };
      const newFollowUpdateM = await Follower.findOneAndUpdate(
        { ownerId: req.user.id, followerId: req.params.id },
        newFollowUpdate,
        {
          runValidators: true,
          new: true
        }
      );
      res.status(200).json({
        status: 'success',
        message: 'you unfollow this user',
        newFollowUpdateM
      });
    } else if (ifFollow.isFollower === false) {
      const newFollowUpdate = {
        isFollower: true
      };
      const newFollowUpdateM = await Follower.findOneAndUpdate(
        {
          ownerId: req.user.id,
          followerId: req.params.id
        },
        newFollowUpdate,
        {
          runValidators: true,
          new: true
        }
      );
      res.status(200).json({
        status: 'success',
        message: 'you follow this user',
        newFollowUpdateM
      });
    }
  }
});

exports.getCommentsPost = catchAsync(async (req, res) => {
  const comments = await Comment.find({
    post: { $eq: req.params.id }
  });

  const numOfComments = comments.length;
  const followers = await Follower.find({
    ownerId: req.user.id,
    isFollower: { $eq: true }
  });
  const numberOfFollowing = followers.length;

  const followers2 = await Follower.find({
    followerId: req.user.id,
    isFollower: { $eq: true }
  });
  const numberOfFollower = followers2.length;
  const userPosts = await Post.find({
    user: req.user.id,
    deleted: { $ne: true }
  });
  const numOfUserPosts = userPosts.length;

  const post = await Post.findOne({
    _id: { $eq: req.params.id }
  });

  const ifIlikePost = await Like.findOne({
    $and: [
      {
        userId: { $eq: req.user.id }
      },
      {
        postId: { $eq: req.params.id }
      }
    ]
  });

  const numberOfLikes = await Like.find({
    $and: [
      {
        postId: { $eq: req.params.id }
      },
      {
        isLike: { $eq: true }
      }
    ]
  });

  const numberOfLikes2 = numberOfLikes.length;

  res.status(200).render('commentPage', {
    title: 'Post',
    numberOfFollowing,
    numberOfFollower,
    numOfUserPosts,
    post,
    ifIlikePost,
    numberOfLikes2,
    comments,
    numOfComments
  });
});
