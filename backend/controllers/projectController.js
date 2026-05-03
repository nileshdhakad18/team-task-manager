const Project = require('../models/Project');
const Activity = require('../models/Activity');

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user.id }).populate('members', 'name email');
    }

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email');
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (req.user.role !== 'Admin' && !project.members.find(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ success: false, error: 'Not authorized to access this project' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    await Activity.create({
      action: 'Project created',
      user: req.user.id,
      project: project._id,
      description: `created project '${project.name}'`
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await project.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
