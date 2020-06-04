const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('../controllers/authController');
const commentRouter = require('./commentRouter');

const router = express.Router();

router.use('/:postId/comments', commentRouter);

router
  .route('/last-post')
  .get(authController.protect, postController.getLastPost);

router
  .route('/')
  .get(authController.protect, postController.getAllPosts)
  .post(
    authController.protect,
    postController.uploadPostImage,
    postController.resizePostImage,
    postController.setPostUserId,
    postController.checkInputs,
    postController.createPost
  );

router
  .route('/:id')
  .get(authController.protect, postController.getPost)
  .patch(
    authController.protect,
    postController.uploadPostImage,
    postController.resizePostImage,
    postController.checkWhoIsUserToUpdateOrDelete,
    postController.updatePost
  )
  .delete(
    authController.protect,
    postController.checkWhoIsUserToUpdateOrDelete,
    postController.deletePost
  );
module.exports = router;
