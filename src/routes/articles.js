const { Router } = require('express');
const articlesRouter = Router();
const readFiles = require('../utils/readFiles.js');
const writeData = require('../utils/writeFiles.js');
const path = require('path')
const {v4 : uuidv4 } = require('uuid');
const date = require('date-and-time');
const validateArticles = require('../utils/validateArticles');
const newValues = require('../utils/newValues.js')

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
   articlesRouter.put('/:id', async (req, res) => {
    const id= req.params.id; 
    const { url, keywords, source, readMins, author, title } = req.body;
    const data = await readFiles(path.resolve(__dirname, '../database/db.json')); 
    const founded = data.find((e) => e.id === id);

  if(!founded) {

    const newArticle = {
      ...req.body,
      id: uuidv4(),
      modifiedAt: date.format(now, 'MM/DD/YYYY'),
      publishedAt: date.format(now, 'MM/DD/YYYY'),
    }
    try {
      const isArticleValid = await validateArticles(newArticle);
      if(isArticleValid === true) {
        data.push(newArticle);
        await writeData(path.resolve(__dirname, '../database/db.json'), data);
        res.status(201).send(`Got a PUT request at /${id}`);
        return;
      }
      res.status(400).send(`Bad request: ${isArticleValid}`);

    } catch (err) {
      res.status(500).json(err);
      console.log(err)
    }
  }
  else {
    const newArticle = {
      ...founded,
      ...req.body,
      modifiedAt: date.format(now, 'MM/DD/YYYY'),
    }
  
    try {
      const isArticleValid = await validateArticles(newArticle);
      if(isArticleValid === true) {
        newValues(req, founded)
        await writeData(path.resolve(__dirname, '../database/db.json'), data);
        res.status(200).send(`Got a PUT request at /${id}`);
        return;
      }
      res.status(400).send(`Bad request: ${isArticleValid}`);

    } catch (err) {
      res.status(500).json(err);
      console.log(err)
    }
  }
  })

  //PATCH 
  articlesRouter.patch('/:id', async (req, res) => {
  const id= req.params.id; 
  const data = await readFiles(path.resolve(__dirname, '../database/db.json')); 
  const founded = data.find((e) => e.id === id);
console.log(founded, 'founded')
  if(!founded) {
    res.status(404).send('Not found');
    return;
  }
  
  const newArticle = {
    ...founded,
    ...req.body,
    modifiedAt: date.format(now, 'MM/DD/YYYY')
  }

  try {
    const isArticleValid = await validateArticles(newArticle);
    if(isArticleValid === true) {
      newValues(req, founded)
      await writeData(path.resolve(__dirname, '../database/db.json'), data);
      res.status(200).send('Success');
      return;
    }
    res.status(400).send(`Bad request: ${isArticleValid}`);

  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
  })

  // DELETE
  articlesRouter.delete('/:id', async (req, res) => {
    const id= req.params.id; 
    const data = await readFiles(path.resolve(__dirname, '../database/db.json')); 

    const founded = data.find((e) => e.id === id);
    if (!founded) res.status(404).send('Not found');

    const foundIndex = data.indexOf(founded);
    data.splice(foundIndex, 1);
    await writeData(path.resolve(__dirname, '../database/db.json'), data);
    res.status(200).send(`Got a DELETE request at /${id}`);
    
  })

   module.exports = articlesRouter;