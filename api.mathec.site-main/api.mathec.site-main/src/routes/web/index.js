// packages
const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');

// routes
const dashboard = require('./dashboard');
const questions = require('./questions');
const answers = require('./answers');
const users = require('./users');
const kuisioner = require('./kuisioner');
const notification = require('./notification');
const login = require('./auth');

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: '4c1cab66c1693721a84e0f368f39aea67976280518ec9dba1f7619baba64f9b6097c46602bc933654fdc47e3f03d232396ba7aea06352144849469c4cde6b1c1',
    name: 'secretSession',
    cookie: {
      sameSite: true,
      maxAge: 1000000,
    },
  })
);

app.use(flash());

app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.setHeader('Pragma', 'no-cache');
  next();
});

app.use('/auth', login);
app.use('/', dashboard);
app.use('/questions', questions);
app.use('/answers', answers);
app.use('/users', users);
app.use('/kuisioner', kuisioner);
app.use('/notification', notification);

module.exports = app;
