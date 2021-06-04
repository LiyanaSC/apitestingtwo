const models = require('../models')
const jwt = require('jsonwebtoken');
const article = require('../models/article');



exports.createComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const articleId = req.params.id

    let content = req.body.content;


    if (content == null) {
        return res.status(400).json({ error: 'Bad request type' });
    }
    models.User.findOne({
            attributes: ['id', 'firstname', 'lastname'],
            where: { id: userId }
        })
        .then(userFound => {
            if (userFound) {
                models.Comment.create({
                        content: content,
                        UserId: userFound.id,
                        ArticleId: parseInt(articleId),

                    })
                    .then(newComment => {
                        if (newComment) {
                            newComment = newComment.toJSON()
                            newComment.User = {
                                firstname: userFound.firstname,
                                lastname: userFound.lastname
                            }
                            return res.status(200).json(newComment);
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

exports.getAllComments = (req, res, next) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;
    console.log(req.params.id)

    models.Comment.findAll({
            where: { articleId: req.params.id },
            order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['lastname', 'firstname']
            }]

        })
        .then(Comments => {

            if (Comments) {
                res.status(200).json(Comments);
            } else {
                return res.status(404).json({ error: 'not found' });
            }
        })
        .catch(err => {
            return res.status(400).json({ error: 'unable to found comment' });

        })
};


exports.updateComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    const content = req.body.content;

    models.Comment.findOne({
            attributes: ['content', 'id', 'UserId', ],
            where: { id: req.params.id }
        })
        .then(commentFound => {


            if (commentFound) {
                if (userId != commentFound.UserId && isAdmin !== true) {
                    return res.status(400).json({ error: 'permission denied' });
                }
                commentFound.update({
                    content: (content ? content : commentFound.content),
                }).then(commentUpdate => {
                    if (commentUpdate) {
                        return res.status(200).json({ message: 'update!' });
                    } else {
                        return res.status(404).json({ error: 'cannot update' });

                    }
                }).catch(err => {
                    return res.status(404).json({ error: 'comment not found' });
                })

            }
        }).catch(err => {
            return res.status(400).json({ error: 'unable to find comment' });

        })
};

exports.deleteComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    const content = req.body.content;
    console.log(req.params.id)

    models.Comment.findOne({
            attributes: ['content', 'id', 'UserId', ],
            where: { id: req.params.id }
        })
        .then(commentFound => {

            console.log(commentFound)
            if (commentFound) {
                if (userId != commentFound.UserId && isAdmin !== true) {
                    return res.status(400).json({ error: 'permission denied' });
                }
                commentFound.destroy()
                    .then(deletedComment => {
                        return res.status(200).json({ message: 'delete!' });
                    })
                    .catch(err => {
                        return res.status(400).json({ error: 'cannot delete' });
                    })

            }
        }).catch(err => {
            return res.status(400).json({ error: 'unable to find comment' });

        })

}