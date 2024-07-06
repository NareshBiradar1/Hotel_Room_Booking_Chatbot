// models/Conversation.js

module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define('Conversation', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'assistant', 'system'),
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  
    return Conversation;
  };
  