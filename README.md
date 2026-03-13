# Todo API

A RESTful Todo API built with NestJS, MongoDB, and Mongoose.  
The API allows users to register, authenticate using JWT, and manage personal todos.

The project also includes interactive API documentation using Swagger.

---

# Features

- User registration
- User authentication with JWT
- Password hashing using bcrypt
- Protected routes using Passport
- Create, read, update, and delete todos
- Todos linked to authenticated users
- API documentation with Swagger

---

# Tech Stack

Backend: NestJS  
Database: MongoDB  
ODM: Mongoose  
Authentication: JWT + Passport  
Documentation: Swagger  

---

# Installation

Clone the repository

```bash
git clone https://github.com/Siewejoaquim/todo-web.git
```

Navigate into the project

```bash
cd todo-web
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run start:dev
```

---

# Environment Variables

Create a `.env` file in the root directory.

Example:

```
MONGO_URI=mongodb://localhost:27017/todo-db
JWT_SECRET=secretKey
PORT=3000
```

---

# API Documentation

Once the server is running, open:

```
http://localhost:3000/api
```

Swagger provides an interactive interface where you can test all endpoints.

---

# Authentication

The API uses JWT authentication.

Steps:

1. Register a user
2. Login with email and password
3. Receive an access token
4. Send the token in requests using:

```
Authorization: Bearer <token>
```

---

# API Endpoints

## Register User

POST /auth/register

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

---

## Login

POST /auth/login

Request body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "access_token": "JWT_TOKEN"
}
```

---

# Todo Endpoints (Protected)

All todo routes require authentication.

---

## Create Todo

POST /todos

Headers:

```
Authorization: Bearer <token>
```

Body:

```json
{
  "title": "Learn NestJS",
  "description": "Practice backend development"
}
```

---

## Get All Todos

GET /todos

Returns all todos belonging to the authenticated user.

---

## Get Single Todo

GET /todos/:id

---

## Update Todo

PATCH /todos/:id

Example body:

```json
{
  "title": "Updated Todo"
}
```

---

## Delete Todo

DELETE /todos/:id

---

# Project Structure

```
src
 ├── auth
 │   ├── auth.controller.ts
 │   ├── auth.service.ts
 │   ├── jwt.strategy.ts
 │   └── jwt-auth.guard.ts
 │
 ├── users
 │
 ├── todos
 │   ├── todos.controller.ts
 │   ├── todos.service.ts
 │   ├── dto
 │   └── schemas
 │
 └── main.ts
```

---

# Testing the API

You can test the API using:

- Postman
- Swagger UI

---

# Author

Natchop siewe