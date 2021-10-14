const { Router } = require('express');
const authorsRouter = Router();
const articleModel = require("../database/articles");
const authorModel = require('../database/authors');
const AuthorsService = require('../service/authors');
const service = new AuthorsService(articleModel, authorModel);
const logger = require('../logger');

// get
authorsRouter.get("/", async (req, res) => {
  logger.info(`[Authors][List][Request] ${JSON.stringify(req.body)}`);
  try {
    const founded = await service.listAuthors();
    logger.info(`[Authors][List][Response] ${JSON.stringify(founded)}`);
    if (founded === null) {
      res.status(404).send('Not found');
      return;
    }
    console.log('Authors founded: ', founded);
    res.status(200).json(founded);
    return;

  } catch (err) {
    console.log("Error: ", err);
    logger.info(`[Authors][List][Error] ${err}`);
    res.status(500).send('Internal server error');
  }
});

// get by ID
authorsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  logger.info(`[Authors][GetById][Request] ${JSON.stringify(req.params)}`);
  try {
    const founded = await service.getAuthorById(id);
    logger.info(`[Authors][GetById][Response] ${JSON.stringify(founded)}`);
    if (founded === null) {
      res.status(404).send('Not found');
      return;
    }
    console.log('Author founded: ', founded);
    res.status(200).json(founded);
    return;
  }
  catch (err) {
    console.log("Error: ", err);
    logger.info(`[Authors][GetById][Error] ${err}`);
    res.status(500).send('Internal server error');
  }
});

// post
authorsRouter.post("/", async (req, res) => {
  logger.info(`[Authors][Create][Request] ${JSON.stringify(req.body)}`);
  try {
    const author = await service.createAuthor(req.body);
    logger.info(`[Authors][Create][Request] ${JSON.stringify(author)}`);
    if (author === 'validatedAuthor') {
      console.log('Author created: ', req.body);
      res.status(201).send(req.body);
      return;
    }
    console.log('Bad request: ', author)
    res.status(400).send(author);

  } catch (err) {
    console.log("Error: ", err);
    logger.info(`[Authors][Create][Error] ${err}`);
    res.status(500).send('Internal Server Error');
  }
});

// patch
authorsRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  logger.info(`[Authors][GetById][Request] ${JSON.stringify(req.params)}`);
  try {
    const ifItExists = await service.getAuthorById(id);
    if (ifItExists === null) {
      res.status(404).send("Not found");
      return;
    }
    const author = await service.updateAuthor(id, req.body)
    logger.info(`[Authors][Update][Response] ${JSON.stringify(author)}`);
    if (author === 'validatedAuthor') {
      console.log("Author updated ", req.body);
      res.status(200).send(req.body);
      return;
    }
    console.log('Bad request: ', author)
    res.status(400).send(author);
  } catch (err) {
    console.log("Error: ", err.message);
    logger.info(`[Authors][Update][Error] ${err}`);
    res.status(500).send('Internal Server Error');
  }
});

// put
authorsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  logger.info(`[Authors][GetById][Request] ${JSON.stringify(req.params)}`);
  try {
    const ifItExists = await service.getAuthorById(id);
    if (ifItExists === null) {
      const author = await service.createAuthor(req.body);
      logger.info(`[Authors][Create][Response] ${JSON.stringify(author)}`);
      if (author === 'validatedAuthor') {
        console.log("Author created  ", req.body);
        res.status(200).send(req.body);
        return;
      }
      console.log('Bad request: ', author)
      res.status(400).send(author);
      return;
    }
    const author = await service.updateAuthor(id, req.body)
    logger.info(`[Authors][Update][Response] ${JSON.stringify(author)}`);
    if (author === 'validatedAuthor') {
      console.log("Author updated ", req.body);
      res.status(200).send(req.body);
      return;
    }
    console.log('Bad request: ', author)
    res.status(400).send(author);
    return;
  } catch (err) {
    console.log("Error: ", err.message);
    logger.info(`[Authors][Update][Error] ${err}`);
    res.status(500).send('Internal Server Error');
  }
});

// delete
authorsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  logger.info(`[Authors][Delete][Request] ${JSON.stringify(req.params)}`);
  try {
    const author = await service.deleteAuthor(id);
    logger.info(`[Authors][Delete][Response] ${JSON.stringify(author)}`);
    console.log('Removed Article: ', author)
    res.status(200).send(author);
  } catch (err) {
    console.log("Error", err);
    logger.info(`[Authors][Delete][Error] ${err}`);
    res.status(404).send("Not found");
  }
});


module.exports = authorsRouter;