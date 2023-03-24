const express = require('express');
const authController = require('./authController');
const gpt3Controller = require('./gpt3Controller');

const router = express.Router();

router.post('/gpt3', gpt3Controller.generateResponse);

module.exports = router;