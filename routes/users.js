const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/users');
const { authProtection } = require('../middlewares/authStrategy');

router.put('/register', registerUser);

router.post('/login', loginUser);

module.exports = router;
