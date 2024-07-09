const express = require('express');
const bodyParser = require('body-parser');
const chatRouter = require('./Routers/chatRouter');
const sequelize = require('./DataBase/database');


const app = express();
const port = 3005;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the chatRouter for /chat routes
app.use('/chat', chatRouter);

const startServer = async () => {
    try {
        await sequelize.sync({force: true});
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Unable to start the server:', error);
    }
};

startServer();

