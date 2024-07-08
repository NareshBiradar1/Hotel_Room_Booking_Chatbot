// models/Conversation.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../DataBase/database.js');

class Conversation extends Model {};
Conversation.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    role: {
        type: DataTypes.ENUM('user', 'assistant', 'system', 'tool'),
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    sessionID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Conversation',
    timestamps: true,
});
// })
// const Conversation = sequelize.define('Conversation', {
//     id: {
//         type: DataTypes.UUID,
//         primaryKey: true,
//         allowNull: false,
//         defaultValue: DataTypes.UUIDV4,
//     },
//     role: {
//         type: DataTypes.ENUM('user', 'assistant', 'system', 'tool'),
//         allowNull: false,
//     },
//     message: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     datetime: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//     },
//     sessionID: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
// });

module.exports = Conversation;
