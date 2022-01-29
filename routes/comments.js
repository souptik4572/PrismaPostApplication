const router = require('express').Router({
	mergeParams: true,
});
const {
	getAllComments,
	createNewComment,
	updateExistingComment,
	deleteExistingComment,
} = require('../controllers/comments');
const { authProtection } = require('../middlewares/authStrategy');
const { isCommentAuthor } = require('../middlewares/ownerStrategy');

router.get('/', getAllComments);

router.put('/', authProtection(), createNewComment);

router.patch('/:commentId', [authProtection(), isCommentAuthor], updateExistingComment);

router.delete('/:commentId', [authProtection(), isCommentAuthor], deleteExistingComment);

module.exports = router;
