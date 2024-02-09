const mongoose = require('mongoose');
const InitData = require("../init/data");
const Listing = require("../models/Listing.js");
mongoose.connect('mongodb://localhost/wanderLust');

const db = mongoose.connection;
db.on('error',console.error.bind(console,"Error connection to MongoDb"));
db.once('open',function(){
    console.log("Connected to the database!");
});

const initDB = async () => {
    try{
        await Listing.deleteMany({});
        const modifiedData = InitData.data.map((obj) => ({ ...obj, Owner: "65bb8fb52b5f00f61b8ba931"}));
        await Listing.insertMany(modifiedData);
        // Logging a message indicating that the data was initialized
        console.log("Data was initialized successfully!");
    } catch(e){
        console.error("Error initializing data:", e);
    }
}
// Calling the initDB function to initialize the database
initDB();