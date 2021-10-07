const { Router } = require('express');
const authorsRouter = Router();
const authorModel = require("../database/authors");
const { validateAuthors } = require('../utils/validator');
const db = require('../database')

// GET ✅
  authorsRouter.get("/", async (req, res) => {
    try {
     const founded = await authorModel.list();

     if(founded === null) {
       res.status(404).send('Not found');
       return;
     }
     console.log('Authors founded: ', founded);
     res.status(200).json(founded);
     return;

    } catch (err) {
     console.log("Error: ", err);
     res.status(500).send('Internal server error');
    }
 });

  // PRUEBA DE QUERY


//GET BY ID ✅
   authorsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
      const founded = await authorModel.get(id);
      if(founded === null) {
        res.status(404).send('Not found');
        return;
      }
      console.log('Author founded: ', founded);
      res.status(200).json(founded);
      return;
    }
    catch (err) {
      console.log("Error: ", err);
      res.status(500).send('Internal server error');
    }
  });

// POST ✅
  authorsRouter.post("/", async (req, res) => {
    const data = req.body;
  
    try {
      const isAuthorValid = await validateAuthors(data);
      if(isAuthorValid === 'valid') {
      const author = await authorModel.create(data);
      console.log('Author created: ', author);
      res.status(200).send(author);
      return;
    }
    res.status(400).send(`Bad request: ${isAuthorValid}`);

  } catch (err) {
      console.log("Error: ", err);
      res.status(500).send('Internal Server Error');
    }
  });

  // PATCH ✅
  authorsRouter.patch("/:id", async (req, res) => { 
    const { id } = req.params;
    const data = req.body;
    try {
      const isAuthorValid = await validateAuthors(data);
      const ifItExists = await authorModel.get(id);

      if(isAuthorValid != 'valid') {
     res.status(400).send(`Bad request: ${isAuthorValid}`);
        return;
      }
      if(ifItExists === null) {
        res.status(404).send('Not found');
        return;
        }
        const author = await authorModel.update(id, data);
        console.log('Author updated: ', author);
        res.status(200).send(author);
        return;
    } catch (err) {
      console.log("Error: ", err.message);
      res.status(500).send('Internal Server Error');
    }
  });

  // PUT ✅
  authorsRouter.put("/:id", async (req, res) => { 
    const { id } = req.params;
    const data = req.body;
    try {
      const isAuthorValid = await validateAuthors(data);
      const ifItExists = await authorModel.get(id);

      if(isAuthorValid != 'valid') {
        res.status(400).send(`Bad request: ${isAuthorValid}`);
        return;
      }
      if(ifItExists === null) {
        const author = await authorModel.create(author);
        console.log("Author created ", author);
        res.status(201).send(author);
        return;
        }
        const author = await authorModel.update(id, author);
        console.log('Author updated: ', author);
        res.status(200).send(author);
        return;
    } catch (err) {
      console.log("Error: ", err.message);
      res.status(500).send("Internal server error");
    }
  });

   // DELETE  ✅
   authorsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
      try {
        const author = await authorModel.remove(id);
        res.status(200).send('Removed Author: ', author);
  
      } catch (err) {
        console.log("Error", err);
        res.status(404).send("Not found");
      }
    });

   module.exports = authorsRouter;