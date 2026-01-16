Task Manager API 🚀

A Node.js, Express, and MongoDB based Task Management System that allows authenticated users to create, view, update, and delete tasks. The backend is integrated with a frontend application and supports basic task management functionality.

Implemented Features

User registration and login using JWT authentication

Secure password hashing using bcrypt

Create, read, update, and delete tasks

Tasks are associated with authenticated users

Input validation using Joi

RESTful API endpoints

Frontend and backend integration

Tech Stack
Backend

Node.js

Express.js

MongoDB (MongoDB Atlas)

Mongoose

JWT (JSON Web Tokens)

Joi

bcrypt

Frontend

React.js

Axios

CSS (framework or custom, as implemented)

Project Setup
1. Clone the Repository
git clone https://github.com/yourusername/task-manager.git
cd task-manager

2. Backend Setup
cd backend
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Start the backend server:

npm run dev

3. Frontend Setup
cd frontend
npm install
npm run dev


The frontend application will open in the browser and communicate with the backend API.

API Endpoints
Authentication

POST /api/auth/register – Register a new user

POST /api/auth/login – Login an existing user

Tasks (Protected Routes)

POST /api/tasks – Create a new task

GET /api/tasks – Get all tasks for the logged-in user

GET /api/tasks/:id – Get a single task

PUT /api/tasks/:id – Update a task

DELETE /api/tasks/:id – Delete a task

Demonstration

A recorded video demonstrates:

Running the application using npm run dev

Frontend loading in the browser

Creating a task

Updating a task

Deleting a task

Notes

Authentication is required to access task routes.

Each user can only access their own tasks.

This project focuses on core task management functionality.

Author

Arslan Akif Mehmood
BSCS – Software Development Intern