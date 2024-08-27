import express from 'express';
import { signUp, login,updatePassword,logout } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.patch('/:userId', updatePassword);
router.post("/logout",logout)
export default router;
