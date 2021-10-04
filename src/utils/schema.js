const yup = require("yup");
const now = new Date();

let schema = yup.object().shape({
    id: yup.string().length(36).required(),
    title: yup.string().max(255).required(),
    author: yup.string().max(100).strict().required(),
    modifiedAt: yup.date().max(now).required(),
    publishedAt: yup.date().max(now).nullable(),
    url: yup.string().url().when("publishedAt", {
       is: (publishedAt) => !publishedAt,
       then: yup.string().url().matches(/https/).required()
   }),
    keywords: yup.array().min(1).max(3).required(),
    readMins: yup.number().required().min(1).max(20).positive().integer(),
    source: yup.mixed().oneOf(['BLOG', 'ARTICLE', 'NEWSPAPER', 'TWEET']).required(),
  });

module.exports = schema; 