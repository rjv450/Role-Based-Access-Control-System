# Task: Building a Role-Based Access Control System with Real-Time Notifications

Build a RESTful API that allows users to register, login, and access resources based on their roles (admin, user). The system supports real-time notifications using WebSockets.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Database](#database)

## Setup Instructions

### Prerequisites

- Node.js (>=14.0.0)
- MongoDb (or a compatible database)
- Environment variables for configuration

### Installation

1. **Clone the Repository**

   
bash
   git clone https://github.com/rjv450/Role-Based-Access-Control-System.git
   cd Role-Based-Access-Control-System/backend

2. **Install Dependencies**
bash
   npm install

3. **Configure Environment Variables**

   Create a .env file in the root directory of the project and add the following variables:
   
MONGO_URI=mongodb://localhost:27017/comment-rb
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
PORT=port number


4. **Start the Servers**
bash
   npm run start

5. **Run Tests**
bash
   npm run test

After running the tests, Jest will generate a coverage directory in your project's root folder. Inside this coverage folder, you'll find an index.html file.



## Running Real-Time Notifications
Before running the frontend application, you need to set up the environment and install the necessary dependencies. Here’s how to do it:

1. **Navigate to the Frontend Directory**
bash
   cd Role-Based-Access-Control-System/frontend

2. **Install Dependencies**
bash
   npm install

3. **Configure Environment Variables**
Create a .env file in the frontend directory with the following content:

VITE_API_URI="http://localhost:3000"


4. **Run the Frontend Application**
bash
   npm run dev


## API Documentation

Swagger API Documentation
Swagger provides interactive API documentation. To access the API documentation for this project:

1. **Access Swagger UI**
Open your web browser and navigate to:

bash
http://localhost:3000/api-docs


## Database

Mongoose Models

User
The User model represents a user in the system. It includes:

email: The user's email address. This field is required and must be unique.
password: The user's password. This field is required and hashed before saving.
role: The role of the user, which can be 'Admin', 'Moderator', or 'User'. Defaults to 'User'.

Post
The Post model represents a post that can have multiple comments. It includes:

title: The title of the post. This field is required.
content: The content of the post. This field is required.
author: Reference to the User who authored the post. This field is required.
comments: Array of references to Comment documents.


Comment
The Comment model represents a comment on a post. It includes:

content: The content of the comment. This field is required.
author: Reference to the User who wrote the comment. This field is required.
post: Reference to the Post that the comment belongs to. This field is required.