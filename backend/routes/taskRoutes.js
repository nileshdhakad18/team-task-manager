const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(authorize('Admin'), createTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(authorize('Admin'), deleteTask);

module.exports = router;
