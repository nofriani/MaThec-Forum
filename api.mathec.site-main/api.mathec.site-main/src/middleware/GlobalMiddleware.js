const User = require('@models').User;
const jwt = require('jsonwebtoken');
require('dotenv').config();

class GlobalMiddleware {
  static async check(req, res, next) {
    // Mendapatkan token dari header Authorization
    const authHeader = req.header('Authorization');

    // Periksa apakah token tersedia
    if (!authHeader) {
      return res.status(401).json({
        code: 400,
        success: false,
        message: 'Authorization header not found',
      });
    }

    // Periksa format header Authorization (Bearer <token>)
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        code: 400,
        success: false,
        message: 'Invalid Authorization header format',
      });
    }

    const token = tokenParts[1]; // Ambil token dari bagian kedua

    try {
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Menyimpan data pengguna yang terverifikasi ke objek request
      req.user = decoded;

      console.log(req.user);
      // Lanjutkan ke middleware atau penanganan rute berikutnya
      next();
    } catch (err) {
      // Tangani kesalahan validasi token
      return res.status(401).json({
        code: 401,
        success: false,
        message: 'Unauthorized',
      });
    }
  }
}

module.exports = GlobalMiddleware;
