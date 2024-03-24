const Router = require('express');
const {
    postContent,
    getContentOneEmail,
} = require('../controllers/socialController');

const socialRouter = Router();
socialRouter.post('/postContent', postContent);
socialRouter.post('/getContentOneEmail', getContentOneEmail);

module.exports = socialRouter;