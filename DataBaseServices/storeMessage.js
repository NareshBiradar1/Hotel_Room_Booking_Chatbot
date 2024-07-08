// storeMessage.js
const { v4: uuidv4 } = require('uuid');
const ConversationModel = require('../Models/Conversation');

const storeMessage = async (sessionID, role, message) => {
  try {
    const newMessage = await ConversationModel.create({
      role : role,
      message : message,
      sessionID : sessionID,
    });
    console.log("new message id " + newMessage.id);
  } catch (error) {
    console.log('Error storing message:', error);
  }
};

module.exports = storeMessage;

// Example usage:
// (async () => {
//   const newMessage = await storeMessage('assistant', 'Sure, how can I help you?', 'some-session-id');
//   console.log(newMessage);
// })();
