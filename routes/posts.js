const router = require('express').Router();
const { authProtection } = require('../middlewares/authStrategy');
const { isPostAuthor } = require('../middlewares/ownerStrategy');
const {
	getAllPosts,
	getParticularPost,
	createNewPost,
	updateExistingPost,
	deleteExistingPost,
} = require('../controllers/posts');

router.get('/', authProtection(false), getAllPosts);

router.get('/:postId', getParticularPost);

router.put('/', authProtection(), createNewPost);

router.patch('/:postId', [authProtection(), isPostAuthor], updateExistingPost);

router.delete('/:postId', [authProtection(), isPostAuthor], deleteExistingPost);

module.exports = router;
