const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
// username and password field will be created automaticaly by passport with it hashed and salted value
const userSchema = new Schema({
    email:{
        type: String,
        required: true
    }
});
userSchema.plugin(passportLocalMongoose);
// Hashing Algorithm used for it is PBK2
module.exports = mongoose.model('User',userSchema);
