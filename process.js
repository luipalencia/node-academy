
const fs = require('fs');
const { promisify } = require('util');
const promisifiedReadDir = promisify(fs.readdir);
const promisifiedReadFile = promisify(fs.readFile);
const assignFiles = require('./assignFiles.js');
const validateFiles = require('./validateFiles.js');
const schema = require('./schema.js');
const {validFiles, invalidFiles} = require('./array');

async function main() {
    try {
        const files = await promisifiedReadDir('./database', { encoding: 'utf-8'});
 
        for (const [index, file] of files.entries()) {
             fileContent = await promisifiedReadFile(`./database/${file}`, { 
                encoding: 'utf-8',
            }); 
 
     isValid = await schema.isValid(JSON.parse(fileContent));
        await validateFiles(isValid, fileContent);
        if(files.length === index + 1) {
        await assignFiles(validFiles, invalidFiles);
        }
        }
        }
    catch (err) {
        console.log(err)
    }
    finally {
      console.log(validFiles.length + ' files have been validated and ' + invalidFiles.length + ' files have been invalidated' )
    }
    }

    main();  