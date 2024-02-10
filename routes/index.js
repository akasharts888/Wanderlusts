const express = require('express');
const homeController = require('../controller/home_controller');
const ReviewController = require('../controller/Review');
const UserController = require('../controller/User');
const serverController = require('../classroom/server_controller/server_controller');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const router = express.Router();
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const parser = multer({ storage: storage });


const sessionOption = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}
router.use(session(sessionOption));
router.use(flash());
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.get('/',homeController.home);
router.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

router.get('/list/demouser',async (req,res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student",
    });

    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
});
// router.get('/listing',homeController.List);
// Index route
router.route('/listings')
.get(homeController.Lists)
.post(parser.single("listing[image]"), homeController.Create_List);
// router.get('/listings',homeController.Lists);
// router.post('/listings',homeController.Create_List);
// Update List Route
router.put('/listings/update/:id',parser.single("listing[image]"), homeController.Update_List);
// Edit List Route
router.get('/listings/:id/edit',homeController.Edit_List);

// new List Route
router.get('/listings/new',homeController.New_List);
router.delete('/listings/delete/:id',homeController.Delete_List);
// Create List Route
// show route
router.get('/listings/:id',homeController.Show_id);
// Reviews
router.post('/listings/review/:id',ReviewController.Reviews);
// reveiw delete
router.delete('/listings/review/:id/delete/:reviewid',ReviewController.delete_review);
router.route('/signup')
.get(UserController.signUp)
.post(UserController.Add_User);
router.route('/login')
.get(UserController.Login)
.post(passport.authenticate("local",{
    failureRedirect: '/login',
    failureFlash:true
}), UserController.Check_login);
router.get('/category/:name',homeController.Lists_Category);
router.post('/category',homeController.Lists_Search);
// router.get('/signup',UserController.signUp);
// router.get('/login',UserController.Login);
// router.post('/signup',UserController.Add_User);
// router.post('/login', passport.authenticate("local",{
//     failureRedirect: '/login',
//     failureFlash:true
// }), UserController.Check_login);
router.get('/logout',UserController.LogOut);
// router.use('/user',require('./users'));
// for any further routes, access from here
// router.use('/routerName',require('./routerfile'))
module.exports = router;