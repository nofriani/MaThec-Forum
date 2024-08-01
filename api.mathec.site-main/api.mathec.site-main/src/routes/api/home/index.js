const express = require('express');
const router = express.Router();
const HomeController = require('@controllers/HomeController');

router.get('/search/:search', HomeController.searchAll);
router.get('/:keyword', HomeController.getAll);
router.get('/:from/:to', HomeController.getMonth);

module.exports = router;
