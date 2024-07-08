const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../DataBase/database');
const ConversationModel = require('../Models/Conversation');

const retrieveMessages = async (sessionID) => {
    try {
        const messages = await ConversationModel.findAll({
            where: { sessionID },
            order: [['datetime', 'ASC']],
        });

        const filteredMessages = messages.map((message) => {
            let content;
            try {
                content = JSON.parse(message.message);
            } catch (error) {
                // If JSON parsing fails, assume the message is a plain string
                // content = message.message;
            }
            return content;
        });

        console.log("messages: ", filteredMessages);
        return filteredMessages;
    } catch (error) {
        console.error('Error retrieving messages:', error);
    }
};

module.exports = retrieveMessages;

// Example usage:
// (async () => {
//   const messages = await retrieveMessages('some-session-id');
//   console.log(messages);
// })();
