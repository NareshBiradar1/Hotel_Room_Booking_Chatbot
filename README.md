## [Link To Telegram chatbot](t.me/dukaan_chatbot_bot) :- t.me/dukaan_chatbot_bot

# bot9 Palace Chatbot

## Overview

A backend service and basic frontend for a chatbot designed for Bot9 Palace, a luxury hotel booking service. This project integrates with OpenAI's API for natural language processing and provides simulated room booking functionalities.

## Features

- **Backend Service:**
  - Provides a RESTful API endpoint `/chat` to handle user messages and provide responses based on natural language processing.
  - Implements simulated room booking functionalities using Sequelize and SQLite for data storage.
  - Integrates with OpenAI's API for natural language understanding.

- **Frontend (Future Implementation):**
  - Planned frontend in React to allow users to interact with the chatbot seamlessly.
  - Designed to display messages and responses in real-time.

## Setup Instructions

To set up and run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd bot9-palace-chatbot

2. Install dependencies:

```bash
npm install
```
3. Set up environment variables:

- Create a .env file based on .env.example and configure necessary environment variables (e.g., API keys, database credentials).
4. Run the server:
```bash
npm start
```
- This will start the backend server at http://localhost:3000.

## Testing

You can test this project in two ways:

### Using the Telegram Chatbot:

Visit the [Telegram chatbot](t.me/dukaan_chatbot_bot) link provided and start using the bot directly.

### Running Locally with Postman:

1. Download this repository.
2. Change the credentials of API keys with your own in the `.env` file.
3. Run the server locally using:

   ```bash
   node server.js
   ```
4. Test it in Postman by creating POST requests to the /chat endpoint with a JSON body containing a message.


This Markdown format provides clear steps for testing the bot9 Palace Chatbot project using both Telegram and Postman methods. Adjust any placeholders or details as per your project's actual setup.


