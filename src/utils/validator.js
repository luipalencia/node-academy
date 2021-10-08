const { articleSchema, authorSchema } = require('./schema.js');

const validateArticles = async (article) => {
    try {
        await articleSchema.validate(article);
        return 'valid';
    } catch (err) {
        return err.errors;
    }
};

const validateAuthors = async (author) => {
    try {
        await authorSchema.validate(author);
        return 'valid';
    } catch (err) {
        return err.errors;
    }
};

module.exports = { validateArticles, validateAuthors };