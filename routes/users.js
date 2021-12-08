const router = require('express').Router();
const { registerUser, loginUser, updateProfile } = require('../controllers/users');
const { authProtection } = require('../middlewares/authStrategy');

router.put('/register', registerUser);

router.post('/login', loginUser);

router.patch('/profile', authProtection, updateProfile);

module.exports = router;
