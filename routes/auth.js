const express = require('express');
const router = express.Router();

const auth = require('../middleware/token');

const authControl = require('../controllers/auth');

router.post("/signup", authControl.signup);
router.post("/login", authControl.login);
router.post('/token', auth, authControl.token)

module.exports = router;