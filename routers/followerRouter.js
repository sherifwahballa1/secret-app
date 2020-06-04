const express = require('express');
const authController = require('../controllers/authController');
const followerController = require('../controllers/followerController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, followerController.addFollower)
  .get(authController.protect, followerController.getAllIfollow);

router
  .route('/unfollow')
  .post(authController.protect, followerController.unfollow);

module.exports = router;
