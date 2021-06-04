const models = require('../models')
const jwt = require('jsonwebtoken');


exports.createArticle = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    console.log("administateur", decodedToken.isAdmin, "and", userId)

    let title = req.body.title;
    let description = req.body.description;

    if (
        Object.keys(req.body).length != 2 ||
        title == null ||
        description == null

    ) {
        return res.status(400).json({ error: 'Bad request type' });
    }
    models.User.findOne({
            attributes: ['id', 'lastname', 'firstname'],
            where: { id: userId }
        })
        .then(userFound => {
            if (userFound) {
                models.Article.create({
                        title: title,
                        description: description,
                        UserId: userFound.id
                    })
                    .then(newArticle => {
                        if (newArticle) {
                            newArticle = newArticle.toJSON()
                            newArticle.User = {
                                firstname: userFound.firstname,
                                lastname: userFound.lastname
                            }

                            return res.status(200).json(newArticle);
                        } else {
                            return res.status(500).json({ error: 'not create' });
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({ error: 'creation error' });

                    })

            } else {
                return res.status(400).json({ error: 'user not found' });
            }
        }).catch(err => {
            return res.status(400).json({ error: 'unable to verify user' });

        })
};

exports.getAllArticles = (req, res, next) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;
    const page = req.query.page
    const added = parseInt(req.query.added)

    console.log("ici", 5 * page + added)

    models.Article.findAll({
            order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : 5,
            offset: (!isNaN(offset)) ? offset : 5 * page + added,
            include: [{
                model: models.User,
                attributes: ['lastname', 'firstname']
            }, {
                model: models.Comment,
                attributes: ['content']
            }]
        })
        .then(Articles => {
            if (Articles) {
                res.status(200).json(Articles);
            } else {
                return res.status(404).json({ error: 'not found' });
            }
        })
        .catch(err => {
            return res.status(400).json({ error: 'unable to verify user' });

        })
};

exports.getOneArticle = (req, res, next) => {


    models.Article.findOne({
            where: { id: req.params.id },
            include: [{
                model: models.User,
                attributes: ['lastname', 'firstname']
            }]
        })
        .then(OneArticle => {
            if (OneArticle) {
                res.status(200).json(OneArticle);
            } else {
                return res.status(404).json({ error: 'not found' });
            }
        })
        .catch(err => {
            return res.status(400).json({ error: 'unable to verify user' });

        })

};

exports.updateArticle = (req, res, next) => {
    console.log(req.headers.authorization)
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    const title = req.body.title;
    const description = req.body.description;
    const articleId = req.params.id

    models.Article.findOne({
            attributes: ['title', 'description', 'id', 'UserId'],
            where: { id: articleId }
        })
        .then(articleFound => {

            if (articleFound) {
                if (userId != articleFound.UserId && isAdmin !== true) {
                    return res.status(400).json({ error: 'permission denied' });
                }
                articleFound.update({
                    title: (title ? title : articleFound.title),
                    description: (description ? description : articleFound.description),
                }).then(articleUpdate => {
                    if (articleUpdate) {
                        return res.status(200).json({ message: 'update!' });
                    } else {
                        return res.status(404).json({ error: 'cannot update' });

                    }
                }).catch(err => {
                    return res.status(404).json({ error: 'article not found' });
                })

            }
        }).catch(err => {
            return res.status(400).json({ error: 'unable to find article' });

        })
};

exports.deleteArticle = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;

    const articleId = req.params.id

    models.Article.findOne({
            attributes: ['title', 'description', 'id', 'UserId'],
            where: { id: articleId }
        })
        .then(articleFound => {

            if (articleFound) {
                if (userId != articleFound.UserId && isAdmin !== true) {
                    return res.status(400).json({ error: 'permission denied' });
                }
                models.Comment.findAll({
                        where: { articleId: articleId },

                    })
                    .then(Comments => {

                        if (Comments) {
                            Comments.forEach(comment => {
                                comment.destroy()
                            });

                        } else {
                            return res.status(404).json({ error: 'not found' });
                        }
                    })
                    .catch(err => {
                        return res.status(400).json({ error: 'unable to found comment' });

                    })
                articleFound.destroy()
                    .then(deletedArticle => {
                        return res.status(200).json({ message: 'delete!' });
                    })
                    .catch(err => {
                        return res.status(400).json({ error: 'cannot delete' });
                    })

            } else {
                return res.status(400).json({ error: 'unable to find article' });

            }
        }).catch(err => {
            return res.status(400).json({ error: 'unable to find article' });

        })
}