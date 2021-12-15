const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma-config');

const isPostAuthor = async (req, res, next) => {
	let { postId } = req.params;
	postId = Number(postId);
	try {
		const requiredPost = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		});
		if (requiredPost.authorId !== req.user.id) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: 'Access denied',
			});
		}
		next();
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: error.message,
		});
	}
};

const isCommentAuthor = async (req, res, next) => {
	let { commentId } = req.params;
	commentId = Number(commentId);
	try {
		const requiredComment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		});
		if (requiredComment.authorId !== req.user.id) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: 'Access denied',
			});
		}
		next();
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = { isPostAuthor, isCommentAuthor };
