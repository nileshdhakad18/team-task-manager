const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline']
  },
  members: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Cascade delete tasks when a project is deleted
ProjectSchema.pre('remove', async function(next) {
  await this.model('Task').deleteMany({ project: this._id });
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
