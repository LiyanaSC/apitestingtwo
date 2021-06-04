const express = require('express');
const router = express.Router();

const articleControl = require('../controllers/articles');
const commentControl = require('../controllers/comments');

const auth = require('../middleware/token');
const multer = require('../middleware/multer-config');




router.get("/", auth, articleControl.getAllArticles);
router.get("/:id", auth, articleControl.getOneArticle);
router.post("/", auth, /* multer,*/ articleControl.createArticle);
router.put("/:id", auth, /*multer, */ articleControl.updateArticle);
router.delete("/:id", auth, /*multer, */ articleControl.deleteArticle);

router.get("/:id/comments", auth, commentControl.getAllComments);
router.post("/:id/comments/", auth, commentControl.createComment);
router.put("/:id/comments/:id", auth, commentControl.updateComment);
router.delete("/:id/comments/:id", auth, commentControl.deleteComment);



module.exports = router;