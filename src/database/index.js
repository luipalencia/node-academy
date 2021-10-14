const mongoose = require('mongoose');

class Database {
    constructor() {
     (async () => {
         try {
            await mongoose.connect('mongodb://localhost:27017');
            return console.log('db is ready');
         } catch (err) {
             console.log(err);
             throw new Error(err);
         }
        })();
 }
}

module.exports = new Database();
