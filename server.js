//// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");
var bodyParser = require("body-parser")

// Require all models
var db = require("./models");

//Declaring PORT
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes //

//HTML homepage route
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/html/index.html"));
});

//Saved articles 
app.get("/saved", function (req, res) {
    db.Article.find(
        { saved: true }
    ).populate("notes")
        .then(function (dbNote) {
            res.json(dbNote);
        })
        .catch(function (err) {
            res.json(err)
        });
})

// Route to scrape the NYTimes website
app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {
        //Save shorthand selector
        var $ = cheerio.load(response.data);

        //Grab every h2 in the article
        $("article").each(function (i, element) {

            //Save an empty result
            var scrapeResult = {};

            //Add the titl to each article
            scrapeResult.title = $(this).find("h2").text();

            // Add the summary to each article
            scrapeResult.summary = $(this).find("p").text();

            //Add the link to each article 
            scrapeResult.link = "https://www.nytimes.com" + $(this).find("a").attr("href");

            //Create a new article using the 'scrapeResult' object 
            db.Article.create(scrapeResult)
                .then(function (dbArticle) {

                    // console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err)
                });
        });
        res.send("Scraped!")
    });
});

// Route to get JSON Articles
app.get("/articles", function (req, res) {
    // Grabing every Articles 
    db.Article.find({})
        .then(function (dbArticle) {
            //Send Articles back
            res.json(dbArticle);
        })
        .catch(function (err) {
            //Send err if there is one
            res.json(err);
        });
});

//Route to save an Article
app.post("article/save/:id", function (req, res) {
    dbArticle.findOneAndUpdate(
        { _id: req.params.id },
        { saved: true }
    )
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
})

//Route to delete a saved Article
app.post("article/delete/:id", function (req, res) {
    db.Article.findByIdAndUpdate(
        { _id: req.params.id },
        { saved: false },
        { notes: [] }
    )
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
})

// Route for aspecific Article by id, populate it's note
app.get("/article/:id", function (req, res) {
    db.Article.findOne({
        _id: req.params.id
    })
        //populate note 
        .populate('note')
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for saving/updating an Article's Note
app.post("articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate(
                { _id: req.params.id },
                { note: req.params.dbNote._id },
                { new: true }
            )
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
})

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});