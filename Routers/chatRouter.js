
const express = require('express');
const chatRouter = express.Router();
const { processMessage } = require('../Controllers/openaiHelper');
const { v4: uuidv4 } = require('uuid');

let session_id;
chatRouter.post('/', async (req, res) => {
    const prompt = req.body.message;

    if (!prompt) {
        return res.status(400).send('Bad Request: message field is required.');
    }
    if (!session_id) {
        session_id = uuidv4();
    }
    try {
        const responseMessage = await processMessage({prompt , session_id});
        res.status(200).json(responseMessage);  
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = chatRouter;
