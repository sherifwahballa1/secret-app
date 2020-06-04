const express = require('express');
const passport = require('passport');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/signup'
  })
);

router.get('/', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.isLoggedIn, viewsController.getSettingForm);
router.get(
  '/signup',
  authController.isLoggedIn,
  viewsController.getRegisterForm
);

router.get(
  '/post/:id',
  authController.isLoggedIn,
  viewsController.deletePost,
  viewsController.geAllMyPosts
);
router.get(
  '/home',
  authController.protect,
  authController.isLoggedIn,
  viewsController.geAllMyPosts
);
router.get(
  '/profile',
  authController.protect,
  authController.isLoggedIn,
  viewsController.getMyProfile
  //viewsController.getHomeForm
);

router.get(
  '/user/:id',
  authController.protect,
  authController.isLoggedIn,
  viewsController.getUserProfile
);

router.get(
  '/comments/:id',
  authController.protect,
  authController.isLoggedIn,
  viewsController.getCommentsPost
);

module.exports = router;
