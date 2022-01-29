const router = require('express').Router();
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/users');
const { authProtection } = require('../middlewares/authStrategy');

router.put('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authProtection(), getProfile);

router.patch('/profile', authProtection(), updateProfile);

module.exports = router;
