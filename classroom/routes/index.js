const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const sessionOption = {
    secret: "mysecretstring",
    resave: false,
    saveUninitialized: true
}
const router = express.Router();
// router.use((req,res,next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });
router.use(session(sessionOption));
router.use(flash());
const serverController = require('../server_controller/server_controller');
router.get('/',serverController.home);
router.get('/register',serverController.register);
router.get('/hello',serverController.hello);

module.exports = router;
// router.get('/send',serverController.send);

// router.get('/varify',serverController.varify);

