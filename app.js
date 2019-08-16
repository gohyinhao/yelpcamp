// =============================
// APP SETUP
// =============================
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const app = express();

const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

const seedDB = require('./seeds');
// seedDB();

// mongoose.connect('mongodb://localhost:27017/yelpCampDB', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://admin:password123%21%40%23@gettingstarted-df6bi.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
.then(() => {
  console.log('DB Connected!');
}).catch(error => {
  console.log('ERROR:', error.message);
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');

// =============================
// PASSPORT CONFIG
// =============================
app.use(require('express-session')({
  secret: 'Anything is fine for this string',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =============================
// MIDDLEWARE
// =============================
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log('Server has started'));