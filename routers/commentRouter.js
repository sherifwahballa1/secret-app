const express = require('express');
const commentController = require('./../controllers/commentController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/last-comment')
  .get(authController.protect, commentController.getLastComment);

router
  .route('/')
  .get(authController.protect, commentController.getAllComments)
  .post(
    authController.protect,
    commentController.uploadCommentImage,
    commentController.resizeCommentImage,
    commentController.setCommentUserIds,
    commentController.checkInputs,
    commentController.createComment
  );

router
  .route('/:id')
  .get(authController.protect, commentController.getComment)
  .patch(
    authController.protect,
    commentController.uploadCommentImage,
    commentController.resizeCommentImage,
    commentController.checkWhoIsUserToUpdateOrDelete,
    commentController.updateComment
  )
  .delete(
    authController.protect,
    commentController.checkWhoIsUserToUpdateOrDelete,
    commentController.deleteComment
  );
module.exports = router;
