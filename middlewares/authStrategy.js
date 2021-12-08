const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma-config');

const authProtection = (req, res, next) => {
	const token = req.header('Authorization').split(' ')[1];
	if (!!!token) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			success: false,
			message: 'Access denied without access token',
		});
	}
	try {
		const verifiedUserId = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN).userId;
		req.user = await prisma.user.findUnique({
			where: {
				id: verifiedUserId,
			},
		});
		next();
	} catch (error) {
		res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = { authProtection };
