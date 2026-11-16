require("dotenv").config();

const app = require("./app");
const connectdb = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
    await connectdb();

    app.listen(PORT, function () {
        console.log("Server running on port " + PORT);
    });
}

startServer();