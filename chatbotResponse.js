const axios = require('axios');
require('dotenv').config();


// Replace with your OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;

async function sendMessage2(prompt){

}

async function sendMessage(prompt) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        model: 'gpt-4', // or 'gpt-4-turbo'
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
        ]
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const message = response.data.choices[0].message.content;
        console.log('Response:', message);
        return message;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}


const processMessage = async (message) => {
    try {
        const response = await sendMessage(message);
        console.log("Received: " + response);
        return response;
    } catch (error) {
        console.error('Error processing message:', error);
        return null;
    }
};

async function getListOfRooms() {
    try {
        const response = await axios.get('https://bot9assignement.deno.dev/rooms');
        return response.data; // Assuming the response is JSON array of room objects
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error; // Handle error appropriately in your application
    }
}

async function createBooking(roomId, fullName, email, nights) {
    const bookingData = {
        roomId: roomId,
        fullName: fullName,
        email: email,
        nights: nights
    };

    try {
        const response = await axios.post('https://bot9assignement.deno.dev/book', bookingData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.bookingId; // Assuming the response returns a booking ID
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error; // Handle error appropriately in your application
    }
}


module.exports = { processMessage };