const express = require('express');
const router = express.Router();
const SaveController = require('../../../controllers/SaveController');

router.get('/:id/:order', SaveController.saveById);

module.exports = router;
