const schema = require('./schema.js');

const validateArticles = async (article) => {
   try {
    await schema.validate(article);
    return 'valid'; 
   } catch (err) {
    return err.errors;
   }
    }

module.exports = validateArticles;