
const fs = require('fs');
const { promisify } = require('util');
const yup = require("yup");

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

const promisifiedReadDir = promisify(fs.readdir);
const promisifiedReadFile = promisify(fs.readFile);

async function main() {
    try {
        const files = await promisifiedReadDir('./database', { encoding: 'utf-8'});
 
        for (let file of files) {
             fileContent = await promisifiedReadFile(`./database/${file}`, { 
                encoding: 'utf-8',
            }); 

         const isValid = await schema.isValid(JSON.parse(fileContent))
         console.log(isValid + ` ${file}`);
        }
            }
    catch (err) {
        console.log(err)
    }
    }

    main();
