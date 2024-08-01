const express = require('express');
const router = express.Router();
const QuestionController = require('@controllers/QuestionController');
const GlobalMiddleware = require('../../../middleware/GlobalMiddleware');

router.post(
  '/',
  GlobalMiddleware.check,
  QuestionController.addQuestionByUserId
);
router.put('/:id', QuestionController.updateQuestionById);
router.post('/like', QuestionController.likeQuestionById);
router.post('/dislike', QuestionController.disLikeQuestionById);
router.post('/saved', QuestionController.savedQuestionById);
router.post('/detail/:id/:keyword', QuestionController.getQuestionById);
router.post('/answer', QuestionController.addQuestionAnswer);
router.get('/answer/:id', QuestionController.getAnswerById);
router.put('/answer/:id', QuestionController.updateAnswer);
router.delete('/answer/:id', QuestionController.deleteAnswer);
router.post('/answer-like', QuestionController.addLikeAnswer);
router.post('/answer-dislike', QuestionController.minusLikeAnswer);
router.get('/add-view/:id', QuestionController.addViewQuestions);
router.get('/delete/:id', QuestionController.deleteQuestion);

module.exports = router;
