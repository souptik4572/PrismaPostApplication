const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPosts = async () => {
	const allPosts = await prisma.post.findMany();
	return allPosts;
};

const getAllUsers = async () => {
	const allUsers = await prisma.user.findMany();
	return allUsers;
};

const createNewUser = async () => {
	const newUser = await prisma.user.create({
		data: {
			name: 'Souptik Sarkar',
			email: 'souptiksarkar4572@gmail.com',
			posts: {
				create: {
					title: 'Hello everyone, I am Souptik',
				},
			},
			profile: {
				create: {
					bio: 'I like cooking',
				},
			},
		},
	});
	return newUser;
};

// createNewUser()
// 	.then((newUser) => {
// 		console.log(newUser);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

// getAllUsers()
// 	.then((allUsers) => {
// 		console.log(allUsers);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

getAllPosts()
	.then((allPosts) => {
		console.log(allPosts);
	})
	.catch((error) => {
		console.log(error);
	});
