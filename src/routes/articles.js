const { Router } = require('express');
const articlesRouter = Router();
const articleModel = require("../database/articles");
const authorModel = require('../database/authors');
const ArticlesService = require('../service/articles');
const service = new ArticlesService(articleModel, authorModel);
const logger = require('../logger');

// get
articlesRouter.get("/", async (req, res) => {
  logger.info(`[Articles][List][Params] ${JSON.stringify(req.body)}`);
  try {
    const founded = await service.listArticles();
    logger.info(`[Articles][List][Response] ${JSON.stringify(founded)}`);
    if (founded === null) {
      res.status(404).send('Not found');
      return;
    }
    console.log("Articles founded ", founded);
    res.status(200).json(founded);
    return;

  } catch (err) {
    console.log("Error: ", err);
    logger.info(`[Articles][List][Error] ${err}`);
    res.status(500).send('Internal server error');
  }
});

// get by ID
articlesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  logger.info(`[Articles][GetById][Request] ${JSON.stringify(req.params)}`);
  try {
    const founded = await service.getArticleById(id);
    logger.info(`[Articles][GetById][Response] ${JSON.stringify(founded)}`);
    if (founded === null) {
      res.status(404).send('Not found');
      return;
    }
    console.log("Article founded ", founded);
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
articlesRouter.post("/", async (req, res) => {
  logger.info(`[Articles][Create][Request] ${JSON.stringify(req.body)}`);
  try {
    const article = await service.createArticle(req.body);
    logger.info(`[Articles][Create][Request] ${JSON.stringify(article)}`);
    if (article === 'validatedArticle') {
      console.log("Article created  ", req.body);
      res.status(200).send(req.body);
      return;
    }
    console.log('Bad request: ', article)
    res.status(400).send(article);
  } catch (err) {
    console.log("Error: ", err);
    logger.info(`[Authors][Create][Error] ${err}`);
    res.status(500).send('Internal Server Error');
  }
});

// patch
articlesRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  logger.info(`[Authors][GetById][Request] ${JSON.stringify(req.params)}`);
  try {
    const ifItExists = await service.getArticleById(id);
    if (ifItExists === null) {
      res.status(404).send("Not found");
      return;
    }
    const article = await service.updateArticle(id, req.body)
    logger.info(`[Articles][Update][Response] ${JSON.stringify(article)}`);
    if (article === 'validatedArticle') {
      console.log("Article updated ", req.body);
      res.status(200).send(req.body);
      return;
    }
    console.log('Bad request: ', article)
    res.status(400).send(article);
  } catch (err) {
    console.log("Error: ", err.message);
    logger.info(`[Article][Update][Error] ${err}`);
    res.status(500).send('Internal Server Error');
  }
});

// put
articlesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  //PREGUNTAR POR ESTA PARTE, EN LINEA 101 O 105
  logger.info(`[Articles][GetById][Request] ${JSON.stringify(req.params)}`);
  try {
    const ifItExists = await service.getArticleById(id);
    if (ifItExists === null) {
      const article = await service.createArticle(req.body);
      logger.info(`[Authors][Create][Response] ${JSON.stringify(article)}`);
      if (article === 'validatedArticle') {
        console.log("Article created  ", req.body);
        res.status(200).send(req.body);
        return;
      }
      console.log('Bad request: ', article)
      res.status(400).send(article);
      return;
    }
    const article = await service.updateArticle(id, req.body)
    logger.info(`[Articles][Update][Response] ${JSON.stringify(article)}`);
    if (article === 'validatedArticle') {
      console.log("Article updated ", req.body);
      res.status(200).send(req.body);
      return;
    }
    console.log('Bad request: ', article)
    res.status(400).send(article);
    return;
  } catch (err) {
    console.log("Error: ", err.message);
    logger.info(`[Authors][Update][Error] ${err}`);
    res.status(500).send('Internal Server Error');
  }
});

// delete
articlesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  logger.info(`[Articles][Delete][Request] ${JSON.stringify(req.params)}`);

  try {
    const article = await service.deleteArticle(id);
    logger.info(`[Articles][Delete][Response] ${JSON.stringify(article)}`);
    console.log('Removed Article: ', article)
    res.status(200).send(article);
  } catch (err) {
    console.log("Error", err);
    logger.info(`[Articles][Delete][Error] ${err}`);
    res.status(404).send("Not found");
  }
});

module.exports = articlesRouter;