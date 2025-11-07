const AdminAuthController = require('../controllers/adminAuth.controller');

const adminAuthRouter = require('express').Router();

adminAuthRouter.post('/signup', AdminAuthController.signup);
adminAuthRouter.post('/signin', AdminAuthController.signin);
adminAuthRouter.get('/refresh', AdminAuthController.refresh);
adminAuthRouter.delete('/signout', AdminAuthController.signout);

module.exports = adminAuthRouter;
