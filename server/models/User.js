const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, index: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['resident','official','admin'], default: 'resident' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);