import express from 'express';
import { addBio, updateBio, getBio } from '../controller/bio.controller.js';

const router = express.Router();

router.post('/:userId', addBio);

router.put('/:userId', updateBio);

router.get('/:userId', getBio);

export default router;
