const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
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

//exports.uploadUserPhoto = upload.single('photo');
exports.uploadUserPhotos = upload.fields([{
    name: 'photo',
    maxCount: 1
  },
  {
    name: 'coverPhoto',
    maxCount: 1
  }
]);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  // if (!req.files.photo || !req.files.coverPhoto) {
  //   return next();
  // }
  if (req.files.photo && !req.files.coverPhoto) {
    req.body.photo = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.files.photo[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({
        quality: 90
      })
      .toFile(`public/img/usersPhoto/${req.body.photo}`);
  } else if (!req.files.photo && req.files.coverPhoto) {
    req.body.coverPhoto = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.files.coverPhoto[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({
        quality: 90
      })
      .toFile(`public/img/usersCover/${req.body.coverPhoto}`);
  } else if (req.files.photo && req.files.coverPhoto) {
    req.body.photo = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.files.photo[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({
        quality: 90
      })
      .toFile(`public/img/usersPhoto/${req.body.photo}`);

    req.body.coverPhoto = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.files.coverPhoto[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({
        quality: 90
      })
      .toFile(`public/img/usersCover/${req.body.coverPhoto}`);
  } else {
    return next();
  }

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1)Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    const err = new Error(
      'This route is not for update password please use /updatePassword.'
    );
    err.statusCode = 400;
    err.status = 'fail';
    next(err);
  }

  //2) filter out unwanted fields name that are not allowed to update
  //update only name or email
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'phone',
    'email',
    'bio',
    'location'
  );
  if (req.files.photo) {
    filteredBody.photo = req.body.photo;
  }
  if (req.files.coverPhoto) {
    filteredBody.coverPhoto = req.body.coverPhoto;
  }
  //if (req.file) filteredBody.coverPhoto = req.file.coverPhoto;
  //3)update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined please use /signup insatead'
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
