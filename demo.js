const function_descriptions = [
    {
        "name": "getAllRooms",
        "description": "Get the list of all available rooms",
    },
    {
        "name": "getPrice",
        "description": "get the price of a specific room which the user has given",
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
    },
    {
        "name" : "createBooking",
        "description" : "creates a booking of the room after user has given all the parameters",
        "parameters": {
            "type": "object",
            "properties": {
                "roomId":{
                    "type" : "Integer",
                    "description" : "Id of the room which user wants to book"
                },
                "fullName":{
                    "type" : "String",
                    "description" : "Name of the user"
                },
                "email":{
                    "type" : "String",
                    "description" : "Email of the user"
                },
                "nights":{
                    "type" : "Integer",
                    "description" : "Number of nights the user wants to book the room for"
                }
            },
            "required": ["roomId" , "fullName" , "email" , "nights"]
        }
    }
]