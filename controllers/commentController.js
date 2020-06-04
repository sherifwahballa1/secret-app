const multer = require('multer');
const sharp = require('sharp');
const Comment = require('./../models/commentModel');
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

exports.uploadCommentImage = upload.fields([
  {
    name: 'commentImg',
    maxCount: 1
  }
]);

exports.resizeCommentImage = catchAsync(async (req, res, next) => {
  if (!req.files.commentImg) return next();

  //1)Cover Image
  const imageCommentFilename = `comment-${
    req.user.id
  }-${Date.now()}-image.jpeg`;
  await sharp(req.files.commentImg[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({
      quality: 90
    })
    .toFile(`public/img/comments/${imageCommentFilename}`);

  req.body.commentImg = imageCommentFilename;
  next();
});

exports.setCommentUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.createComment = factory.createOne(Comment);

exports.getAllComments = factory.getAll(Comment);

exports.getComment = factory.getOne(Comment, 'post');

exports.updateComment = factory.updateOne(Comment);

exports.deleteComment = factory.deleteOne(Comment);

exports.checkInputs = (req, res, next) => {
  if (!req.body.text && !req.body.commentImg) {
    const err = new Error('not exist Data to post');
    err.statusCode = 401;
    err.status = 'fail';
    next(err);
  }
  next();
};

exports.checkWhoIsUserToUpdateOrDelete = catchAsync(async (req, res, next) => {
  const comment = await Comment.findOne({
    user: {
      $eq: req.user.id
    },
    _id: req.params.id
  });
  if (!comment) {
    const err = new Error("You haven't permission to Delete or Update this Comment");
    err.statusCode = 400;
    err.status = 'fail';
    next(err);
  }
  next();
});

exports.getLastComment = catchAsync(async (req, res, next) => {
  const post = await Comment.findOne({
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
