const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma-config');
const { includeIsAuthor } = require('../helpers/prismaFetch');

const getAllPosts = async (req, res) => {
	try {
		const allPosts = await prisma.post.findMany({
			where: {
				published: true,
			},
		});
		return res.status(StatusCodes.OK).json({
			success: true,
			posts: req.user ? includeIsAuthor(allPosts, req.user.id) : allPosts,
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

const getParticularPost = async (req, res) => {
	let { postId } = req.params;
	postId = Number(postId);
	try {
		const particularPost = await prisma.post.findUnique({
			where: {
				id: postId,
			},
			include: {
				author: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		});
		return res.status(StatusCodes.OK).json({
			success: true,
			message: `Post with id ${postId} has been fetched`,
			post: particularPost,
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

const createNewPost = async (req, res) => {
	let { title, content, published } = req.body;
	published = !!published;
	try {
		await prisma.post.create({
			data: {
				title,
				content,
				published,
				authorId: req.user.id,
			},
		});
		return res.status(StatusCodes.CREATED).json({
			success: true,
			message: 'Created new post successfully',
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

const updateExistingPost = async (req, res) => {
	let { postId } = req.params;
	postId = Number(postId);
	const { title, content, published } = req.body;
	const updatedData = {};
	if (title) updatedData.title = title;
	if (content) updatedData.content = content;
	if (published) updatedData.published = !!published;
	try {
		await prisma.post.update({
			where: {
				id: postId,
			},
			data: updatedData,
		});
		return res.status(StatusCodes.OK).json({
			success: true,
			message: `Post with id ${postId} has been updated successfully`,
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

const deleteExistingPost = async (req, res) => {
	let { postId } = req.params;
	postId = Number(postId);
	try {
		await prisma.post.delete({
			where: {
				id: postId,
			},
		});
		return res.status(StatusCodes.OK).json({
			success: true,
			message: `Post with id ${postId} has been deleted successfully`,
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	getAllPosts,
	getParticularPost,
	createNewPost,
	updateExistingPost,
	deleteExistingPost,
};
