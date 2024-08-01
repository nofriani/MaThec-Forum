const express = require("express");
const router = express.Router();
const AuthenticationController = require("@controllers/AuthenticationController");
router.post("/", AuthenticationController.auth);
router.post("/register", AuthenticationController.register);

module.exports = router;
