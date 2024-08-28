import Age from '../model/age.model.js';
import User from '../model/auth.model.js'; // İstifadəçi modelini idxal edin

// Yaş məlumatını əlavə etmək üçün controller
export const addAge = async (req, res) => {
    try {
        const { userId } = req.params;
        const { birthDate } = req.body; // Doğum tarixini body-dən alın

        // İstifadəçi tapılır
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        }

        // Mövcud yaş məlumatını tap və yenilə (əgər varsa)
        let existingAge = await Age.findOne({ userId });
        if (existingAge) {
            existingAge.birthDate = birthDate;
            await existingAge.save();
        } else {
            // Yeni yaş məlumatını əlavə et
            existingAge = new Age({ userId, birthDate });
            await existingAge.save();
        }

        res.status(200).json({ message: 'Yaş məlumatı uğurla əlavə olundu', age: existingAge });
    } catch (error) {
        console.error(`Yaş əlavə etmə xətası: ${error.message}`);
        res.status(500).json({ message: 'Server xətası', error });
    }
};


