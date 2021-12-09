const router = require('express').Router();
const { authProtection } = require('../middlewares/authStrategy');
const {
	getAllPosts,
	getParticularPost,
	createNewPost,
	updateExistingPost,
	deleteExistingPost,
} = require('../controllers/posts');

router.get('/', getAllPosts);

router.get('/:postId', getParticularPost);

router.put('/', authProtection, createNewPost);

router.patch('/:postId', authProtection, updateExistingPost);

router.delete('/:postId', authProtection, deleteExistingPost);

module.exports = router;
