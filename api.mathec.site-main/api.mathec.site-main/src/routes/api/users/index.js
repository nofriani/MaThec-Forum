const express = require('express');
const router = express.Router();
const UserController = require('../../../controllers/UserController');
const { upload } = require('../../../middleware/upload');
const User = require('@models').User;
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Ganti dengan layanan email yang sesuai
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'testandri66@gmail.com',
    pass: 'AndriTest019082',
  },
});

router.get('/:keyword', UserController.getAllUser);
router.get('/userinfo/:id', UserController.getUserById);
router.post('/check-follow', UserController.checkFollowed);
router.post('/follow', UserController.followUserByID);
router.post('/change-password', async (req, res) => {
  const { email, password } = req.body;
  convertPass = await bcrypt.hash(password, 10);
  const user = await User.update(
    {
      password: convertPass,
    },
    {
      where: {
        email,
      },
    }
  );

  res.status(200).json({
    message: 'berhasil dirubah',
  });
});
router.put(
  '/:id',
  function (req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      next();
    });
  },
  UserController.editProfile
);
const resetTokens = [];
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  // Generate token unik
  const token = crypto.randomBytes(20).toString('hex');
  resetTokens.push({ email, token });

  // Kirim email dengan tautan reset password
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Reset Password',
    text: `Klik tautan ini untuk mereset password: http://localhost:4000/reset/${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.status(201).json({
    message: 'Email reset password telah dikirim. Silakan periksa kotak masuk Anda.',
  });
});
module.exports = router;
