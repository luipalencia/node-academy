const mockingoose = require('mockingoose');
const model = require('../database/authorModel');
const articles = require('../database/articles')
const authors = require('../database/authors');
const AuthorsService = require('./authors');
const service = new AuthorsService(articles, authors);

const _doc = {
    _id: "6166ce9d316d6e650ace08f4",
    name: 'JavaScript Promises',
    articles: ['6166ce9d316d6e650ace08f3'],
};

const _doc_error = {
    _id: "6166ce9d316d6e650ace0834",
    articles: ['6166ce9d316d6e650ace08f3'],
};

beforeAll(() => {
    mockingoose(model).toReturn(_doc, 'findOne')
    mockingoose(model).toReturn(_doc, 'find')
    mockingoose(model).toReturn(_doc, 'findOneAndUpdate')
    mockingoose(model).toReturn(_doc, 'save')
    mockingoose(model).toReturn(_doc, 'findOneAndRemove')
})

describe('authors use cases', () => {
    it("should match with id", async () => {
        const response = await service.getAuthorById({ params: { id: "6166ce9d316d6e650ace08f4" } })
        expect(JSON.parse(JSON.stringify(response))).toMatchObject(_doc)
    })
    it("should return error for getAuthor", async () => {
        mockingoose(model).toReturn(new Error('My Error'), "findOne")
        await service.getAuthorById({ params: { id: "61687d7481f80db4017da76e" } }).catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
    it("should return not found", async () => {
        mockingoose(model).toReturn(null, "findOne")
        const response = await service.getAuthorById({ params: { id: "61687d7481f80db4017da76e" } })
        expect(response).toBe(null)
    })
    it("should return all the _docs", async () => {
        const response = await service.listAuthors()
        expect(JSON.parse(JSON.stringify(response))).toStrictEqual(_doc)
    })
    it("should return error for list method", async () => {
        mockingoose(model).toReturn(new Error('My Error'), "find")
        await service.listAuthors().catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
    it("should return not found for all the _docs", async () => {
        mockingoose(model).toReturn(null, "find")
        const response = await service.listAuthors()
        expect(response).toBe(null)
    });
    it('should return the new author object', async () => {
        const response = await service.createAuthor(_doc);
        expect(JSON.parse(JSON.stringify(response))).toBe('validatedAuthor');
    });
    it("should return error for create method", async () => {
        mockingoose(model).toReturn(new Error('My Error'), "save")
        await service.createAuthor(_doc).catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
    it('should return the required field to create the new author', async () => {
        const response = await service.createAuthor(_doc_error);
        expect(JSON.parse(JSON.stringify(response))).toContain('is a required field');
    });
    it("should return Author already exists when author is on DB", async () => {
        jest
            .spyOn(service.authorsDB, 'getByName')
            .mockImplementation(() => Promise.resolve(!null));
        const response = await service.createAuthor(_doc);
        expect(JSON.parse(JSON.stringify(response))).toBe('Author already exists');
    });
    it('should return the response for a sucessful validation/update of author', async () => {
        const response = await service.updateAuthor(_doc._id, _doc)
        expect(JSON.parse(JSON.stringify(response))).toBe('validatedAuthor');
    });
    it("should return error for update method", async () => {
        mockingoose(model).toReturn(new Error('My Error'), "findOneAndUpdate")
        await service.updateAuthor(_doc._id, _doc).catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
    it('should return the require field to do validation process', async () => {
        const response = await service.updateAuthor(_doc_error._id, _doc_error)
        expect(JSON.parse(JSON.stringify(response))).toContain('is a required field');
    });
    it('should return the deleted author object', async () => {
        jest
            .spyOn(service.authorsDB, 'get')
            .mockImplementation(() => Promise.resolve({
                "_id": "6166ce9d316d6e650ace08f4",
                name: 'JavaScript Promises',
                articles: ['6166ce9c316d6e650ace08ef', '6166ce9d316d6e650ace08f4']
            }));
        jest
            .spyOn(service.articlesDB, 'list')
            .mockImplementation(() => Promise.resolve([
                {
                    _id: "6166ce9c316d6e650ace08ef",
                    title: 'JavaScript Promises',
                    url: 'https://nodejs.dev/learn/understanding-javascript-promises',
                    keywords: ['FS'],
                    modifiedAt: "2021-10-13T03:00:00.000Z",
                    author: 'otro autor',
                    readMins: 10,
                    source: 'ARTICLE',
                    __v: 0
                },
                {
                    _id: "6166ce9d316d6e650ace08f4",
                    title: 'JavaScript Promises',
                    url: 'https://nodejs.dev/learn/understanding-javascript-promises',
                    keywords: ['FS'],
                    modifiedAt: "2021-10-13T03:00:00.000Z",
                    author: 'otro autor',
                    readMins: 10,
                    source: 'ARTICLE',
                    __v: 0
                }
            ]));
        const response = await service.deleteAuthor(_doc._id);
        expect(JSON.parse(JSON.stringify(response))).toStrictEqual(_doc);
    });
    it("should return error for delete method", async () => {
        mockingoose(model).toReturn(new Error('My Error'), "findOneAndRemove")
        await service.deleteAuthor(_doc._id).catch(err => {
            expect(err.message).toBe('My Error');
        })
    })
})