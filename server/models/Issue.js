const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: { type: String, enum: ['Road','Sewer','Streetlight','Garbage','Other'], default: 'Other' },
  images: [{ url: String, publicId: String, width: Number, height: Number }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', default: [0,0] }, // [lng, lat]
    address: String
  },
  status: { type: String, enum: ['Pending','In Progress','Resolved'], default: 'Pending' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  history: [{
    status: String,
    note: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);