# Secure Login System 🛡️

A secure authentication and session management system built with Node.js and Express. This project demonstrates backend security best practices including password hashing, input validation, and secure cookie-based sessions.

## 🚀 Features

- **User Registration & Login**: Secure authentication flow.
- **Password Hashing**: Utilizes `bcrypt` to salt and hash passwords before storing them.
- **Input Validation**: Uses `joi` to validate incoming request data (e.g., email formatting, password strength) and prevent malicious input.
- **Session Management**: Implements `express-session` for secure, `httpOnly` cookie-based user sessions.
- **Route Protection**: Includes an example of a protected route that requires an active session to access.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Security & Validation**: Bcrypt, Joi
- **Session**: Express-Session
- **Environment**: Dotenv

## 💻 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/secure-login-system.git](https://github.com/yourusername/secure-login-system.git)
   cd secure-login-system