const Like = require('../models/likeModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllLikes = catchAsync(async (req, res, next) => {
  const allLikes = await Like.find({
    userId: req.user.id,
    isLike: { $ne: false }
  });
  res.status(200).json({
    status: 'success',
    allLikes
  });
});

exports.likeUnlike = catchAsync(async (req, res, next) => {
  const ifLike = await Like.findOne({
    userId: req.user.id,
    postId: { $eq: req.body.postId }
  });
  if (!ifLike) {
    const newLike = {
      userId: req.user.id,
      postId: req.body.postId,
      isLike: true
    };

    const newLikeM = await Like.create(newLike);
    res.status(200).json({
      status: 'success',
      message: 'you Like this post',
      newLikeM
    });
  } else {
    const m = '';
    if (ifLike.isLike === true) {
      const newLikeUpdate = {
        isLike: false
      };
      const newLikeUpdateM = await Like.findOneAndUpdate(
        { userId: req.user.id, postId: req.body.postId },
        newLikeUpdate,
        {
          runValidators: true,
          new: true
        }
      );
      res.status(200).json({
        status: 'success unlike',
        message: 'you unlike this post',
        newLikeUpdateM
      });
    } else if (ifLike.isLike === false) {
      const newLikeUpdate = {
        isLike: true
      };
      const newLikeUpdateM = await Like.findOneAndUpdate(
        {
          userId: req.user.id,
          postId: req.body.postId
        },
        newLikeUpdate,
        {
          runValidators: true,
          new: true
        }
      );
      res.status(200).json({
        status: 'success',
        message: 'you like this user',
        newLikeUpdateM
      });
    }
  }
});
