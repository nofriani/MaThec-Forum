const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

//app.use(cors());

const auth = require('./authentication');
const questions = require('./questions');
const home = require('./home');
const tag = require('./tag');
const users = require('./users');
const save = require('./save');
const questioner = require('./questioner');
const report = require('./report');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', auth);
app.use('/api/home', home);
app.use('/api/tag', tag);
app.use('/api/users', users);
app.use('/api/save', save);
app.use('/api/questioner', questioner);
app.use('/api/reports', report);

// Questions route
app.use('/api/questions', questions);
app.use('/api/*', (req, res) => {
  return res.json({
    code: 404,
    success: false,
    message: 'The route is not found',
  });
});

module.exports = app;
