const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Get all tasks for a project or all tasks if Admin
// @route   GET /api/v1/projects/:projectId/tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let query;

    if (req.params.projectId) {
      query = Task.find({ project: req.params.projectId });
    } else {
      if (req.user.role === 'Admin') {
        query = Task.find();
      } else {
        query = Task.find({ assignedTo: req.user.id });
      }
    }

    const tasks = await query.populate('project', 'name').populate('assignedTo', 'name email');

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project', 'name').populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (req.user.role !== 'Admin' && task.assignedTo._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this task' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/v1/projects/:projectId/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    req.body.project = req.params.projectId;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const task = await Task.create(req.body);

    // Track creation
    await Activity.create({
      action: 'Task created',
      user: req.user.id,
      project: project._id,
      task: task._id,
      description: `created task '${task.title}'`
    });

    // Track assignment
    if (task.assignedTo) {
      const assignedUser = await User.findById(task.assignedTo);
      if (assignedUser) {
        await Activity.create({
          action: 'Task assigned',
          user: req.user.id,
          project: project._id,
          task: task._id,
          description: `assigned task '${task.title}' to ${assignedUser.name}`
        });
      }
    }

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const oldStatus = task.status;
    const oldAssignee = task.assignedTo.toString();

    // Members can only update status
    if (req.user.role !== 'Admin') {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Not authorized to update this task' });
      }
      // Restrict update to status only
      task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
        new: true,
        runValidators: true
      });
    } else {
      task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

    if (req.body.status && req.body.status !== oldStatus) {
      await Activity.create({
        action: 'Task status updated',
        user: req.user.id,
        project: task.project,
        task: task._id,
        description: `updated task '${task.title}' status to ${req.body.status}`
      });
    }

    if (req.body.assignedTo && req.body.assignedTo !== oldAssignee && req.user.role === 'Admin') {
      const assignedUser = await User.findById(req.body.assignedTo);
      if (assignedUser) {
        await Activity.create({
          action: 'Task assigned',
          user: req.user.id,
          project: task.project,
          task: task._id,
          description: `assigned task '${task.title}' to ${assignedUser.name}`
        });
      }
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    await task.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
