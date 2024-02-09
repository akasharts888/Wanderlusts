module.exports.home = async (req,res) => {
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    return res.send(`You sent a request ${req.session.count} times`);
}
module.exports.register = (req,res) => {
    let { name = "Anonymous" } = req.query;
    req.session.name = name;
    if(name == "Anonymous"){
        req.flash("error","user not registered!");
    }else{
        req.flash("success","user registered successfullly!");
    }
    // req.locals.messages = req.flash("success","user registered successfullly!");
    res.redirect('/hello');
}
module.exports.hello = async (req,res) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.render('page.ejs',{
        name: req.session.name,
    });
}