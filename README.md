# TeamTask

Simple full-stack project management app where users can create projects, assign tasks, and track progress.

## Live Demo
- Frontend: `[Vercel Link]`
- Backend: `[Railway Link]`

## Features
- Login / Signup with JWT
- Role-based access (`Admin`, `Member`)
- Create and manage projects
- Create, assign, and update tasks
- Dashboard with task stats

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas

## Project Structure
```bash
team-task-manager/
  frontend/
  backend/
```

## Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Optional `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## API (Overview)
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/projects`
- `GET /api/v1/tasks`
- `GET /api/v1/dashboard`

## Demo Credentials
- Admin: `admin@example.com` / `Admin@123`
- Member: `member@example.com` / `Member@123`

## Screenshots
- `[Add Login Screenshot]`
- `[Add Dashboard Screenshot]`
- `[Add Projects Screenshot]`

## Author
Your Name  
[GitHub](https://github.com/your-username) | [LinkedIn](https://linkedin.com/in/your-profile)
