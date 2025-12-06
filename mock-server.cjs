const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const JWT_SECRET = 'your-secret-key-for-development';

// In-memory storage replace with database in production
const users = [];

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ detail: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email.toLowerCase());
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hamro Rental Mock Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    users_count: users.length,
    users: users.map(u => ({ id: u.id, full_name: u.full_name, email: u.email, created_at: u.created_at }))
  });
});

// Register endpoint
app.post('/auth/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { full_name, email, password } = req.body;

    // Validation
    if (!full_name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({
        detail: 'Full name, email, and password are required'
      });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({
        detail: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
      console.log('User already exists');
      return res.status(400).json({
        detail: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      full_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      created_at: new Date().toISOString()
    };

    users.push(user);
    console.log('User created successfully:', { id: user.id, email: user.email });
    console.log('Total users:', users.length);

    // Return user data (without password)
    const { password: _, ...userResponse } = user;
    res.status(201).json(userResponse);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Login endpoint (OAuth2 style with form data)
app.post('/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        detail: 'Username and password are required'
      });
    }

    // Find user
    const user = findUserByEmail(username);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        detail: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({
        detail: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', user.email);

    res.json({
      access_token: token,
      token_type: 'bearer',
      expires_in: 86400 // 24 hours in seconds
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Get current user profile
app.get('/users/me', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.user_id);
    
    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }

    // Return user data (without password)
    const { password, ...userResponse } = user;
    res.json(userResponse);

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Update user profile
app.put('/users/me', authenticateToken, (req, res) => {
  try {
    const { full_name } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.user_id);
    
    if (userIndex === -1) {
      return res.status(404).json({ detail: 'User not found' });
    }

    // Update user data
    if (full_name) users[userIndex].full_name = full_name;
    users[userIndex].updated_at = new Date().toISOString();

    // Return updated user data (without password)
    const { password, ...userResponse } = users[userIndex];
    res.json(userResponse);

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Password validation endpoint
app.post('/auth/validate-password', (req, res) => {
  try {
    const { password, confirm_password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        detail: 'Password is required'
      });
    }

    const errors = [];
    const suggestions = [];
    
    // Check password strength
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
      suggestions.push('Use at least 8 characters');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
      suggestions.push('Add lowercase letters (a-z)');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
      suggestions.push('Add uppercase letters (A-Z)');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
      suggestions.push('Add numbers (0-9)');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
      suggestions.push('Add special characters (!@#$%^&*)');
    }

    // Check confirm password if provided
    if (confirm_password && password !== confirm_password) {
      errors.push('Passwords do not match');
    }

    const isValid = errors.length === 0;
    
    res.json({
      is_valid: isValid,
      errors: errors,
      suggestions: suggestions,
      strength_score: Math.min(4, 4 - errors.length)
    });

  } catch (error) {
    console.error('Password validation error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Mock endpoints for other features
app.get('/vehicles', (req, res) => {
  res.json({ message: 'Vehicles endpoint - to be implemented' });
});

app.get('/wishlist', authenticateToken, (req, res) => {
  res.json({ message: 'Wishlist endpoint - to be implemented' });
});

app.post('/contact', (req, res) => {
  res.json({ message: 'Contact message received', data: req.body });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ detail: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ detail: `Endpoint ${req.path} not found` });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(' Mock Backend Server running at http://127.0.0.1:' + PORT);
  console.log(' Dashboard: http://127.0.0.1:' + PORT + '/');
  console.log(' Configured for frontend: http://localhost:5173');
  console.log(' Available endpoints:');
  console.log('  POST /auth/register - Register user');
  console.log('  POST /auth/login - Login user');
  console.log('  POST /auth/validate-password - Validate password strength');
  console.log('  GET /users/me - Get user profile');
  console.log('  PUT /users/me - Update user profile');
  console.log(' Users will be stored in memory (reset on server restart)');
});

module.exports = app;