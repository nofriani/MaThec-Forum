const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const verify = require('./../../middleware/verify');
const { Report, User, Profile } = require('@models');

router.use(verify);
router.get('/', async (req, res) => {
  const [notifications, userReport] = await Promise.all([
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
    Report.findAll({
      include: [
        {
          model: User,
          as: 'pelapor',
          paranoid: false,
          attributes: ['name'],
        },
        {
          model: User,
          as: 'terlapor',
          attributes: ['id', 'name', 'deleted_at'],
          paranoid: false,
        },
      ],
      where: {
        terlapor_id: {
          [Op.not]: null,
        },
      },
    }),
  ]);
  await Report.update(
    {
      read: true,
    },
    {
      where: {
        terlapor_id: {
          [Op.not]: null,
        },
        read: false,
      },
    }
  );
  const nama = 'Pengguna';

  res.render('users', {
    nama,
    title: 'Mathec | Users',
    page_name: 'users',
    admin: req.session.admin,
    reports: userReport,
    notifications,
  });
});

router.get('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.update(
      {
        deleted_at: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );
    res.redirect('/users');
  } catch (error) {
    return res.render('error', {
      message: 'Terjadi Kesalahan',
      error: error,
    });
  }
});

module.exports = router;
