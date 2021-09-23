
const fs = require('fs');
const { promisify } = require('util');
const promisifiedAppendFile = promisify(fs.appendFile);

async function asignFiles(validArray, invalidArray) {
    try {
     if (validArray.length) {
       await promisifiedAppendFile('db.json', JSON.stringify(validArray), 'utf8');
      } 
      if (invalidArray.length) {
      await promisifiedAppendFile('invalid.json', JSON.stringify(invalidArray) , 'utf8');
   }
    } 
    catch (err){
     console.log(err)
    }
  }

  module.exports = asignFiles;