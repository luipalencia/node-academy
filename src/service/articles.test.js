
const mockingoose = require('mockingoose');
const model = require('../database/articleModel');
const articles = require('../database/articles')
const authors = require('../database/authors');
const ArticlesService = require('./articles');
const service = new ArticlesService(articles, authors);

const _doc = {
    _id: "6166ce9d316d6e650ace08f4",
    title: 'JavaScript Promises',
    url: 'https://nodejs.dev/learn/understanding-javascript-promises',
    keywords: ['FS'],
    modifiedAt: "2021-10-13T03:00:00.000Z",
    author: 'Holi',
    readMins: 10,
    source: 'ARTICLE',
    __v: 0
};

beforeAll(() => {
    mockingoose(model).toReturn(_doc, 'findOne')
    mockingoose(model).toReturn(_doc, 'find')
    mockingoose(model).toReturn(_doc, 'findOneAndUpdate')
    mockingoose(model).toReturn(_doc, 'save')
})

describe('articles use cases', () => {
    it("should match with id", async () => {
        const response = await service.getArticleById({ params: { id: "61687d7481f80db4017da76e" } })
        expect(JSON.parse(JSON.stringify(response))).toMatchObject(_doc)
      })

      it("should return not found", async () => {
        mockingoose(model).toReturn(null, "findOne")
        const response = await service.getArticleById({ params: { id: "61687d7481f80db4017da76e" } })
        expect(response).toBe(null)
      })

      it("should return all the _docs", async () => {
        const response = await service.listArticles({})
        expect(JSON.parse(JSON.stringify(response))).toStrictEqual(_doc)
      })

      // en iteracion
      it('should return the response for a sucessful validation/update', async () => {
        const response = await service.updateArticle(_doc._id, _doc)
        expect(JSON.parse(JSON.stringify(response))).toBe('validatedArticle');
      });

      it('should return the new article', async () => {
        const response = await service.createArticle(_doc)
        console.log(response, 'response')
        expect(JSON.parse(JSON.stringify(response))).toBe('validatedArticle');
      });

})