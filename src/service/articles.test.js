
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
    author: 'fdsf',
    readMins: 10,
    source: 'ARTICLE',
    __v: 0
};

const _doc_error = {
    _id: "6166ce9d316d6e650ace0834",
    title: 'JavaScript Promises',
    url: 'https://nodejs.dev/learn/understanding-javascript-promises',
    keywords: ['FS'],
    modifiedAt: "2021-10-13T03:00:00.000Z",
    readMins: 10,
    source: 'ARTICLE',
    __v: 0
};

beforeAll(() => {
    mockingoose(model).toReturn(_doc, 'findOne')
    mockingoose(model).toReturn(_doc, 'find')
    mockingoose(model).toReturn(_doc, 'findOneAndUpdate')
    mockingoose(model).toReturn(_doc, 'save')
    mockingoose(model).toReturn(_doc, 'findOneAndRemove')

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
        const response = await service.listArticles()
        expect(JSON.parse(JSON.stringify(response))).toStrictEqual(_doc)
    })
    it("should return error for getArticleById", async () => {
        mockingoose(model).toReturn(new Error('My Error'), "findOne")
        await service.getArticleById({ params: { id: "61687d7481f80db4017da76e" } }).catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
    it("should return error for list method", async () => {
        mockingoose(model).toReturn(new Error('My Error'), "find")
        await service.listArticles().catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
    it('should return the response for a sucessful validation/update', async () => {
        const response = await service.updateArticle(_doc._id, _doc)
        expect(JSON.parse(JSON.stringify(response))).toBe('validatedArticle');
    });
    it('should return the require field to do validation process', async () => {
        const response = await service.updateArticle(_doc_error._id, _doc_error)
        expect(JSON.parse(JSON.stringify(response))).toContain('is a required field');
    });
    it('should return error for updated _doc', async () => {
        mockingoose(model).toReturn(new Error('My Error'), "findOneAndUpdate")
        await service.updateArticle(_doc._id, _doc).catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
    it('should return the new article object if the author exists', async () => {
        jest
            .spyOn(service.authorsDB, 'getByName')
            .mockImplementation(() => Promise.resolve({ articles: ["6166ce92316d6e650ace08e2", "6166ce93316d6e650ace08e7"] }));
        const response = await service.createArticle(_doc);
        expect(JSON.parse(JSON.stringify(response))).toBe('validatedArticle');
    });
    it("should return the new article object if the author doesn't exists", async () => {
        jest
            .spyOn(service.authorsDB, 'getByName')
            .mockImplementation(() => Promise.resolve(null));
        const response = await service.createArticle(_doc);
        expect(JSON.parse(JSON.stringify(response))).toBe('validatedArticle');
    });
    it('should return the required field to create the article', async () => {
        jest
            .spyOn(service.authorsDB, 'getByName')
            .mockImplementation(() => Promise.resolve({ articles: [] }));
        const response = await service.createArticle(_doc_error);
        expect(JSON.parse(JSON.stringify(response))).toContain('is a required field');
    });
    it('should return error for create _doc', async () => {
        mockingoose(model).toReturn(new Error('My Error'), "save")
        await service.createArticle(_doc).catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
    it('should return the deleted _doc', async () => {
        jest
            .spyOn(service.authorsDB, 'list')
            .mockImplementation(() => Promise.resolve([{
                "_id": "22ca4ccf-8d14-4035-9cbb-c1d0aee5ef37",
                "name": "nodejs.dev",
                "articles": ['6166ce9d316d6e650ace08f4', '22ca4ccf-8d14-4035-9cbb-c1d0aee5ef35'],
            }]));
        jest
            .spyOn(service.articlesDB, 'get')
            .mockImplementation(() => Promise.resolve({
                "_id": "6166ce9d316d6e650ace08f4",
                "title": "Understanding JavaScript Promises",
                "url": "https://nodejs.dev/learn/understanding-javascript-promises",
                "keywords": ['fs'],
                "modifiedAt": "02/10/2021",
                "author": "nodejs.dev",
                "readMins": 10,
                "source": "ARTICLE"
            }));
        const response = await service.deleteArticle(_doc._id);
        expect(JSON.parse(JSON.stringify(response))).toStrictEqual(_doc);
    });
    it('should return error for deleted _doc', async () => {
        mockingoose(model).toReturn(new Error('My Error'), "findOneAndRemove")
        await service.deleteArticle(_doc._id).catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
})