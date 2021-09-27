
const readFile = require('./readFile.js');
const http = require('http');
const url = require('url');

    const hostname = '127.0.0.1';
    const port = 8080;
    const server = http.createServer( async(req, res) => {

    let data = await readFile('./db.json'); 
    let queryString = url.parse(req.url, true).query;
    console.log(queryString);

        switch (true) {
            case req.url === '/articles':
                try {
                    res.statusCode = 200;
                    res.end(data);
                    break;
                } catch (err) {
                console.log(err)
                }
            case typeof queryString.id === 'string':
                const founded = JSON.parse(data).find((e) => e.id === queryString.id)
                if (founded === undefined) {
                  res.write('Not Found');
                  res.statusCode = 404;
                  res.end(); 
                  break;
                } 
                res.statusCode = 200;
                res.write(JSON.stringify(founded));
                res.end(); 
                break;
            case typeof queryString.id != 'string': 
                res.statusCode = 400; 
                res.write('Bad request');
                res.end();
                break;
            default:
                res.write('Prompt url');
                res.end(); 
        }
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });


