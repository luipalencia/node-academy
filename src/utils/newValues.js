const newValues = (req, result) => {

    const {title, url, keywords, author, readMins, source} = req.body;

    if (title) result.title = title
    if (url) result.url = url
    if (keywords) result.keywords = keywords
    if (author) result.author = author
    if (readMins) result.readMins = readMins
    if (source) result.source = source
  }
  
  module.exports = newValues;