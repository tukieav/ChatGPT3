const axios = require('axios');
const { openaiApiKey, openAiModel } = require('./config');

const generateResponse = async (req, res) => {
  const { input, context } = req.body;
  const prompt = `${context}\nUser: ${input}\nAI:`;

  try {
    const response = await axios.post(
      openAiModel,
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
          'Authorization': `Bearer ${openaiApiKey}`,
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