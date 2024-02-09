if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
// app.set();
const app = express();
const port = 8000;
const db = require('./config/mongoose');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');

const cookieParser = require('cookie-parser');
const wrapaAsync = require('./utils/wrapasync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');
const server = require('./classroom/server');
// const initData = require('./init/index.js');
const path = require('path');
const ListingRouter = require('./routes/index');
app.use(express.static('./assets'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set('view engine','ejs');
app.set('views','./views');
app.engine('ejs',ejsmate);
app.use(cookieParser());

// Define your route handler
app.get('/send', function(req, res) {
    // Access cookies using req.cookies
    let { name = "Anonymous" } = req.cookies;
    res.send(`Hello, This is ${name}`);
});
app.use('/',ListingRouter);
app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
})
app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{
        title : "wanderLust",
        message: message
    });
    // res.status(statusCode).send(message);
});
app.listen(port,function(err){
    if(err){
        console.log("Error in running server");
    }
    console.log(`Server is running on  Port Number ${port}`);
});

