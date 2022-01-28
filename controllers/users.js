const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const { createJwt } = require('../helpers/jwtOperations');
const prisma = require('../config/prisma-config');

const registerUser = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (existingUser) {
			return res.status(StatusCodes.CONFLICT).json({
				success: false,
				message: 'User with given email id already exists',
			});
		}
		const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
		const token = createJwt({ userId: newUser.id });
		return res.status(StatusCodes.CREATED).json({
			success: true,
			message: 'Successfully registered new user in the database',
			token,
		});
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: error.message,
		});
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!!!existingUser) {
			return res.status(StatusCodes.NOT_FOUND).json({
				success: false,
				message: 'User with given email id does not exist',
			});
		}
		const isPasswordValid = await bcrypt.compare(password, existingUser.password);
		if (!isPasswordValid) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: 'Passwords do not match',
			});
		}
		const token = createJwt({ userId: existingUser.id });
		return res.status(StatusCodes.CREATED).json({
			success: true,
			message: 'Login is successfull',
			token,
		});
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: error.message,
		});
	}
};

const getProfile = async (req, res) => {
	try {
		const requiredUser = await prisma.user.findUnique({
			where: {
				id: req.user.id,
			},
			select: {
				name: true,
				email: true,
				profile: {
					select: {
						bio: true,
					},
				},
			},
		});
		return res.status(StatusCodes.OK).json({
			success: true,
			message: `The profile of user with id ${req.user.id}`,
			profile: requiredUser,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: error.message,
		});
	}
};

const updateProfile = async (req, res) => {
	const { bio } = req.body;
	try {
		let updatedProfile;
		console.log(req.user.profile);
		if (req.user.profile === null) {
			updatedProfile = await prisma.profile.create({
				data: {
					bio,
					userId: req.user.id,
				},
			});
		} else {
			updatedProfile = await prisma.profile.update({
				where: {
					userId: req.user.id,
				},
				data: {
					bio,
				},
			});
		}
		return res.status(StatusCodes.OK).json({
			success: true,
			message: 'Profile bio has been updated successfully',
		});
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	registerUser,
	loginUser,
	getProfile,
	updateProfile,
};
