const Listing = require('../models/Listing');
const wrapAsync = require('../utils/wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema,ReviewSchema } = require('../schema.js');
const Review = require('../models/review');
const User = require('../models/user');

// Sign Up Part
module.exports.signUp = (req,res) => {
    res.render('Users/signup.ejs',{
        title: "WanderLust"
    });
}
module.exports.Add_User = wrapAsync(async (req,res) => {
    try{
        let {username,email,password} = req.body;
        const NewUser = new User({email,username});
        const RegisteredUser = await User.register(NewUser,password);
        req.login(RegisteredUser,function(err) {
            if (err) { 
                return next(err); 
            }
            req.flash("success","Welcome to the WanderLust!");
            res.redirect('/listings');
        });
        
    } catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
});
// Login Part
module.exports.Login = (req,res) => {
    res.render('Users/login.ejs',{
        title: "WanderLust | Login Page"
    });
}
module.exports.Check_login = wrapAsync(async (req,res) => {
    req.flash("success","Wecome back to WanderLust!");
    res.redirect('/listings');
});
// Loging out of user
module.exports.LogOut = async(req,res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
    })
    req.flash("success","Logged Out!");
    res.redirect("/listings");
}