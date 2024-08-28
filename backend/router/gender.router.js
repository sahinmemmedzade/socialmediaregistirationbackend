import express from 'express';
import { addGender, getGender } from '../controller/gender.controller.js';

const router = express.Router();

// Cinsiyyəti əlavə etmək (POST)
router.post('/:userId', addGender);

// Cinsiyyəti əldə etmək (GET)
router.get('/:userId', getGender);

export default router;
