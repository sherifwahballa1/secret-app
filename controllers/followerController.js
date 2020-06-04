const Follower = require('../models/followerModel');
const catchAsync = require('./../utils/catchAsync');

exports.isFollowThisUser = catchAsync(async (req, res, next) => {
  const f = await Follower.findOne({ ownerId: req.user.id });
  if (f) {
    if (f.isFollower === true) {
      res.status(200).json({
        status: 'fail',
        message: 'you follow this user'
      });
    } else {
      res.status(200).json({
        status: 'success',
        f
      });
    }
  }
});

exports.addFollower = catchAsync(async (req, res, next) => {
  const doc = {
    ownerId: req.user.id,
    followerId: req.body.followerId,
    isFollower: req.body.isFollower
  };
  const newDoc = await Follower.create(doc); //return promise like save
  res.status(201).json({
    status: 'Success',
    data: {
      date: newDoc
    }
  });
});

exports.getAllIfollow = catchAsync(async (req, res, next) => {
  const allIfollow = await Follower.find({
    ownerId: req.user.id,
    isFollower: { $ne: false }
  });
  res.status(200).json({
    status: 'success',
    allIfollow
  });
});

exports.unfollow = catchAsync(async (req, res, next) => {
  const ifFollow = await Follower.findOne({
    ownerId: req.user.id,
    followerId: { $eq: req.body.followerId }
  });
  if (!ifFollow) {
    const newFollow = {
      ownerId: req.user.id,
      followerId: req.body.followerId,
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
        { ownerId: req.user.id, followerId: req.body.followerId },
        newFollowUpdate,
        {
          runValidators: true,
          new: true
        }
      );
      res.status(200).json({
        status: 'success unfollow',
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
          followerId: req.body.followerId
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

// exports.unfollow = catchAsync(async (req, res, next) => {
//     const ifFollow = await Follower.findOne({
//       ownerId: req.user.id,
//       followerId: { $eq: req.body.followerId }
//     });
//     if (ifFollow.length === 0 || !ifFollow) {
//       const newFollow = {
//         ownerId: req.user.id,
//         followerId: req.body.followerId,
//         isFollower: true
//       };
  
//       const newFollowM = await Follower.create(newFollow);
//       res.status(200).json({
//         status: 'success',
//         message: 'you follow new user',
//         newFollowM
//       });
//     } else {
//       const m ='';
//       if (ifFollow.isFollower === true) {
//         const newFollowUpdate = {
//           isFollower: false
//         };
//         const newFollowUpdateM = await Follower.findOneAndUpdate(
//           { ownerId: req.user.id, followerId: req.body.followerId },
//           newFollowUpdate,
//           {
//             runValidators: true,
//             new: true
//           }
//         );
//         res.status(200).json({
//           status: 'success',
//           message: 'you unfollow this user',
//           newFollowUpdateM
//         });
//       } else if (ifFollow.isFollower === false) {
//         const newFollowUpdate = {
//           isFollower: true
//         };
//         const newFollowUpdateM = await Follower.findOneAndUpdate(
//           {
//             ownerId: req.user.id,
//             followerId: req.body.followerId
//           },
//           newFollowUpdate,
//           {
//             runValidators: true,
//             new: true
//           }
//         );
//         res.status(200).json({
//           status: 'success',
//           message: 'you follow this user',
//           newFollowUpdateM
//         });
//       }
//     }
//   });
  
