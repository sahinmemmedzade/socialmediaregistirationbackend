import mongoose from 'mongoose';

const bioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // 'User' modelinə istinad edir
  },
  bio: {
    type: String,
    default: '',
    maxLength: 150,
    trim: true, // Boşluq silinir
  },
}, { timestamps: true });

export default mongoose.model('Bio', bioSchema);
