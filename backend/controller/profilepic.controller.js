// controller/profilePic.controller.js
import ProfilePic from '../model/profilepic.module.js';
import User from '../model/auth.model.js'; // İstifadəçi modelini idxal edin
import path from 'path'
import fs from 'fs';

// Profil şəkilini yükləmək üçün controller
// profilepic.controller.js
export const uploadProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;
        const file = req.file;

        console.log('Yüklənən fayl:', file); // Faylı yoxlamaq üçün log

        if (!file) {
            return res.status(400).json({ message: 'Şəkil yüklənmədi' });
        }

        // İstifadəçi tapılır
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        }

        // Profil şəkilini bazaya əlavə edirik
        const profilePic = new ProfilePic({
            userId,
            path: file.path
        });

        await profilePic.save();

        res.status(200).json({ message: 'Profil şəkli uğurla yükləndi', file: file.path });
    } catch (error) {
        console.error(`Şəkil yükləmə xətası: ${error.message}`);
        res.status(500).json({ message: 'Server xətası', error });
    }
};
// Profil şəkilini yeniləmək üçün controller
export const updateProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;
        const file = req.file;

        console.log('Yüklənən fayl:', file); // Faylı yoxlamaq üçün log

        if (!file) {
            return res.status(400).json({ message: 'Şəkil yüklənmədi' });
        }

        // İstifadəçi tapılır
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        }

        // Mövcud profil şəklini tap və sil
        const existingProfilePic = await ProfilePic.findOne({ userId });
        if (existingProfilePic) {
            // Faylın silinməsi (istəyə bağlı)
            // fs.unlink(existingProfilePic.path, (err) => {
            //     if (err) console.error(`Fayl silinə bilmədi: ${err.message}`);
            // });
            
            // Mövcud profil şəklini bazadan silirik
            await ProfilePic.deleteOne({ userId });
        }

        // Yeni profil şəklini bazaya əlavə edirik
        const newProfilePic = new ProfilePic({
            userId,
            path: file.path
        });

        await newProfilePic.save();

        res.status(200).json({ message: 'Profil şəkli uğurla yeniləndi', file: file.path });
    } catch (error) {
        console.error(`Şəkil yeniləmə xətası: ${error.message}`);
        res.status(500).json({ message: 'Server xətası', error });
    }
};
export const deleteProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;

        // İstifadəçi tapılır
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        }

        // Mövcud profil şəklini tap və sil
        const profilePic = await ProfilePic.findOne({ userId });
        if (!profilePic) {
            return res.status(404).json({ message: 'Profil şəkli tapılmadı' });
        }

        // Faylın silinməsi (istəyə bağlı)
        const filePath = path.resolve(profilePic.path);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Fayl silinə bilmədi: ${err.message}`);
            }
        });

        // Profil şəklini bazadan silirik
        await ProfilePic.deleteOne({ userId });

        res.status(200).json({ message: 'Profil şəkli uğurla silindi' });
    } catch (error) {
        console.error(`Profil şəkli silmə xətası: ${error.message}`);
        res.status(500).json({ message: 'Server xətası', error });
    }
};





