const {writeFile} = require('fs')
const {promisify} = require('util')
const promisifiedWriteFile = promisify(writeFile)

const writeData = async (path, article) => {
  try {
    await promisifiedWriteFile(path, JSON.stringify(article))
  } catch (err) {
    console.log(err)
  }
}
module.exports = writeData;