const mongoose = require('mongoose');
const Review = require('./review');
const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image:{
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    Owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});
ListingSchema.post("findOneAndDelete",async (listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
})
const Listing = mongoose.model('Listing',ListingSchema);
module.exports = Listing