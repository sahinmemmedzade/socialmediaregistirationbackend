import mongoose from 'mongoose';

const profilePicSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    path: { type: String, required: true }
});

export default mongoose.model('ProfilePic', profilePicSchema);
