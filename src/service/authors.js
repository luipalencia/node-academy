const { validateAuthors } = require('../utils/validator');

class AuthorsService {
    constructor(articlesDB, authorsDB) {
        this.articlesDB = articlesDB;
        this.authorsDB = authorsDB;
    }

    async getAuthorById(id) {
        return await this.authorsDB.get(id);
    }

    async listAuthors() {
        return await this.authorsDB.list();
    }

    async createAuthor(data) {
        const { name } = data;
        const isAuthorValid = await validateAuthors(data);
        if (isAuthorValid === 'valid') {
            const foundedAuthor = await this.authorsDB.getByName(name);
            if (foundedAuthor === null) {
                await this.authorsDB.createAuth(data);
                return 'validatedAuthor';
            }
            return 'Author already exists';
        }
        return `${isAuthorValid}`;
    }

    async updateAuthor(id, data) {
        const isAuthorValid = await validateAuthors(data);
        if (isAuthorValid === 'valid') {
            await this.authorsDB.update(id, data);
            return 'validatedAuthor';
        }
        return `${isAuthorValid}`;
    }

    async deleteAuthor(id) {
        const author = await this.authorsDB.get(id);
        const article = await this.articlesDB.list();
        const { articles } = author;
        let arrayOfArticles = [];
        article.forEach(element => arrayOfArticles.push(element._id.valueOf()));
        const founded = arrayOfArticles.filter((e) => articles.includes(e));
        founded.forEach(async element => await this.articlesDB.remove(element.toString()));
        return await this.authorsDB.remove(id);
    }
}

module.exports = AuthorsService;