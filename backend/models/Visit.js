const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }
  ],
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    default: null
  },
  status: {
    type: String,
    enum: ['prepared', 'active', 'ended'],
    default: 'prepared'
  }
}, { timestamps: true });

module.exports = mongoose.model('Visit', VisitSchema);
