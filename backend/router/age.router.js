import express from 'express';
import { addAge } from '../controller/age.controller.js';

const router = express.Router();

// Yaş məlumatını əlavə etmək (POST)
router.post('/:userId', addAge);

// Yaş məlumatını əldə etmək (GET)

export default router;
