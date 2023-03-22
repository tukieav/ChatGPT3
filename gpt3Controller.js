require('dotenv').config();
const axios = require('axios');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT3_API_URL = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

const addContext = (context, userInput) => {
  return `${context}\nPytanie użytkownika: ${userInput}\nOdpowiedź modelu: `;
};

const generateResponse = async (userInput, context, temperature, top_p, frequency_penalty, presence_penalty, res) => {
  try {
    const prompt = addContext(context, userInput);
    console.log(prompt);

    const response = await axios.post(
      GPT3_API_URL,
      {
        prompt: prompt,
        max_tokens: 250,
        n: 1,
        stop: null,
        temperature: temperature,
        top_p: top_p,
        frequency_penalty: frequency_penalty,
        presence_penalty: presence_penalty,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const generatedText = response.data.choices[0].text.trim();
    res.json({ output: generatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating the GPT-3 response' });
  }
};

module.exports = {
  generateResponse,
};