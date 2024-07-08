const { sendMessage } = require('../ChatBotResponses/chatbotResponse3');

const processMessage = async ({ prompt, session_id }) => {
  try {
    const response = await sendMessage({ prompt, session_id });

    return response;
  } catch (error) {
    console.error('Error processing message:', error);
    return null;
  }
};

module.exports = { processMessage };