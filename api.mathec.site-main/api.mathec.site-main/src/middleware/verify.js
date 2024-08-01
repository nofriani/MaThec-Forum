const isLogin = (req, res, next) => {
  if (req.session.admin == null || req.session.admin == undefined) {
    req.flash('alertMessage', `You can't access dashboard before login, So please login first`);
    req.flash('alertStatus', 'danger');
    res.redirect('/auth/login');
  } else {
    next();
    return;
  }
};

module.exports = isLogin;
