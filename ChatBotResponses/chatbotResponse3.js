const axios = require('axios');
require('dotenv').config();

const retrieveMessages = require('../DataBaseServices/retrieveMessages');
const storeMessage = require('../DataBaseServices/storeMessage');
const sequelize = require('../DataBase/database');

const apiKey = process.env.OPENAI_API_KEY;

async function sendMessage({ prompt, session_id }) {

    let messages = [
        {
            role: 'system', content: `You are a chatbot for HotelHelperBot , a hotel booking service. Your primary functions are to fetch room details and book rooms for guests. You can access room details using the getRoomOptions function and book rooms using the bookRoom function. Here's how you should handle user interactions:
    
        Fetch Room Details: When a user asks for all available rooms, call the getRoomOptions function to fetch and display the details of available rooms.
        
        Collect Booking Information: To book a room, you need to collect the following information from the user:
        
        Full name
        Email address
        Number of nights
        Type of room (as provided by the getRoomOptions function)
        Ask for these details one by one, ensuring you gather all the required information.
        
        Confirm Booking Details: Once you have collected all necessary information, confirm the booking details with the user. Display the full name, email, number of nights, and the type of room they want to book and also display the total cost of their booking . Ask the user to confirm the booking details.
        
        Handle Ambiguity: If any information provided by the user is ambiguous or unclear, ask the user again for clarification. Do not make any assumptions or generate new data.
        
        Make the Booking: If the user confirms the booking details, call the bookRoom function with the following parameters:
        
        Full name
        Email address
        Number of nights
        Room ID (from the getRoomOptions function corresponding to the type of room)
        Booking Confirmation: If the booking is successful, show the user the booking ID and thank them for booking with HotelHelperBot and give them a thankful message for booking with us and wish them for great stay.
        
        Important Notes:
        
        Do not call the bookRoom function until you have all the required information.
        Ensure you pass the room ID (not the room name) when calling the bookRoom function.
        Do not generate any new data or make assumptions about missing details.
        Do not use any formatted stylings such as bold, italics, bullet points, numbered lists, or code blocks in your responses.
        Send plain text responses only.
        The arguments for the functions are JSON encoded. Make sure to encode the parameters correctly.
        The getRoomOptions function does not book a room; it only fetches and displays the available room options.
        The bookRoom function books a room for a guest based on the provided details.
        When you are generating arguments for the bookRoom function, ensure you pass the room ID (not the room name) as the parameter, and pass the name, email, and number of nights according to the details provided by the user. It should not be a placeholder.
        
        Example Workflow:
        
        User: "What rooms are available?"
        Chatbot: [Fetches and displays room options using getRoomOptions]
        User: "I want to book a Deluxe Room."
        Chatbot: "Please provide your full name."
        User: "John Doe"
        Chatbot: "Please provide your email address."
        User: "john.doe@example.com"
        Chatbot: "How many nights would you like to stay?"
        User: "3"
        Chatbot: "Please confirm your booking: Deluxe Room, 3 nights, John Doe, john.doe@example.com. Do you confirm?"
        User: "Yes"
        Chatbot: [Calls bookRoom function with collected details and displays booking ID]
        
        Example Workflow 2:
        
        User: "What rooms are available?"
        Chatbot: [Fetches and displays room options using getRoomOptions]
        User: "I want to book a Suite Room."
        Chatbot: "Please provide your full name."
        User: "Abcd"
        Chatbot: "Please provide your email address."
        User: "abcd@example.com"
        Chatbot: "How many nights would you like to stay?"
        User: "5"
        Chatbot: "Please confirm your booking: Suite Room, 2 nights, Abcd, abcd@example.com. Do you confirm?"
        User: "Yes"
        Chatbot: [Calls bookRoom function with collected details and displays booking ID]
        
        This way, you will efficiently manage room bookings at Bot9Palace, ensuring all necessary information is accurately collected and processed.
        
        Additional Requirement:
    
        Ask for confirmation only once when the user provides all information. If the user confirms, proceed to book the room and return booking details.
        ` }
    ];
    const url = 'https://api.openai.com/v1/chat/completions';

    await storeMessage(session_id, 'user', JSON.stringify({ role : 'user' , content : prompt}));

    const previousMessages = await retrieveMessages(session_id);
    messages = [ ...messages, ...previousMessages];

    console.log("Previous Messages:-- " + JSON.stringify(messages, null, 2));

    const data = {
        model: 'gpt-3.5-turbo',
        messages,
        tools,
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const responseMessage = response.data.choices[0].message;
        

        console.log("Response (send  message ) 1st Message:-- " + JSON.stringify(responseMessage, null, 2));

        const toolCalls = responseMessage.tool_calls;

        // messages.push(responseMessage);
        
        // storeMessage(session_id, 'assistant', responseMessage.content);

        if (toolCalls) {
            const availableFunctions = {
                getAllRooms,
                getPrice,
                createBooking
            };

            // console.log("Tool Calls:-- " + JSON.stringify(toolCalls, null, 2))
            messages = [...messages, responseMessage];
            const jsonResponseMessage = JSON.stringify(responseMessage);
            await storeMessage(session_id, 'assistant', jsonResponseMessage);
            // console.log(jsonResponseMessage);
            // console.log(typeof(jsonResponseMessage));
            // messages.push(session_id, 'assistant', jsonResponseMessage);

            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionToCall = availableFunctions[functionName];
                const functionArgs = JSON.parse(toolCall.function.arguments);
                const functionResponse = await functionToCall(functionArgs);

                const tool_call_response = ({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: JSON.stringify(functionResponse),
                });

                messages.push(tool_call_response);

                // console.log("Function ( tool call ) Response:-- " + JSON.stringify(tool_call_response, null, 2));

                await storeMessage(session_id, 'tool', JSON.stringify(tool_call_response));

                // Check for missing parameters and prompt the user
                if (functionResponse.missingParams) {
                    for (const prompt of functionResponse.prompts) {
                        messages.push({ role: 'assistant', content: prompt });
                        await storeMessage(session_id, 'assistant', JSON.stringify({role : 'assistant', content : prompt}));
                    }

                    // Re-send message with updated messages to gather missing info
                    return await sendMessage({ prompt: '', messages });
                }
            }

            const tempData = {
                model: 'gpt-3.5-turbo',
                messages
            };
            const secondResponse = await axios.post(url, tempData, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const finalResponse =  secondResponse.data.choices[0].message.content;
            await storeMessage(session_id, 'assistant', JSON.stringify({role : 'assistant', content : finalResponse})); 
            return finalResponse;
        } else {
            const finalResponse = response.data.choices[0].message.content;
            await storeMessage(session_id, 'assistant', JSON.stringify({role : 'assistant', content : finalResponse})); 
            return finalResponse;
        }
    } catch (error) {
        console.log(messages)
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

const tools = [
    {
        "name": "getAllRooms",
        "description": "Get the available room options. This function returns a list of rooms that are available to book. You can get all the information of the rooms from this function.",
        "type": "function",
        "function": {
            "name": "getAllRooms",
            "parameters": {}
        }
    },
    {
        "name": "getPrice",
        "description": "Get the price of a specific room. This function returns the price of the room.",
        "type": "function",
        "function": {
            "name": "getPrice",
            "parameters": {
                "type": "object",
                "properties": {
                    "roomName": {
                        "type": "string",
                        "description": "the name of the specific room"
                    }
                },
                "required": ["roomName"]
            }
        }
    },
    {
        "name": "createBooking",
        "description": "Book a room for a guest. This function books a room for a guest. You need to provide the room ID, guest's full name, email, and the number of nights to book the room for. The function returns the booking confirmation details. The parameters must be JSON encoded. Ask for the information you need from the user before calling this function. Don't create anything by yourself. Ask for every parameter from the user until it is provided.",
        "type": "function",
        "function": {
            "name": "createBooking",
            "parameters": {
                "type": "object",
                "properties": {
                    "roomId": {
                        "type": "integer",
                        "description": "Id of the room which user wants to book"
                    },
                    "fullName": {
                        "type": "string",
                        "description": "Name of the user"
                    },
                    "email": {
                        "type": "string",
                        "description": "Email of the user"
                    },
                    "nights": {
                        "type": "integer",
                        "description": "Number of nights the user wants to book the room for"
                    }
                },
                "required": ["roomId", "fullName", "email", "nights"]
            }
        }
    }
];

const processMessage = async (message, session_id) => {
    try {
        const response = await sendMessage(message, session_id);
        let messages = message.messages;

        if (response && response[0].tool_calls) {
            for (const toolCall of response[0].tool_calls) {
                const { name, content } = toolCall;
                const functionResponse = JSON.parse(content);

                console.log("Function ( process Message ) Response:-- " + functionResponse);

                if (functionResponse.missingParams) {
                    for (const prompt of functionResponse.prompts) {
                        messages.push({ role: 'assistant', content: prompt });
                        storeMessage(session_id, 'assistant', prompt);
                    }
                } else {
                    messages.push({ role: 'assistant', content: `Booking confirmed: ${JSON.stringify(functionResponse)}` });
                    storeMessage(session_id, 'assistant', `Booking confirmed: ${JSON.stringify(functionResponse)}`);
                }
            }
        }

        return messages;
    } catch (error) {
        console.error('Error processing message:', error);
        return null;
    }
};

async function getAllRooms() {
    try {
        const response = await axios.get('https://bot9assignement.deno.dev/rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
}

async function createBooking(args) {
    const requiredParams = ['roomId', 'fullName', 'email', 'nights'];
    const missingParams = requiredParams.filter(param => !args[param]);

    if (missingParams.length > 0) {
        const prompts = missingParams.map(param => `Please provide your ${param}:`);
        return { missingParams, prompts };
    }

    const bookingData = {
        roomId: args.roomId,
        fullName: args.fullName,
        email: args.email,
        nights: args.nights
    };

    try {
        const response = await axios.post('https://bot9assignement.deno.dev/book', bookingData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

async function getPrice({ roomName }) {
    const url = 'https://bot9assignement.deno.dev/rooms';

    try {
        const response = await axios.get(url);
        const rooms = response.data;

        const room = rooms.find(room => room.name.toLowerCase() === roomName.toLowerCase());

        if (room) {
            return room.price;
        } else {
            throw new Error(`Room '${roomName}' not found.`);
        }
    } catch (error) {
        console.error('Error fetching room data:', error);
        throw error;
    }
}

module.exports = { sendMessage };
