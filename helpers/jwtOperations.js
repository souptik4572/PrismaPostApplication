require('dotenv').config()
const jwt = require('jsonwebtoken');

const { ACCESS_SECRET_TOKEN } = process.env;

const verifyJwt = (token) => jwt.verify(token, ACCESS_SECRET_TOKEN);

const createJwt = (data, expiry = '3 days') =>
	jwt.sign(data, ACCESS_SECRET_TOKEN, {
		expiresIn: expiry,
	});

module.exports = {
	verifyJwt,
	createJwt,
};
