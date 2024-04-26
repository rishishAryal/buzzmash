const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({


title : {
    type : String,
    required : true,
    trim : true
},
description : {
    type : String,
    required : true,
    trim : true
},
slug: {
    type: String,
    required: true,
    unique: true
},
thumbnail: {
    type: String,
    default: "",
},
category: {
    type: String,
    required: true,
},
author: {
    type: String,
    required: true,
},
createdAt: {
    type: Date,
    default: Date.now,
},
updatedAt: {
    type: Date,
    default: Date.now,
},
userId: {
    type: mongoose.Schema.Types.ObjectId,
    
    required: true,

},
likeCount: {
    type: Number,
    default: 0,
},
commentCount: {
    type: Number,
    default: 0,
},


})


module.exports = Blog = mongoose.model("Blogs", blogSchema);