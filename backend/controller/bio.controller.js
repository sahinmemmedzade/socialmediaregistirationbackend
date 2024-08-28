import Bio from '../model/bio.model.js';
import User from '../model/auth.model.js';

// Bio əlavə et
export const addBio = async (req, res) => {
  try {
    const { userId } = req.params; // userId params-dan alınır
    const { bio } = req.body;

    // İlk olaraq userId olan istifadəçini yoxlayın
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'İstifadəçi tapılmadı' });
    }

    // İstifadəçinin artıq bir bio məlumatı olub olmadığını yoxlayın
    const existingBio = await Bio.findOne({ userId });

    if (existingBio) {
      return res.status(400).json({ error: 'İstifadəçinin artıq bir bio məlumatı var' });
    }

    // Yeni bio məlumatını yaradın
    const newBio = new Bio({ userId: user._id, bio });
    await newBio.save();

    res.status(201).json({ message: 'Bio uğurla əlavə edildi', bio: newBio });
  } catch (error) {
    console.error(`Bio əlavə edilərkən xəta: ${error.message}`);
    res.status(500).json({ error: 'Daxili Server Xətası' });
  }
};


// Bio yenilə
export const updateBio = async (req, res) => {
  try {
    const { userId } = req.params; // userId params-dan alınır
    const { bio } = req.body;

    // İlk olaraq userId olan istifadəçini yoxlayın
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'İstifadəçi tapılmadı' });
    }

    // Mövcud bio məlumatını tapın və yeniləyin
    const existingBio = await Bio.findOne({ userId });

    if (!existingBio) {
      return res.status(404).json({ error: 'Bio tapılmadı' });
    }

    existingBio.bio = bio;
    await existingBio.save();

    res.status(200).json({ message: 'Bio uğurla yeniləndi', bio: existingBio });
  } catch (error) {
    console.error(`Bio yenilənərkən xəta: ${error.message}`);
    res.status(500).json({ error: 'Daxili Server Xətası' });
  }
};

// Bio əldə et
export const getBio = async (req, res) => {
  try {
    const { userId } = req.params;

    const bio = await Bio.findOne({ userId });

    if (!bio) {
      return res.status(404).json({ error: 'Bio tapılmadı' });
    }

    res.status(200).json({ bio });
  } catch (error) {
    console.error(`Bio əldə edilərkən xəta: ${error.message}`);
    res.status(500).json({ error: 'Daxili Server Xətası' });
  }
};

