const { Router } = require('express');
const articlesRouter = Router();
const readFile = require('../readFile.js');

  articlesRouter.get('/', async (req, res) => {
    let data = await readFile('./db.json');
    res.status(200).json(data);
   })

  articlesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
    
    let data = await readFile('./db.json'); 
     const founded = JSON.parse(data).find((e) => e.id === id);
     if(!founded) {
         res.status(404).send('Not Found');
         return;
     }
     res.status(200).send(founded);
     return;

    });

   module.exports = articlesRouter;