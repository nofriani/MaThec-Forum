const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const verify = require('./../../middleware/verify');
const { QuestionAnswer, Question, User, LinkertScore, Report, Profile } = require('@models');

router.use(verify);
router.get('/', async (req, res) => {
  try {
    const [questionsCount, answersCount, usersCount, linkertscore, notifications] = await Promise.all([
      Question.count(),
      QuestionAnswer.count(),
      User.count(),
      LinkertScore.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'total']],
        group: ['id_user'],
      }),
      Report.findAll({
        where: {
          read: false,
        },
        include: [
          {
            model: User,
            as: 'pelapor',
            paranoid: false,
            include: [
              {
                model: Profile,
                as: 'Profile',
              },
            ],
          },
        ],
      }),
    ]);

    const userFilled = linkertscore.length;

    return res.render('notification', {
      title: 'Mathec | Dashboard',
      page_name: 'dashboard',
      admin: req.session.admin,
      data: {
        questions: questionsCount,
        answers: answersCount,
        users: usersCount,
        kuisioners: (userFilled / usersCount) * 100,
      },
      notifications: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

module.exports = router;
