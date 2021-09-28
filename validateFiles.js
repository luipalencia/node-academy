const {validFiles, invalidFiles} = require('./array');

async function validateFiles(file, content) {
    try {
      if (file === true) {
      validFiles.push(JSON.parse(content)) 
       console.log('valid files: ' , validFiles.length)
       } else if (file === false) {
       invalidFiles.push(JSON.parse(content))
         console.log('invalid files: ', invalidFiles.length);
      }}
     catch (err) {
      console.log(err)
    }
    }

    module.exports = validateFiles;