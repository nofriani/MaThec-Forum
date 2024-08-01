const express = require('express');
const router = express.Router();
const ReportController = require('@controllers/ReportController');
const { uploadBukti, upload } = require('@middleware/upload');

router.post(
  '/',
  (req, res, next) => {
    uploadBukti(req, res, err => {
      if (err) {
        return res.status(400).json({
          message: err,
        });
      }
      next();
    });
  },
  ReportController.addReport
);

module.exports = router;
