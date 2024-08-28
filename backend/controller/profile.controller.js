import Bio from '../model/bio.model.js';
import User from '../model/auth.model.js';
import ProfilePic from '../model/profilepic.module.js';
import Gender from '../model/gender.model.js'; // Gender modelini idxal edin
import Age from '../model/age.model.js'
export const getUserProfile = async (req, res) => {
    try {
      const { userId } = req.params; // userId params-dan alınır
  
      // İstifadəçini əldə et
      const user = await User.findById(userId).select('-password'); // Şifrəni çıxarmaq üçün
      if (!user) {
        return res.status(404).json({ error: 'İstifadəçi tapılmadı' });
      }
  
      // İstifadəçinin bio məlumatını əldə et
      const bio = await Bio.findOne({ userId });
      const profilePic = await ProfilePic.findOne({ userId });
      const gender = await Gender.findOne({ userId }); // Gender məlumatını əldə et
      const age = await Age.findOne({ userId }); // Gender məlumatını əldə et

      res.status(200).json({ 
        user,
        bio: bio ? bio.bio : null,            
        profilePic: profilePic ? profilePic.path : null ,
        gender: gender ? gender.gender : null, // Cinsiyyət varsa göndər, yoxsa null göndər
               age: age ? age.birthDate : null // Cinsiyyət varsa göndər, yoxsa null göndər
      });
    } catch (error) {
      console.error(`İstifadəçi profilini əldə edərkən xəta: ${error.message}`);
      res.status(500).json({ error: 'Daxili Server Xətası' });
    }
  };