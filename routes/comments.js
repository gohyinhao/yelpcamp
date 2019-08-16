const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (error, campground) => {
    if (error) {
      console.error(error);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (error, campground) => {
    if (error) {
      console.error(error);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (error, comment) => {
        if (error) {
          req.flash('error', 'Something went wrong');
          console.error(error);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash('success', 'Successfully added comment');
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

router.get('/:commentId/edit', middleware.checkCommentOwnership, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    res.render('comments/edit', { campgroundId: req.params.id, comment });
  } catch (error) {
    res.redirect('back');
  }
});

router.put('/:commentId', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, { useFindAndModify: false }, (error, comment) => {
    if (error) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

router.delete('/:commentId', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.commentId, { useFindAndModify: false }, (error) => {
    if (error) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted!');
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
})

module.exports = router;
