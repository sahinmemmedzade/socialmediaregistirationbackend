import Gender from '../model/gender.model.js';
import User from '../model/auth.model.js';

// Cinsiyyət əlavə etmək üçün controller
export const addGender = async (req, res) => {
    try {
        const { userId } = req.params;
        const { gender } = req.body;

        // İstifadəçi tapılır
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        }

        // Mövcud genderi tap və yenilə (əgər varsa)
        let existingGender = await Gender.findOne({ userId });
        if (existingGender) {
            existingGender.gender = gender;
            await existingGender.save();
        } else {
            // Yeni gender əlavə et
            existingGender = new Gender({ userId, gender });
            await existingGender.save();
        }

        res.status(200).json({ message: 'Cinsiyyət məlumatı uğurla əlavə olundu', gender: existingGender });
    } catch (error) {
        console.error(`Cinsiyyət əlavə etmə xətası: ${error.message}`);
        res.status(500).json({ message: 'Server xətası', error });
    }
};

// Cinsiyyət məlumatını əldə etmək üçün controller
export const getGender = async (req, res) => {
    try {
        const { userId } = req.params;

        // Cinsiyyət tapılır
        const gender = await Gender.findOne({ userId });
        if (!gender) {
            return res.status(404).json({ message: 'Cinsiyyət məlumatı tapılmadı' });
        }

        res.status(200).json({ gender: gender.gender });
    } catch (error) {
        console.error(`Cinsiyyət əldə etmə xətası: ${error.message}`);
        res.status(500).json({ message: 'Server xətası', error });
    }
};
