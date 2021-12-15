const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma-config');

const authProtection = async (req, res, next) => {
	try {
		const token = req.header('Authorization').split(' ')[1];
		if (!!!token) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: 'Access denied without access token',
			});
		}
		const verifiedUserId = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN).userId;
		req.user = await prisma.user.findUnique({
			where: {
				id: verifiedUserId,
			},
			select: {
				id: true,
				profile: true,
			},
		});
		next();
	} catch (error) {
		if (error instanceof TypeError) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: "Didn't receive JSON Web Token for authorization",
			});
		}
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = { authProtection };
