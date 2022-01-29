const { StatusCodes } = require('http-status-codes');
const { verifyJwt } = require('../helpers/jwtOperations');
const prisma = require('../config/prisma-config');

const authProtection =
	(isJwtRequired = true) =>
	async (req, res, next) => {
		try {
			const token = req.header('Authorization').split(' ')[1];
			if (!!!token) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					success: false,
					message: 'Access denied without access token',
				});
			}
			req.user = await prisma.user.findUnique({
				where: {
					id: verifyJwt(token).userId,
				},
				select: {
					id: true,
					profile: true,
				},
			});
			next();
		} catch (error) {
			if (error instanceof TypeError) {
				if (!isJwtRequired) {
					next();
					return;
				}
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
