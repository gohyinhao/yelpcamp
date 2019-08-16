const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

router.get('/', (req, res) => {
  Campground.find({}, (error, campgrounds) => {
    if (error) {
      console.error(error);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

router.get('/new', middleware.isLoggedIn, (req, res) => res.render('campgrounds/new'));

router.post('/', middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = { name, price, image, description, author };
  Campground.create(newCampground, (error) => {
    if (error) {
      console.error(error);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((error, campground) => {
    if (error) {
      console.error(error);
    } else {
      res.render('campgrounds/show', { campground });
    }
  });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (error, campground) => {
    res.render('campgrounds/edit', { campground });
  });
});

router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, { useFindAndModify: false }, (error, campground) => {
    if (error) {
      res.redirect('/campgrounds');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  })
});

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (error, removedCampground) => {
    if (error) {
      res.redirect('/campgrounds');
    } else {
      Comment.deleteMany({ _id: { $in: removedCampground.comments } }, error => {
        if (error) {
          console.error(error);
        }
        res.redirect('/campgrounds');
      });
    }
  });
});

module.exports = router;
