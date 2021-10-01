const { Router } = require('express');
const articlesRouter = Router();
const readFiles = require('../utils/readFiles.js');
const writeData = require('../utils/writeFiles.js');
const path = require('path')
const {v4 : uuidv4 } = require('uuid');
const date = require('date-and-time');
const validateArticles = require('../utils/validateArticles');

const now = new Date();

// GET 
  articlesRouter.get('/', async (req, res) => {
    try {
      const data = await readFiles(path.resolve(__dirname, '../database/db.json'));
      res.status(200).json(data);

    } catch (err) {
      console.log(err) 
      res.status(500).json(err);
    }
   })

  articlesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
    
  try {
    const data = await readFiles(path.resolve(__dirname, '../database/db.json')); 
    const founded = data.find((e) => e.id === id);
    if(!founded) {
      res.status(404).send('Not Found');
      return;
  }
    res.status(200).send(founded);
    return;
  }
  catch (err) {
    res.status(500).json(err);
  }
    });

// *********** EMPIEZA AQUIIIIIII  ******************

   // POST 
   articlesRouter.post('/:id', async (req, res) => {

    const { url, keywords, source, readMins, author, title } = req.body;
    const newArticle = { ...req.body, id: uuidv4(), publishedAt: date.format(now, 'MM/DD/YYYY'), modifiedAt: date.format(now, 'MM/DD/YYYY')};

    try {
      const isArticleValid = await validateArticles(newArticle);

      if(isArticleValid === true) {
        const validArticles = await readFiles(path.resolve(__dirname, '../database/db.json'));
        validArticles.push(newArticle);

        await writeData(path.resolve(__dirname, '../database/db.json'), validArticles);
        res.status(201).send(newArticle);

      } else {
        const invalidArticles = await readFiles(path.resolve(__dirname, '../database/invalid.json'))
        invalidArticles.push(newArticle);

         await writeData(path.resolve(__dirname, '../database/invalid.json'), invalidArticles);
         res.status(400).send(`Bad request: ${isArticleValid}`);

        }
    } catch (err) {
      res.status(500).json(err);
      console.log(err)
    }
  }) 

   //PUT 
   articlesRouter.put('/:id', function (req, res) {
    res.send('Got a PUT request at /:id')
  })

  //PATCH 
  articlesRouter.patch('/:id', function (req, res) {
    res.status(200).send({
    status: 'success',
    data: req.body
    })
  })

  // DELETE
  articlesRouter.delete('/:id', function (req, res) {
    res.send('Got a DELETE request at /:id')
  })

   module.exports = articlesRouter;