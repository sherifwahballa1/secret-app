const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const patternRegexPhone = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/g;

const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      trim: true,
      required: [true, 'Please enter your first name'],
      minlength: 4
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Please enter your last name'],
      minlength: 3
    },
    phone: {
      type: String,
      match: patternRegexPhone,
      unique: true,
      trim: true,
      required: [true, 'Please enter your Phone number']
    },
    email: {
      type: String,
      required: [true, 'Please Enter your email'],
      trim: true,
      unique: true,
      validate: [validator.isEmail, 'Please Enter Valid Email']
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    location: {
      type: String,
      default: 'Egypt'
    },
    coverPhoto: {
      type: String,
      default: 'defaultCover.jpg'
    },
    bio: {
      type: String,
      default: 'Your Bio!'
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male'
    },
    password: {
      type: String,
      required: [true, 'Please Enter Your Password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please Confirm Your Password'],
      validate: {
        //this only works on create and save()
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same'
      }
    },
    birthdate: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExprires: Date,
    facebook: {
      type: String,
      default: ''
    },
    fbToken: Array,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate
userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'user',
  localField: '_id'
});

userSchema.pre('save', async function(next) {
  //Only run if password was actually modified
  if (!this.isModified('password')) return next();

  //hash password to cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex'); //create token with bulid in model crybto

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
