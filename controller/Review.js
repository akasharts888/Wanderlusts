const Listing = require('../models/Listing');
const wrapAsync = require('../utils/wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema,ReviewSchema } = require('../schema.js');
const Review = require('../models/review');
const User = require('../models/user');

// module.exports.actName = function(req.res){};
// Reviws
module.exports.Reviews = wrapAsync(async (req,res) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    let id = await Listing.findById(req.params.id).populate("Owner");
    let result = ReviewSchema.validate(req.body);
    // console.log(req.User);
    if(result.error){
        let erMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,erMsg);
    }
    if (!id) {
        return res.status(404).send("Listing not found");
    }

    // Initialize reviews array if it doesn't exist
    if (!id.reviews) {
        id.reviews = [];
    }

    let newReview = new Review(req.body.review);
    newReview.Owner = req.user.id;
    id.reviews.push(newReview);
    await newReview.save();
    await id.save();

    req.flash("success","New Review Added!");
    res.redirect('back');
});

// reveiw delete route
module.exports.delete_review = async (req,res) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    try {
        let reviewId = req.params.reviewid;
        let id = req.params.id;
        await Listing.findByIdAndUpdate(id,{$pull: { reviews: reviewId }});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error Deleting the listing:", error);
        res.send("Error deleting the listing");
    }
};