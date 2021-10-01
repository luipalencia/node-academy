const {promisify} = require('util')
const {readFile} = require('fs')
const promisifiedReadFile = promisify(readFile)

let data; 

const readFiles = async (path) => {
  try {
    data = await promisifiedReadFile(path, { encoding: 'utf-8' })
    return JSON.parse(data);
  } catch (err) {
    if(err.code === 'ENOENT') {
      data = [];
      return data;
    } else {
      console.log(err)
    }
  }
}
module.exports = readFiles;