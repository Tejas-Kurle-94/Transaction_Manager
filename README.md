# Transaction Manager

A modern web application for managing personal finances and transactions.

## Features

- User authentication and authorization
- Transaction tracking (income and expenses)
- Transaction categorization
- Budget management
- Reports and analytics
- Responsive design
- REST API for external integrations

## Tech Stack

- Frontend: React + Vite, TailwindCSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- API Documentation: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js >= 16
- MongoDB >= 6.0
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your configuration
   - Make sure MongoDB is running and update MONGODB_URI if needed

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm run dev
   ```

## API Documentation

API documentation is available at `/api-docs` when running the backend server.

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS protection
- Rate limiting
- MongoDB injection prevention

# GitHub push commands
```
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Tejas-Kurle-94/Transaction_Manager.git
git push -u origin main
```