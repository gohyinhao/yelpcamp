const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObject = {};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that.');
  res.redirect('/login');
}

middlewareObject.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (error, campground) => {
      if (error) {
        req.flash('error', 'Database Error.');
        res.redirect('back');
      } else {
        if (!campground) {
          req.flash('error', 'Campground not found.');
          return res.redirect('back');
        }

        if (campground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have the permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('back');
  }
}

middlewareObject.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentId, (error, comment) => {
      if (error) {
        req.flash('error', 'Database Error.');
        res.redirect('back');
      } else {
        if (!comment) {
          req.flash('error', 'Comment not found.');
          return res.redirect('back');
        }

        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have the permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('back');
  }
}

module.exports = middlewareObject;