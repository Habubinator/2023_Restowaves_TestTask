const express = require("express");
require("dotenv").config();

// Set the server port to the provided environment variable or default to 5000
const PORT = process.env.SERVER_PORT || 5000;

// Import the router for handling shop-related routes
const shopRouter = require("./routers/shopRouter");

const app = express(); // Create an Express app

app.use(express.json()); // Parse incoming requests with JSON payloads
app.use("/api", shopRouter); // Set up routes for '/api' using the shopRouter

const start = async () => {
    try {
        // Start the server and listen on the defined port
        app.listen(PORT, () => {
            console.log("Server works on port " + PORT);
        });

        // Update database data initially and set a periodic update interval
        require("./database/dbController")
            .updateDBData()
            .then(() => {
                // Schedule periodic updates based on the provided interval in seconds
                setTimeout(() => {
                    require("./database/dbController").updateDBData();
                }, process.env.PING_INTERVAL_IN_SECONDS * 1000);
            });
    } catch (error) {
        console.log(error);
    }
};

start(); // Start the server
