const express = require('express');
const app = express();
const db = require('../src/database')

const router = require('./routes');

const performanceMiddleware = (req, res, next) => {
    console.time();
     next();
     console.timeEnd();
   };
   
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(performanceMiddleware);
   app.use('/api/v1/articles', router.articlesRouter);
   app.use('/api/v1/authors', router.authorsRouter);
   

app.listen(8080, () => {
    console.log('server running on 8080');
})