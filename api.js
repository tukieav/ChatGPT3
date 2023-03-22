const express = require('express');
const gpt3Controller = require('./gpt3Controller');

const router = express.Router();

router.post('/gpt3', (req, res) => {
  const { input, context, temperature, top_p, frequency_penalty, presence_penalty } = req.body;
  gpt3Controller.generateResponse(input, context, temperature, top_p, frequency_penalty, presence_penalty, res);
});

module.exports = router;