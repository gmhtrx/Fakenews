const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
var path = require("path");

const db = require("./models");

const PORT = 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect("mongodb://localhost/fakenews", { useNewUrlParser: true })


app.get("/scrape", function (req, res) {
    axios.get("https://www.theonion.com/c/news-in-brief").then(function (response) {
        const $ = cheerio.load(response.data);
        $("article").each(function (i, element) {
            let result = {};

            result.title = $(this).find("h1").find("div").text();
            result.link = $(this).find("h1").find("a").attr("href");
            result.description = $(this).find("div").find("p").text();

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err)
                });
        });
        res.send("scrape is complete");

    });

});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        });
});

app.get("/articles/:id", function (req, res) {

    db.Article.findById(req.params.id, function (err, article) {
        res.json(article)
    });
});


app.get("/comments/:id", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/comments.html"));
});

app.get("/api/comments/:id", function(req, res) {
    db.Comments.findOne({_id:req.params.id})
    .then(function(comments) {
        res.json(comments)
    })
})

app.get("/api/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("Comments")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            console.log("GET /api/:id")
            console.log(dbArticle);
                res.json(dbArticle)
                for(var i=0; i < dbArticle.comments.length; i++){

                }
        })

        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.post("/api/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    console.log(req.body)
    db.Comments.create(req.body)
    
      .then(function(dbComment) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        console.log("++++++++++++++++")
        console.log(dbComment)
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {comments: dbComment._id }},{new:true});
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        console.log("first")
        
        db.Comments.find({_id: dbArticle.comments})
        .then(function(data) {
            console.log("_____________________")
            console.log(data);
            res.json(data)
        })
      })
      
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

