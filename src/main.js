const express = require('express');
const app = express();
const db = require('../src/database')
const jwt = require('jsonwebtoken');
const router = require('./routes');
require('dotenv').config()

const performanceMiddleware = (req, res, next) => {
    console.time();
     next();
     console.timeEnd();
   };
   const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
      res.status(401).send('Not authorized')
      return
    }
    try {
      jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
    } catch (err) {
      res.status(401).send(err.message, 'Not authorized')
    }
    next();
  }

   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(performanceMiddleware);
   app.use('/api/v1/auth', router.authRouter);
   app.use(authMiddleware);
   app.use('/api/v1/articles', router.articlesRouter);
   app.use('/api/v1/authors', router.authorsRouter);

app.listen(8080, () => {
    console.log('server running on 8080');
})