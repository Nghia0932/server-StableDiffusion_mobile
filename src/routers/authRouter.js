const Router = require('express');
const {
    register,
    login,
    verification,
    resetPassword,
} = require('../controllers/authController');

const authRouter = Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/verification', verification);
authRouter.post('/resetPassword', resetPassword);
module.exports = authRouter;