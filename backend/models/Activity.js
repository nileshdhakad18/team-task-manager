const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
  },
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);
