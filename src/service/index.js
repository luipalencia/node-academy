const date = require('date-and-time');
const { validateArticles, validateAuthors } = require('../utils/validator');
const now = new Date();

class Service {
    constructor(articlesDB, authorsDB) {
        this.articlesDB = articlesDB;
        this.authorsDB = authorsDB;
    }

    //Services for articles  ✅
    async getArticleById(id) {
        return await this.articlesDB.get(id);
    }

    async listArticles() {
        return await this.articlesDB.list();
    }

    async createArticle(data) {
        const { author } = data;
        const bodyArticle = {
            ...data,
            modifiedAt: date.format(now, 'MM/DD/YYYY'),
            publishiedAt: date.format(now, 'MM/DD/YYYY')
        }
        const isArticleValid = await validateArticles(bodyArticle);
        if (isArticleValid === 'valid') {
            const article = await this.articlesDB.create(bodyArticle);
            const foundedAuthor = await this.authorsDB.getByName(author);
            if (foundedAuthor === null) {
                await this.authorsDB.createAuth({ name: author, articles: [article._id.valueOf()] });
                return 'validatedArticle';
            }
            foundedAuthor.articles.push(article._id.valueOf());
            const articlesArray = foundedAuthor.articles;
            const updatedArticles = {
                ...foundedAuthor,
                articlesArray,
                modifiedAt: date.format(now, 'MM/DD/YYYY')
            }
            await this.authorsDB.update(foundedAuthor._id, updatedArticles);
            return 'validatedArticle';
        }
        return `${isArticleValid}`;
    }

    async updateArticle(id, data) {
        const newArticle = {
            ...data, 
            modifiedAt: date.format(now, 'MM/DD/YYYY') 
        }
        const isArticleValid = await validateArticles(newArticle);
        if (isArticleValid === 'valid') {
         await this.articlesDB.update(id, newArticle);
         return 'validatedArticle';
        }
        return `${isArticleValid}`;
    }

    async deleteArticle(id) {
        const author = await this.authorsDB.list();
        const article = await this.articlesDB.get(id);
        const founded = author.find((e) => e.name === article.author);
        const foundIndex = founded.articles.indexOf(article._id.valueOf());
        founded.articles.splice(foundIndex, 1);
        await this.authorsDB.update(founded._id, founded);

        return await this.articlesDB.remove(id);
    }

    //Services for authors 
    //listo  ✅
    async getAuthorById(id) {
        return await this.authorsDB.get(id);
    }

    //listo  ✅
    async listAuthors() {
        return await this.authorsDB.list();
    }

   //listo  ✅
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

    // en proceso ⏰ 
    async updateAuthor(id, data) {
        const isAuthorValid = await validateAuthors(data);
        if (isAuthorValid === 'valid') {
         await this.authorsDB.update(id, data);
            return 'validatedAuthor';
           }
           return `${isAuthorValid}`;
    }

    // listo  ✅
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

module.exports = Service;