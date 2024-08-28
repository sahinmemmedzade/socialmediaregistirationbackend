import express from 'express';
import {getUserProfile } from '../controller/profile.controller.js';
const router = express.Router();

router.get('/:userId', getUserProfile);

export default router;
