# QuizQuest - Authentication System Backend

A robust Node.js backend authentication system for QuizQuest with JWT token-based security and MongoDB integration, supporting both student and teacher accounts.

---

## Features

### User Registration

* Client-side input validation
* Server-side data validation
* Secure password hashing (bcrypt)
* MongoDB persistence
* Automatic redirection to login page after successful registration

### User Login

* Client-side form validation
* Server-side credential verification
* JWT token generation and secure storage
* Dashboard redirection with user data

### Dashboard Access Control

* Token-based authentication verification
* Protected route middleware
* Automatic redirect to login for invalid or missing tokens
* Dynamic data display from database
* Secure logout functionality

### Security Features

* Password hashing with bcrypt
* JWT token authentication
* Server-side input validation
* Protected route middleware

## Error Handling

* Invalid registration data
* Incorrect login credentials
* Missing/invalid tokens
* Database connection errors

---

## Tech Stack

* Backend: Node.js, Express.js
* Database: MongoDB
* Authentication: JSON Web Tokens (JWT)
* Password Hashing: Bcrypt

---

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Update .env with MongoDB URI and JWT secret
```

4. Start the server:

```bash
npm start
```

---
BackEnd/
├── src/
├   |── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/

│   ├── routes/
│   ├── services/
│   ├── utils/
└── app.js
└── index.js
└── tests


---

# API Endpoints

### POST `/signup`

* Registers a new user
* Validates input data
* Saves user to database
* Returns success message

### POST `/signup`

* Authenticates user credentials and log into the role-based Dashboard account
* Generates JWT token
* Returns user data and token


### GET `/current-user`

* Fetch the currently logged-in user’s details
* Protected: (Requires Authorization: Bearer <token> header)

---

## Testing

1. Register a new user and verify the database entry.
2. Login and check JWT token storage.
3. Access the role-based dashboard .
4. Try accessing the dashboard from a new browser (should redirect to login).
5. Test logout functionality.

---

Made with ❤️ by the QuizQuest-1 Team Section-C (008,031,178)
