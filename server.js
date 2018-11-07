const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect("mongodb://localhost/fakenews", { useNewUrlParser: true })


app.get("/scrape", function (req, res) {
    axios.get("https://www.theonion.com/c/news-in-brief").then(function (response) {
        var $ = cheerio.load(response.data);
        $("article").each(function (i, element) {
            var result = {};

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

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    });
});

app.get("/articles/:id", function(req, res) {

    db.Article.findById(req.params.id,function(err, article) {
        res.json(article)
    });
});

app.post("/articles/:id", function(req, res) {
    db.Comment.create(req.body)
    .then(function(dbComment) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
    })
    .then(function(dbArticle) {
        re.json(dbArticle);
    })
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });

