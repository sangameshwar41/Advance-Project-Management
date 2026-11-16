# Advanced Project & Team Management System

## Project Overview

The Advanced Project & Team Management System is a MERN stack web application designed to manage projects, tasks, team members, comments, and project activities.

It provides role-based access for Admins, Project Managers, and Team Members.

## Technologies Used

### Frontend

- React.js
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- express-validator

## Main Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Project creation, viewing, updating, and deletion
- Task creation, assignment, updating, and deletion
- Task priorities and status management
- Task comments
- Activity logs
- Dashboard statistics
- Search, filtering, sorting, and pagination
- Input validation and error handling

## User Roles

### Admin

- Manage users
- View and manage all projects and tasks

### Project Manager

- Create and manage their own projects
- Manage tasks within their projects

### Team Member

- View assigned tasks
- Access permitted project information
- Add comments to accessible tasks

## Project Structure

```text
Advanced-Project-Management/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── .env.example
│   ├── app.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── routes/
│       └── utils/
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sangameshwar41/Advance-Project-Management.git
```

### 2. Backend Setup

```bash
cd Advance-Project-Management/backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Start the Backend

```bash
node server.js
```

The backend runs on:

`http://localhost:5000`

### 4. Frontend Setup

Open another terminal:

```bash
cd Advance-Project-Management/frontend
npm install
npm run dev
```

The frontend development server runs on:

`http://localhost:5173`

## API Routes

| Method | Endpoint                    | Purpose            |
| ------ | --------------------------- | ------------------ |
| POST   | /api/users/register         | Register user      |
| POST   | /api/users/login            | Login user         |
| GET    | /api/users                  | Get users          |
| GET    | /api/projects               | Get projects       |
| POST   | /api/projects               | Create project     |
| GET    | /api/task                   | Get tasks          |
| POST   | /api/task                   | Create task        |
| GET    | /api/dashboard              | Get dashboard data |
| GET    | /api/activity-logs          | Get activity logs  |
| GET    | /api/tasks/:taskId/comments | Get task comments  |
| POST   | /api/tasks/:taskId/comments | Add task comment   |

Protected routes require a valid JWT authentication token.

## Database

MongoDB is used as the database.

Main collections:

- Users
- Projects
- Tasks
- Comments
- ActivityLogs

## Security

- Password hashing using bcryptjs
- JWT-based authentication
- Role-based authorization
- Environment variables for sensitive configuration
- Request validation

## Author

Developed as a MERN Stack Development project.
