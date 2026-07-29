const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("🔄 Connecting to MongoDB...");
        
        console.log(process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log("✅ MongoDB Connected Successfully!");
        console.log(`📂 Host: ${conn.connection.host}`);
        console.log(`📁 Database: ${conn.connection.name}`);

    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
