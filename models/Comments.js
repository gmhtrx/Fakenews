const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    commenter: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    }
});

const Comments = mongoose.model("Comments", CommentSchema);

module.exports = Comments;

