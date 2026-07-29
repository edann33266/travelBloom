const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("../config/db");
const Destination = require("../models/Destination");

dotenv.config();

// Read JSON file
const filePath = path.join(__dirname, "../../travelBloom.json");
const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

let destinations = [];

// =============================
// Countries -> Cities
// =============================
jsonData.countries.forEach(country => {

    country.cities.forEach(city => {

        destinations.push({
            id: city.id,
            name: city.name,
            country: city.country,
            continent: city.continent,
            category: city.category,
            travelType: city.travelType,
            budget: city.budget,
            featured: city.featured,
            tags: city.tags,
            rating: city.rating,
            imageUrl: city.imageUrl,
            description: city.description
        });

    });

});

// =============================
// Temples
// =============================
jsonData.temples.forEach(temple => {

    destinations.push({
        id: temple.id,
        name: temple.name,
        country: temple.country,
        continent: temple.continent,
        category: temple.category,
        travelType: temple.travelType,
        budget: temple.budget,
        featured: temple.featured,
        tags: temple.tags,
        rating: temple.rating,
        imageUrl: temple.imageUrl,
        description: temple.description
    });

});

// =============================
// Beaches
// =============================
jsonData.beaches.forEach(beach => {

    destinations.push({
        id: beach.id,
        name: beach.name,
        country: beach.country,
        continent: beach.continent,
        category: beach.category,
        travelType: beach.travelType,
        budget: beach.budget,
        featured: beach.featured,
        tags: beach.tags,
        rating: beach.rating,
        imageUrl: beach.imageUrl,
        description: beach.description
    });

});

// =============================
// Import Data
// =============================
const importData = async () => {

    try {

        await connectDB();

        await Destination.deleteMany();

        await Destination.insertMany(destinations);

        console.log("✅ Data Imported Successfully!");

        process.exit();

    } catch (err) {

        console.error(err);

        process.exit(1);

    }

};

// =============================
// Delete Data
// =============================
const deleteData = async () => {

    try {

        await connectDB();

        await Destination.deleteMany();

        console.log("🗑️ Data Deleted Successfully!");

        process.exit();

    } catch (err) {

        console.error(err);

        process.exit(1);

    }

};

// Run command
if (process.argv[2] === "-d") {

    deleteData();

} else {

    importData();

}
