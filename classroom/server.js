const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const ejsmate = require('ejs-mate');
const path = require('path');
const app = express();
const port = 3000;
app.use(cookieParser("secretecode"));
app.use('/',require('./routes'));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'looks'));
app.engine('ejs',ejsmate);
app.get('/send',function(req,res){
    res.send("I'm from the server");
});
app.listen(port,function(err){
    if(err){
        console.log("Error in running server");
    }
    console.log(`Server is running on  Port Number ${port}`);
});
