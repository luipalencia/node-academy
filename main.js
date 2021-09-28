const express = require('express');
const app = express();

const router = require('./router')

const performanceMiddleware = (req, res, next) => {
    console.time();
     next();
     console.timeEnd();
   };

app.use(performanceMiddleware);
app.use('/api/v1/articles', router.articlesRouter);

app.listen(8080, () => {
    console.log('server running on 8080');
})