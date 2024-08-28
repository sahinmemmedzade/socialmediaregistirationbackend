import mongoose from 'mongoose';

const ageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    birthDate: { type: Date, required: true } // İstifadəçinin doğum tarixi
});

export default mongoose.model('Age', ageSchema);
