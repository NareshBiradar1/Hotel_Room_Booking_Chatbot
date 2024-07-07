const express = require('express');
const bodyParser = require('body-parser');
const chatRouter = require('./chatRouter');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./DataBase/database');
const ConversationModel = require('./Models/Conversation')(sequelize, DataTypes);

const app = express();
const port = 3005;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the chatRouter for /chat routes
app.use('/chat', chatRouter);

await sequelize.sync();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
