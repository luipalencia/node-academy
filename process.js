const fs = require('fs');
const { promisify } = require('util');

const validateKeys = (file) => {
    const DDMMAA = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/;
    const MMDDAA = /^(?:0?[1-9]|1[1-2])([\-/.])(3[01]|[12][0-9]|0?[1-9])\1\d{4}$/;
    file = JSON.parse(file); 

    const isValidID = () => {
        if(file.id.length == 36 && file.id != undefined && file.id != null) {
            return true;
        }
            return false;
        
    }
    const isValidTitle = () => {
        if(file.title.length <= 255 && file.title != undefined && file.title != null != null && file.title != '') {
            return true;
        } 
            return false;
        
    }
    
    const isValidAuthor= () => {
        if(file.author && file.author.length <= 100 && file.author != undefined && file.author != null && file.author != '') {
            return true;
        } 
            return false;
        
    }
    
    const isValidModifiedAt= () => {
        if( DDMMAA.test(file.modifiedAt) == true || MMDDAA.test(file.modifiedAt) == true && file.modifiedAt != undefined && file.modifiedAt != null && file.modifiedAt != '') {
            return true;
        } 
            return false;
        
    }
    
    const isValidPublishedAt= () => {
        if( DDMMAA.test(file.publishedAt) == true || MMDDAA.test(file.publishedAt) == true && file.publishedAt != undefined && file.publishedAt != null && file.publishedAt != '') {
            return true;
        } 
            return 'no ha sido publicado aun';
        
    }
    
    const isValidURL= () => {
        if(file.url.includes('http') && file.url != undefined && file.url != null && file.url != '') {
            return true;
        } 
            return false;
        
    }
    
    const isValidKeywords= () => {
        if(Array.isArray(file.keywords) == true && file.keywords.length <= 3 && file.keywords.length >= 1 && file.keywords != undefined && file.keywords != null && file.keywords != '') {
            return true;
        } 
            return false;
        
    } 
    
    const isValidReadMins= () => {
        if(file.readMins <= 20 && file.readMins >= 1 && file.readMins!= undefined && file.readMins!= null) {
            return true;
        } 
            return false;
        
    } 
    
    const isValidSource= () => {
        if(file.source == 'ARTICLE' || file.source == 'BLOG' || file.source == 'TWEET' || file.source == 'NEWSPAPER') {
            return true;
        } 
            return false;
    
    }

    if (
        isValidID(file) &&
        isValidTitle(file) &&
        isValidAuthor(file) &&
        isValidModifiedAt(file) &&
        isValidPublishedAt(file) &&
        isValidURL(file) &&
        isValidKeywords(file) &&
        isValidReadMins(file) &&
      isValidSource(file)
    ) {
        return (true + ' => "' + file.title + '" ')
    } else {
        return (false + ' => "' + file.title + '" ')
    }
}

const promisifiedReadDir = promisify(fs.readdir);
const promisifiedReadFile = promisify(fs.readFile);

async function main() {
    try {
        const files = await promisifiedReadDir('./database', { encoding: 'utf-8'});

        for (let file of files) {
             fileContent = await promisifiedReadFile(`./database/${file}`, { 
                encoding: 'utf-8',
            }); 
            console.log(validateKeys(fileContent))
        }
    } catch (err) {
        console.log(err)
    }
    }

    main();