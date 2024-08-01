const Admin = require('@models').Admin;
const bcrypt = require('bcrypt');
class AdminController {
  static async loginView(req, res, next) {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.admin == null || req.session.admin == undefined) {
        res.render('auth/login', { title: 'Mathec | Login', alert });
      } else {
        res.redirect('/');
      }
    } catch (error) {
      // console.log(error);
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/auth/login');
    }
  }
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({
        where: { email },
      });
      // console.log(admin);
      if (!admin) {
        req.flash('alertMessage', 'User not found');
        req.flash('alertStatus', 'danger');
        res.redirect('/auth/login');
      }
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        req.flash('alertMessage', 'Password inccorect');
        req.flash('alertStatus', 'danger');
        res.redirect('/auth/login');
      }

      req.session.admin = {
        id: admin.id,
        email: admin.email,
      };
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }

  static async logout(req, res, next) {
    req.session.destroy();
    res.clearCookie('secretSession');
    res.redirect('/auth/login');
  }
}

module.exports = AdminController;
