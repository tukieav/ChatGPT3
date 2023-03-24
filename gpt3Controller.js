const axios = require('axios');
const { OPENAI_API_KEY } = require('./config');

const generateResponse = async (req, res) => {
  const { input, context } = req.body;
  const prompt = `${context}\nUser: ${input}\nAI:`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: prompt,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const output = response.data.choices[0].text.trim();
    res.json({ output });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate GPT-3 response.' });
  }
};

module.exports = {
  generateResponse,
};