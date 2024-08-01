const express = require('express');
const router = express.Router();
const TagController = require('@controllers/TagController');

router.get('/populer', TagController.populer);
router.get('/:name', TagController.TagByName);

module.exports = router;
