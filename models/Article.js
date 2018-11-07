const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
    
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
