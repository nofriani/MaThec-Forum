const path = require('path');
const express = require('express');
const app = express();
require('module-alias/register');
const routes = require('./src/routes/api');
const web = require('./src/routes/web');
const ejs = require('ejs');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set('view engine', 'ejs');
app.use('/src/image', express.static(path.join(__dirname, 'src', 'image')));
app.use('/public/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/src/buktireport', express.static(path.join(__dirname, 'src', 'image', 'buktireport')));
app.use('/src/avatarprofiles', express.static(path.join(__dirname, 'src', 'avatarprofiles')));

app.use(routes);
app.use(web);

// Start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
