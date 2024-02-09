const Listing = require('../models/Listing');
const wrapAsync = require('../utils/wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema,ReviewSchema } = require('../schema.js');
const Review = require('../models/review');
const User = require('../models/user');

module.exports.home = function(req,res){
    return res.send("Hello world!");
}
// Index Route
module.exports.Lists = wrapAsync(async (req,res) => {
    const allListingsPromise = Listing.find().exec();
    // console.log(allListing);
    allListingsPromise.then((listings) => {
        return res.render("Listings/listing",{
            title : "WanderLust",
            allListing : listings
        });
    })
});
// Show Route
module.exports.Show_id = wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("Owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect('/listings');
    }
    // listing.then((listings) => {
    //     return res.render("Listings/show",{
    //         title : "WanderLust",
    //         listing : listings
    //     });
    // console.log(listing);
    // console.log(listing.reviews.Owner);
    res.render("Listings/show",{
                title : "WanderLust",
                listing : listing
    });
        // console.log(listings)
});

// new Route
module.exports.New_List = wrapAsync(async (req,res) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    res.render("Listings/new",{
        title : "WanderLust",
    });
});
// Creat Route
module.exports.Create_List = wrapAsync(async (req,res,next) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    let url = req.file.path;
    let filename = req.file.filename;
    let result = listingSchema.validate(req.body);
    if(result.error){
        let erMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,erMsg);
    }
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.Owner = req.user.id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
});

// edit Route
module.exports.Edit_List = wrapAsync(async (req, res) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    let { id } = req.params;
    const listing = await Listing.findById(id).exec();
    if(!listing.Owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permision to edit!");
        return res.redirect(`/listings/${id}`);
    }
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect('/listings');
    }
    let originalImageurl = listing.image.url;
    originalImageurl = originalImageurl.replace("/upload","/upload/w_250")
    res.render("Listings/edit", {
        title: "WanderLust",
        listing: listing,
        image: originalImageurl
    });
});
// Update Route
module.exports.Update_List = wrapAsync(async (req, res) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    let { id } = req.params;
    let result = listingSchema.validate(req.body);
    if(result.error){
        let erMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,erMsg);
    }
    let listing = await Listing.findById(id);
    if(!listing.Owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permision to Update!");
        return res.redirect(`/listings/${id}/edit`);
    }
    let newlisting = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.image = {url,filename};
        await newlisting.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect("/listings");
});
// Delete the the Listing
module.exports.Delete_List = async (req,res) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    // console.log(req.params.id);
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if(!listing.Owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permision to Delete!");
        return res.redirect(`/listings/${id}`);
    }
        await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error Deleting the listing:", error);
        res.send("Error deleting the listing");
    }
}



