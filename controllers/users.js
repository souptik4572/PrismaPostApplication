const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma-config');

const registerUser = (req, res) => {
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
		return res.status(StatusCodes.CREATED).json({
			success: true,
			message: 'Successfully registered new user in the database',
			user: newUser,
		});
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: error.message,
		});
	}
};

const loginUser = (req, res) => {
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
		const token = jwt.sign({ userId: existingUser.id }, process.env.ACCESS_SECRET_TOKEN, {
			expiresIn: '3 days',
		});
		return res.status(StatusCodes.CREATED).json({
			success: true,
			token,
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
};
