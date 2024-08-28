import mongoose from 'mongoose';

const genderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gender: { type: String, enum: ['kisi', 'qadin', 'basqa'], required: true }
});

export default mongoose.model('Gender', genderSchema);
