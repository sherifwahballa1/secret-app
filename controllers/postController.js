const multer = require('multer');
const sharp = require('sharp');
const Post = require('../models/postModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const multerStroage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    const err = new Error('Not an image! please upload only images.');
    err.statusCode = 400;
    err.status = 'fail';
    cb(err, false);
  }
};

const upload = multer({
  storage: multerStroage,
  fileFilter: multerFilter
});

exports.uploadPostImage = upload.fields([
  {
    name: 'postImg',
    maxCount: 1
  }
]);

exports.resizePostImage = catchAsync(async (req, res, next) => {
  if (!req.files.postImg) return next();

  //1)Cover Image
  const imagePostFilename = `post-${req.user.id}-${Date.now()}-image.jpeg`;
  await sharp(req.files.postImg[0].buffer)
    .resize(1600, 1400)
    .toFormat('jpeg')
    .jpeg({
      quality: 90
    })
    .toFile(`public/img/posts/${imagePostFilename}`);

  req.body.postImg = imagePostFilename;

  next();
});

exports.setPostUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createPost = factory.createOne(Post);

exports.getAllPosts = factory.getAll(Post);

exports.getPost = factory.getOne(Post);

exports.updatePost = factory.updateOne(Post);

exports.deletePost = factory.deleteOne(Post);

exports.checkInputs = (req, res, next) => {
  if (!req.body.text && !req.body.postImg) {
    const err = new Error('not exist Data to post');
    err.statusCode = 401;
    err.status = 'fail';
    next(err);
  }
  next();
};

exports.checkWhoIsUserToUpdateOrDelete = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    user: {
      $eq: req.user.id
    },
    _id: req.params.id
  });
  if (!post) {
    const err = new Error("You haven't permission to Delete or Update this post");
    err.statusCode = 400;
    err.status = 'fail';
    next(err);
  }
  next();
});

exports.getLastPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    user: {
      $eq: req.user.id
    }
  })
    .sort({
      createdAt: -1
    })
    .limit(1);
  res.status(200).json({
    status: 'Success',
    results: '1',
    data: {
      data: post
    }
  });
});
