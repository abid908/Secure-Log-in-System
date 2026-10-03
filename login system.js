require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const session = require('express-session');

// NOTE: This is only a demo. In real projects, use a real database like MySQL, PostgreSQL, or MongoDB.
const db = require('./mockDatabase');

const app = express();
const PORT = 3000;

// Allow the server to read JSON data from requests
app.use(express.json());

// Setup session so the user stays logged in after login
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_super_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  })
);

// Validate the user input before saving or checking it
const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.',
  }),
});

// --------------------------
// REGISTER NEW USER
// --------------------------
app.post('/register', async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    // In a real app, you would save this to a database here.
    // Example: INSERT INTO users (email, password) VALUES (?, ?)

    res.status(201).send('User registered successfully!');
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).send('Error registering user.');
  }
});

// --------------------------
// LOGIN USER
// --------------------------
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user using their email
    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(400).send('Invalid email or password.');
    }

    // Compare the typed password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send('Invalid email or password.');
    }

    // Save the user's ID in the session so they stay logged in
    req.session.userId = user.id;
    res.send('Logged in successfully!');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Error logging in.');
  }
});

// --------------------------
// LOGOUT USER
// --------------------------
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }

    // Clear the browser's session cookie
    res.clearCookie('connect.sid');
    res.send('Logged out successfully!');
  });
});

app.listen(PORT, () => {
  console.log(`Secure login server running on port ${PORT}`);
});
