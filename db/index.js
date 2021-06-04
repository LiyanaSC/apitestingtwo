
const { rejects } = require('node:assert');
const { resolve } = require('node:path');





let pagemaniaArticles = {}

pagemaniaArticles.all = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM articles`, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })

}

module.exports = pagemaniaArticles;
module.exports = pool;