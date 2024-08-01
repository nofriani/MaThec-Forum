const express = require('express');
const router = express.Router();
const QuestionerController = require('../../../controllers/QuestionerController');

// get all
router.get('/', QuestionerController.getAllQuestioner);

// body => { id_user, id_questioner, score }
router.post('/', QuestionerController.answerQuestioner);

// user pernah ngisi questioner
router.get('/check/:id', QuestionerController.checkRespondenLinkert);

module.exports = router;
