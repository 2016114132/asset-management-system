import express from 'express';
import { getLogin, postLogin, logout, showChangePassword, updatePassword } from '../controllers/authController';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', logout);

router.get('/change-password', showChangePassword);
router.post('/change-password', updatePassword);

export default router;
