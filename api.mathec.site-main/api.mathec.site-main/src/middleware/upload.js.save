const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = 'src/image';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.');
    cb(null, Date.now() + '.' + ext[ext.length - 1]);
  },
});

const storageBukti = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = 'src/image/buktireport';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.');
    cb(null, Date.now() + '.' + ext[ext.length - 1]);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);

    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > 5000000) {
      return cb('File tidak boleh lebih dari 3mb');
    }
  },
}).single('file');

const uploadBukti = multer({
  storage: storageBukti,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);

    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > 5000000) {
      return cb('File tidak boleh lebih dari 3mb');
    }
  },
}).single('file');

// // Check file Type
function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    return cb('Error: Images Only !!!');
  }
}

module.exports = { upload, uploadBukti };
