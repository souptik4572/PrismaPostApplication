const includeIsAuthor = (posts, authorId = null) =>
	posts.map((aPost) => {
		const postWihoutAuthorId = {
			...aPost,
			isAuthor: aPost.authorId === authorId,
		};
		delete postWihoutAuthorId['authorId'];
		return postWihoutAuthorId;
	});

module.exports = {
	includeIsAuthor,
};
