const fs = require('fs');
const { promisify } = require('util');

const promisifiedReadFile = promisify(fs.readFile);

const readFile = async (path) => {
  const data = await promisifiedReadFile(path, { 
        encoding: 'utf-8',
    });
    return data; 
}

module.exports = readFile; 