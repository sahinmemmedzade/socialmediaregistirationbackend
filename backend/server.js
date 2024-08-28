import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import Biorouter from './router/bio.router.js'
import cors from 'cors';
import Authrouter from './router/auth.router.js'
import ProfilRouter from './router/porfolio.router.js'
import ProfilepicRouter from './router/profilepic.router.js'
import GenderRouter from './router/gender.router.js'
import AgeRouter from './router/age.router.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MongoDB_url = process.env.MONGODB_URL;

// Multer konfiqurasiyası
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images/Profilepic'); // Profil şəkillərinin saxlanacağı qovluq
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Fayl adını zaman damğası ilə təyin edir
    }
});
const upload = multer({ storage: storage });

const httpServer = createServer(app);

// Middleware
app.use(cookieParser());
app.use(express.static('./'));
app.use(express.json());
app.use(cors());

// Router-ləri qeyd edin
app.use('/api/auth', Authrouter);
app.use('/api/bio', Biorouter);
app.use('/api/profile', ProfilRouter);
app.use('/api/profilepic', ProfilepicRouter(upload)); // Multer-i router-ə ötürün
app.use('/api/gender', GenderRouter);
app.use('/api/age', AgeRouter);

httpServer.listen(PORT, () => {
    mongoose.connect(MongoDB_url).then(() => {
        console.log(`Database connected and server listening on ${PORT}`);
    }).catch((error) => {
        console.error('MongoDB connection error:', error);
    });
});
