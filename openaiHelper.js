// const { sendMessage } = require('./chatbotResponse3');
const { sendMessage } = require('./ChatBotResponses/chatbotResponse3');

const processMessage = async ({prompt,session_id} ) => {
  try {
      // console.log("Received: id middle " + session_id);
      console.log("Received: prompt middle " + prompt);
      const response = await sendMessage({prompt, session_id});

    return response;
  } catch (error) {
      console.error('Error processing message:', error);
      return null;
  }
};

module.exports = { processMessage };