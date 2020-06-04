const express = require('express');
const authController = require('../controllers/authController');
const likeController = require('../controllers/likeController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, likeController.likeUnlike)
  .get(authController.protect, likeController.getAllLikes);

module.exports = router;
