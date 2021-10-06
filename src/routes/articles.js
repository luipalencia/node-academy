const { Router } = require('express');
const articlesRouter = Router();
const articleModel = require("../database/articles");
const validateArticles = require('../utils/validateArticles');
const date = require('date-and-time');
const now = new Date();

// GET ✅
   articlesRouter.get("/", async (req, res) => {
     try {
      const founded = await articleModel.list();
      if(founded === null) {
        res.status(404).send('Not found');
        return;
      }
      console.log("Articles founded ", founded);
      res.status(200).json(founded);
      return;

     } catch (err) {
      console.log("Error: ", err);
      res.status(500).send('Internal server error');
     }
  });

//GET POR ID ✅
   articlesRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const founded = await articleModel.get(id);
      if(founded === null) {
        res.status(404).send('Not found');
        return;
      }
      console.log("Article founded ", founded);
      res.status(200).json(founded);
      return;
    }
    catch (err) {
      console.log("Error: ", err);
      res.status(500).send('Internal server error');
    }
  });

// POST ✅
  articlesRouter.post("/", async (req, res) => {
    const data = req.body;
  
    try {
      const isArticleValid = await validateArticles(data);
      if(isArticleValid === 'valid') {
      const article = await articleModel.create(data);
      console.log("Article created  ", article);
      res.status(200).send(article);
      return;
    }
    res.status(400).send(`Bad request: ${isArticleValid}`);

  } catch (err) {
      console.log("Error: ", err);
      res.status(500).send('Internal Server Error');
    }
  });

  // PATCH ✅
  articlesRouter.patch("/:id", async (req, res) => { 
    const { id } = req.params;
    const data = req.body;
    try {
      const isArticleValid = await validateArticles(data);
      const ifItExists = await articleModel.get(id);

      const newArticle = {
        ...data,
        modifiedAt: date.format(now, 'MM/DD/YYYY')
      }
      
      if(isArticleValid != 'valid') {
     res.status(400).send(`Bad request: ${isArticleValid}`);
        return;
      }
      if(ifItExists === null) {
        res.status(404).send("Not found");
        return;
        }
        const article = await articleModel.update(id, newArticle);
        console.log("Article updated ", article);
        res.status(200).send(article);
        return;
    } catch (err) {
      console.log("Error: ", err.message);
      res.status(500).send('Internal Server Error');
    }
  });

  // PUT ✅
  articlesRouter.put("/:id", async (req, res) => { 
    const { id } = req.params;
    const data = req.body;
    try {
      const isArticleValid = await validateArticles(data);
      const ifItExists = await articleModel.get(id);

      const newArticle = {
        ...data,
        modifiedAt: date.format(now, 'MM/DD/YYYY')
      }

      if(isArticleValid != 'valid') {
        res.status(400).send(`Bad request: ${isArticleValid}`);
        return;
      }
      if(ifItExists === null) {
        const article = await articleModel.create(newArticle);
        console.log("Article created ", article);
        res.status(201).send(article);
        return;
        }
        const article = await articleModel.update(id, newArticle);
        console.log("Article updated ", article);
        res.status(200).send(article);
        return;
    } catch (err) {
      console.log("Error: ", err.message);
      res.status(404).send("Not found");
    }
  });

   // DELETE  ✅
   articlesRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
      try {
        const article = await articleModel.remove(id);
        res.status(200).send(article);
  
      } catch (err) {
        console.log("Error", err);
        res.status(404).send("Not found");
      }
    });

   module.exports = articlesRouter;