import bcrypt from 'bcrypt';
import User from '../model/auth.model.js';
import { genareteTokenandSetCookie } from '../midleware/generateTokenandSetCookie.js';

// Sign Up funksiyası
export const signUp = async (req, res) => {
    const { name, surname, username, email, password, confirmPassword } = req.body;

    const errors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const emailRegex = /^[\w-\.]+@[a-zA-Z_]+\.[a-zA-Z]{2,}$/;

    if (!name || !surname || !username || !email || !password || !confirmPassword) {
        errors.fields = "Bütün sahələri doldurun.";
    }
    if (password !== confirmPassword) {
        errors.confirmPassword = "Şifrələr uyğun gəlmir.";
    }
    if (!passwordRegex.test(password)) {
        errors.password = "Şifrə ən azı 6 simvoldan ibarət olmalı və ən azı bir böyük hərf, bir kiçik hərf və bir rəqəm içerməlidir.";
    }
    if (username.length < 3) {
        errors.username = "İstifadəçi adı ən azı 3 simvol olmalıdır.";
    }
    if (name.length < 3) {
        errors.name = "Ad ən azı 3 simvol olmalıdır.";
    }
    if (surname.length < 3) {
        errors.surname = "Soyad ən azı 3 simvol olmalıdır.";
    }
    if (!emailRegex.test(email)) {
        errors.email = "Yanlış e-mail ünvanı.";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            errors.fields = "E-mail və ya istifadəçi adı artıq mövcuddur.";
            return res.status(400).json({ errors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            surname,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        genareteTokenandSetCookie(newUser._id, res);  // Token yaradılması və cookie'ye yazılması
        res.status(201).json({ message: 'İstifadəçi uğurla qeydiyyatdan keçdi.', user: newUser });

    } catch (error) {
        console.error(`Sign Up xətası: ${error.message}`);
        res.status(500).json({ message: 'Server xətası.', error });
    }
};

// Login funksiyası
export const login = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
        if (!user) {
            return res.status(404).json({ message: 'İstifadəçi tapılmadı.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Yanlış parol.' });
        }

        genareteTokenandSetCookie(user._id, res);  // Token yaradılması və cookie'ye yazılması
        res.status(200).json({ message: 'Uğurla daxil olundu.', user });

    } catch (error) {
        console.error(`Login xətası: ${error.message}`);
        res.status(500).json({ message: 'Server xətası.', error });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("jwt");  
    res.status(200).send("Uğurla çıxış etdiniz.");
};

export const updatePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).send({ error: 'Bütün sahələri doldurun' });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).send({ error: 'Şifrələr uyğun gəlmir' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'İstifadəçi tapılmadı' });
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send({ error: 'Cari şifrə yanlışdır' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).send({ message: 'Şifrə müvəffəqiyyətlə yeniləndi' });
    } catch (error) {
        console.error(`Şifrə yeniləmə xətası: ${error.message}`);
        res.status(500).send({ error: 'Daxili Server Xətası' });
    }
};
