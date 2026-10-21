const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.registerAdmin);
router.post('/change-password', authController.changePassword);
router.post('/update-profile', authController.updateProfile);
router.get('/verify', authController.verify);
router.get('/users', authController.getUsers);
router.delete('/users/:id', authController.deleteUser);
router.put('/users/:id/role', authController.updateUserRole);
router.get('/backup', authController.getBackupData);

module.exports = router;
