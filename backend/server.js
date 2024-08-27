import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import cors from 'cors';
import Authrouter from './router/auth.router.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MongoDB_url = process.env.MONGODB_URL;

const httpServer = createServer(app);

// Middleware
app.use(cookieParser());
app.use(express.static('./'));
app.use(express.json());
app.use(cors());

app.use('/api/auth', Authrouter);

httpServer.listen(PORT, () => {
    mongoose.connect(MongoDB_url).then(() => {
        console.log(`Database connected and server listening on ${PORT}`);
    }).catch((error) => {
        console.error('MongoDB connection error:', error);
    });
});
