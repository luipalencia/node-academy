const mongoose = require('mongoose');

const {Schema} = mongoose;

const ArticleModelSchema = new Schema({
    id: String,
    title: String,
    url: String,
    keywords: [String],
    modifiedAt: Date,
    publishedAt: Date,
    author: String,
    readMins: Number,
    source: String,
  });

  const ArticleModel = mongoose.model("ArticleModel", ArticleModelSchema);

  module.exports = ArticleModel;