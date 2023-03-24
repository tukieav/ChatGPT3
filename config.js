require('dotenv').config();

module.exports = {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY
};