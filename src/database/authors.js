const AuthorModel = require('./authorModel')

  class Author {
    createAuth(data) {
      const model = new AuthorModel(data);
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
        return AuthorModel.findById(id, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }

    getByName(name) {
      return new Promise((resolve, reject) => {
        return AuthorModel.findOne({ name }, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }

    list() {
      return new Promise((resolve, reject) => {
        return AuthorModel.find({}, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }

    update(id, data) {
      return new Promise((resolve, reject) => {
        return AuthorModel.findByIdAndUpdate(id, data, (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        });
      });
    }

    remove(id) {
      return new Promise((resolve, reject) => {
        return AuthorModel.findByIdAndRemove(id, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }


  }

  module.exports = new Author();
