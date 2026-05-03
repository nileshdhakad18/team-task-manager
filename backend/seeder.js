const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Activity = require('./models/Activity');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding data...');

    // 1 Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'Admin'
    });

    // 2 Members
    const member1 = await User.create({
      name: 'John Member',
      email: 'member1@test.com',
      password: 'password123',
      role: 'Member'
    });

    const member2 = await User.create({
      name: 'Jane Member',
      email: 'member2@test.com',
      password: 'password123',
      role: 'Member'
    });

    // 2 Projects
    const project1 = await Project.create({
      name: 'Website Redesign',
      description: 'Redesigning the corporate website',
      deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
      members: [admin._id, member1._id, member2._id]
    });

    const project2 = await Project.create({
      name: 'Mobile App Development',
      description: 'Building the new mobile app',
      deadline: new Date(new Date().setDate(new Date().getDate() + 60)),
      members: [admin._id, member1._id]
    });

    // 5 Tasks
    await Task.create({
      title: 'Design Homepage',
      description: 'Create Figma designs for the homepage',
      status: 'Completed',
      deadline: new Date(new Date().setDate(new Date().getDate() - 2)),
      project: project1._id,
      assignedTo: member1._id
    });

    await Task.create({
      title: 'Develop Homepage',
      description: 'Implement the homepage in React',
      status: 'In Progress',
      deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
      project: project1._id,
      assignedTo: member2._id
    });

    await Task.create({
      title: 'Setup Database',
      description: 'Setup MongoDB for the mobile app',
      status: 'To Do',
      deadline: new Date(new Date().setDate(new Date().getDate() + 10)),
      project: project2._id,
      assignedTo: admin._id
    });

    await Task.create({
      title: 'Create API endpoints',
      description: 'Build the REST API',
      status: 'To Do',
      deadline: new Date(new Date().setDate(new Date().getDate() - 1)), // Overdue
      project: project2._id,
      assignedTo: member1._id
    });

    await Task.create({
      title: 'Write Documentation',
      description: 'Document the API',
      status: 'To Do',
      deadline: new Date(new Date().setDate(new Date().getDate() + 20)),
      project: project1._id,
      assignedTo: member2._id
    });

    console.log('Data seeded successfully');
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
  }
};

module.exports = seedData;
