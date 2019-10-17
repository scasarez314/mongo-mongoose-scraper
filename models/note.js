// Dependencies
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Creating a new Note Schema object
var NoteSchema = new Schema({

    title: String,

    body: String
});

//Create using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

//Exporting Note
module.exports = Note;