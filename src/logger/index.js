const pino = require('pino');

const logger = pino({
    name: 'instafeed',
    level: 'info'
})

module.exports = logger;