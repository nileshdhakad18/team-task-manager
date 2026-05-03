const Task = require('../models/Task');
const Activity = require('../models/Activity');
const Project = require('../models/Project');

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    let taskQuery = {};
    if (req.user.role !== 'Admin') {
      taskQuery.assignedTo = req.user.id;
    }

    const tasks = await Task.find(taskQuery);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'To Do' || task.status === 'In Progress').length;
    
    const now = new Date();
    const overdueTasks = tasks.filter(task => new Date(task.deadline) < now && task.status !== 'Completed').length;

    // Fetch Recent Activity
    let activityQuery = {};
    if (req.user.role !== 'Admin') {
      const userProjects = await Project.find({ members: req.user.id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      activityQuery = { $or: [{ user: req.user.id }, { project: { $in: projectIds } }] };
    }
    
    const recentActivity = await Activity.find(activityQuery)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        recentActivity
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
