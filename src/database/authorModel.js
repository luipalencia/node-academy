const mongoose = require('mongoose');
const db = require('../database')

const {Schema} = mongoose;

const AuthorModelSchema = new Schema({
    id: String,
    name: String,
    articles: [String]
  });

  const AuthorModel = mongoose.model("AuthorModel", AuthorModelSchema);

  module.exports = AuthorModel; 