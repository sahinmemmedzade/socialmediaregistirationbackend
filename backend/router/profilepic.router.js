// profilepic.router.js
import express from 'express';
import { uploadProfilePicture,updateProfilePicture,deleteProfilePicture } from '../controller/profilepic.controller.js';

const router = express.Router();

const profilePicUpload = (upload) => {
    router.post('/:userId', upload.single('file'), uploadProfilePicture); // Multer middleware istifadə edin
    router.put('/:userId', upload.single('file'), updateProfilePicture);

    return router;
};
router.delete('/:userId', deleteProfilePicture);

export default profilePicUpload;
