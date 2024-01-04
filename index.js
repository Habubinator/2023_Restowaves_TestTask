const express = require("express");
require("dotenv").config();
const PORT = process.env.SERVER_PORT || 5000;

// const authRouter = require("./routers/authRouter.js");
// const meRouter = require("./routers/meRouter.js");
// const validateToken = require("./middleware/checkToken.js");

const app = express();

app.use(express.json());
// app.use(validateToken);
// app.use("/auth", authRouter);
// app.use("/me", meRouter);

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log("Server works on port " + PORT);
        });
        await require("./database/dbController").updateDBData();
    } catch (error) {
        console.log(error);
    }
};
start();
