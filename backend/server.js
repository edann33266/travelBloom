const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const destinationRoutes = require("./routes/destinationRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Welcome to TravelBloom Backend API 🚀"
    });

});

app.use("/api/destinations", destinationRoutes);

const startServer = async () => {

    try {

        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {

            console.log(`🚀 Server running on http://localhost:${PORT}`);

        });

    } catch (err) {

        console.log(err.message);

    }

};

startServer();
