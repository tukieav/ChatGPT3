const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./middlewares');
const { getGpt3Response } = require('./gpt3Controller');

router.get('/api/user', ensureAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.get('/user', ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});
router.post('/api/gpt3', ensureAuthenticated, async (req, res) => {
  try {
    const output = await getGpt3Response(req.body.input, req.body.context);
    res.status(200).json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;