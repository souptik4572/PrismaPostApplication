const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma-config');

const getAllComments = async (req, res) => {
	let { postId } = req.params;
	postId = Number(postId);
	try {
		const allComments = await prisma.comment.findMany({
			where: {
				postId,
			},
		});
		return res.status(StatusCodes.OK).json({
			success: true,
			message: `All comments of the post with id ${postId}`,
			comments: allComments,
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

const createNewComment = async (req, res) => {
	let { postId } = req.params;
	postId = Number(postId);
	const { text } = req.body;
	try {
		const requiredPost = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		});
		if (!!!requiredPost) {
			return res.status(StatusCodes.NOT_FOUND).json({
				success: false,
				message: `Post with id ${postId} does not exist`,
			});
		}
		const newComment = await prisma.comment.create({
			data: {
				text,
				postId,
				authorId: req.user.id,
			},
		});
		return res.status(StatusCodes.CREATED).json({
			success: true,
			message: 'Successfully created new comment',
			comment: newComment,
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

const updateExistingComment = async (req, res) => {
	let { commentId } = req.params;
	commentId = Number(commentId);
	const { text } = req.body;
	try {
		const updatedComment = await prisma.comment.update({
			where: {
				id: commentId,
			},
			data: {
				text,
			},
		});
		res.status(StatusCodes.ACCEPTED).json({
			success: true,
			message: `Updated comment with id ${commentId}`,
			comment: updatedComment,
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

const deleteExistingComment = async (req, res) => {
	let { commentId } = req.params;
	commentId = Number(commentId);
	try {
		const deletedComment = await prisma.comment.delete({
			where: {
				id: commentId,
			},
		});
		res.status(StatusCodes.ACCEPTED).json({
			success: true,
			message: `Deleted comment with id ${commentId}`,
			comment: deletedComment,
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	getAllComments,
	createNewComment,
	updateExistingComment,
	deleteExistingComment,
};
