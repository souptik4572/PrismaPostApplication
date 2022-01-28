const prisma = require('../config/prisma-config');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../index');
const { StatusCodes } = require('http-status-codes');

chai.use(chaiHttp);

const commonUrl = '/api/users';

describe('User', () => {
	beforeEach((done) => {
		prisma.user.deleteMany({}, (err, res) => {
            console.log(res);
			done();
		});
	});
	describe('Register new user', () => {
		const user = {
			name: 'Asta Yuno',
			email: 'yunoasta6602@gmail.com',
			password: 'password',
		};
		it('Should register a new user in our database', (done) => {
			chai.request(app)
				.put(`${commonUrl}/register`)
				.send(user)
				.end((err, res) => {
					res.should.have.status(StatusCodes.CREATED);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
				done();
				});
		});
	});
});
