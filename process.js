
const fs = require('fs');
const { promisify } = require('util');
const yup = require("yup");
const promisifiedReadDir = promisify(fs.readdir);
const promisifiedReadFile = promisify(fs.readFile);
const promisifiedAppendFile = promisify(fs.appendFile);

let schema = yup.object().shape({
    id: yup.string().length(36).required(),
    title: yup.string().max(255).required(),
    author: yup.string().max(100).strict().required(),
    modifiedAt: yup.date().required(),
    publishedAt: yup.date().nullable(),
    url: yup.string().url().when("publishedAt", {
       is: (publishedAt) => !publishedAt,
       then: yup.string().url().matches(/https/).required()
   }),
    keywords: yup.array().min(1).max(3).required(),
    readMins: yup.number().required().min(1).max(20).positive().integer(),
    source: yup.mixed().oneOf(['BLOG', 'ARTICLE', 'NEWSPAPER', 'TWEET']).required(),
  });

const validFiles = [];
const invalidFiles = [];

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

async function validateFiles(file, content) {
try {
  if (file === true) {
  validFiles.push(content) 
   console.log('valid files: ' , validFiles.length)
   } else if (file === false) {
   invalidFiles.push(content)
     console.log('invalid files: ', invalidFiles.length);
  }}
 catch (err) {
  console.log(err)
}
}

async function main() {
    try {
        const files = await promisifiedReadDir('./database', { encoding: 'utf-8'});
 
        for (const [index, file] of files.entries()) {
             fileContent = await promisifiedReadFile(`./database/${file}`, { 
                encoding: 'utf-8',
            }); 
 
        isValid = await schema.isValid(JSON.parse(fileContent))
        await validateFiles(isValid, fileContent);
        if(files.length === index + 1) {
          await asignFiles(validFiles, invalidFiles);
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
   
  
