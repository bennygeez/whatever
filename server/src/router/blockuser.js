const express = require('express');
const blockUserController = require('../controllers/blockUserController');
const router = express.Router();

router.route('/blockuser').post(blockUserController);

module.exports = router;
