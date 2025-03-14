# eCommerce Backend

This repository contains the backend code for the eCommerce application, built using **Node.js**, **Express**, and **MongoDB**. It serves as the backbone of the application, handling user authentication, product management, and order processing.

## Key Features
- **RESTful API**: Provides a set of well-defined endpoints to handle product listings, orders, and user-related operations.
- **User Authentication**: Secure user registration and login using **JWT (JSON Web Token)** for authentication and session management.
- **Product Management**: CRUD operations for products, including adding, updating, and deleting items.
- **Order Management**: Endpoints for handling orders, payments, and order history.
- **Database Integration**: Uses **MongoDB** for efficient data storage and retrieval with **Mongoose** for easy data modeling.
- **Payment Integration**: Integrates with **Razorpay** for secure payment processing and transaction management.

## Technologies Used
- **Node.js**: For building the server-side logic.
- **Express.js**: For creating a scalable RESTful API.
- **MongoDB & Mongoose**: For database operations and modeling data schemas.
- **JWT**: For secure authentication and authorization.
- **Razorpay**: For managing online payments and transactions.

## Setup Instructions
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables for database, Razorpay keys, and JWT secrets.
4. Start the server using `npm start`.
5. Ensure the frontend is configured to communicate with the backend for full functionality.

