const mongoose = require("mongoose")

const { ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/c/9/d/medium-poster-design-no-3303-ironman-poster-ironman-posters-for-original-imaggbyayfagz4jf.jpeg?q=90&crop=false"
    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following:[{
        type: ObjectId,
        ref: "User"
    }]
})

module.exports = mongoose.model("User", userSchema)