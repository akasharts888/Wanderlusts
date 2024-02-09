const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/wanderLust');

const db = mongoose.connection;
db.on('error',console.error.bind(console,"Error connection to MongoDb"));
db.once('open',function(){
    console.log("Connected to the database!");
});
module.exports = db;
