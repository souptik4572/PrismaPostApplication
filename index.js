const express = require('express');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
	res.json('This is the root route');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is up and running at http://localhost:${PORT}`);
});
