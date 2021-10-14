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

  class Article {
    create(data) {
      const model = new ArticleModel(data);
      return new Promise((resolve, reject) => {
        return model.save((err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }

    get(id) {
      return new Promise((resolve, reject) => {
        return ArticleModel.findById(id, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }

    list() {
      return new Promise((resolve, reject) => {
        return ArticleModel.find({}, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }

    update(id, data) {
      return new Promise((resolve, reject) => {
        return ArticleModel.findByIdAndUpdate(id, data, (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        });
      });
    }

    remove(id) {
      return new Promise((resolve, reject) => {
        return ArticleModel.findByIdAndRemove(id, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }
  }

  module.exports = new Article();
