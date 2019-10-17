// Dependencies
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Creating a new User Schema object
var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

//Create using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Exporting Article 
module.exports = Article;