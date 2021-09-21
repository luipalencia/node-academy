const fs = require('fs');
const { promisify } = require('util');

const validateKeys = (file) => {
    file = JSON.parse(file); 

    const isValidID = () => {
        if(file.id.length == 36 && file.id != undefined && file.id != null) {
            return file.id;
        } else {
            return false;
        }
    }
    const isValidTitle = () => {
        if(file.title.length <= 255 && file.title != undefined && file.title != null != null && file.title != '') {
            return file.title;
        } else {
            return false;
        }
    }
    
    const isValidAuthor= () => {
        if(file.author && file.author.length <= 100 && file.author != undefined && file.author != null && file.author != '') {
            return file.author;
        } else {
            return false;
        }
    }
    
    const isValidModifiedAt= () => {
        const DDMMAA = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/;
        const MMDDAA = /^(?:0?[1-9]|1[1-2])([\-/.])(3[01]|[12][0-9]|0?[1-9])\1\d{4}$/;
        if( DDMMAA.test(file.modifiedAt) == true || MMDDAA.test(file.modifiedAt) == true && file.modifiedAt != undefined && file.modifiedAt != null && file.modifiedAt != '') {
            return file.modifiedAt;
        } else {
            return false;
        }
    }
    
    const isValidPublishedAt= () => {
        const DDMMAA = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/;
        const MMDDAA = /^(?:0?[1-9]|1[1-2])([\-/.])(3[01]|[12][0-9]|0?[1-9])\1\d{4}$/;
        if( DDMMAA.test(file.publishedAt) == true || MMDDAA.test(file.publishedAt) == true && file.publishedAt != undefined && file.publishedAt != null && file.publishedAt != '') {
            return file.publishedAt;
        } else {
            return 'no ha sido publicado aun';
        }
    }
    
    const isValidURL= () => {
        if(file.url.includes('http') && file.url != undefined && file.url != null && file.url != '') {
            return file.url;
        } else {
            return false;
        }
    }
    
    const isValidKeywords= () => {
        if(Array.isArray(file.keywords) == true && file.keywords.length <= 3 && file.keywords.length >= 1 && file.keywords != undefined && file.keywords != null && file.keywords != '') {
            return file.keywords;
        } else {
            return false;
        }
    } 
    
    const isValidReadMins= () => {
        if(file.readMins <= 20 && file.readMins >= 1 && file.readMins!= undefined && file.readMins!= null) {
            return file.readMins;
        } else {
            return false;
        }
    } 
    
    const isValidSource= () => {
        if(file.source == 'ARTICLE' || file.source == 'BLOG' || file.source == 'TWEET' || file.source == 'NEWSPAPER') {
            return file.source;
        } else {
            return false;
        }
    }

    return {
        id: isValidID(),
        title: isValidTitle(),
        author: isValidAuthor(),
        modifiedAt: isValidModifiedAt(),
        publishedAt: isValidPublishedAt(),
        url: isValidURL(),
        keywords: isValidKeywords(),
        readMins: isValidReadMins(),
        source: isValidSource(),
    }
}
const propertiesArray = ["id", "title", "url", "keywords", "modifiedAt", "author", "readMins", "source"];
let checker = (arr, target) => target.every(v => arr.includes(v));

const validator = (data) => {

    const resultsTrue = checker(data, propertiesArray);

    if (resultsTrue === true) {
    return validateKeys(data)
    
    } else {
    return false;
    }
};

// const validateFalse = (obj) => {
// Object.keys(obj).map((key) => {
// if(obj[key] === false) {
//    console.log(false)
// } else {
//     console.log(true)
// }
// })
// return obj;
// }

const promisifiedReadDir = promisify(fs.readdir);
const promisifiedReadFile = promisify(fs.readFile);

async function main() {
    try {
        const files = await promisifiedReadDir('./database', { encoding: 'utf-8'});

        for (let file of files) {
             fileContent = await promisifiedReadFile(`./database/${file}`, { 
                encoding: 'utf-8',
            }); 
           // console.log(validateFalse(validator(fileContent)))
            console.log(validator(fileContent))
        }
    } catch (err) {
        console.log(err)
    }
    }

    main();