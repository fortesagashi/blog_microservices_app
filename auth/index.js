require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// create express app
const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));
app.use(express.json());

// connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/myapp', { useNewUrlParser: true })
  .then(() => console.log('Connected to database'))
  .catch(error => console.log(error));

// create user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// hash password before saving to database
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, function (error, hashedPassword) {
    if (error) return next(error);
    user.password = hashedPassword;
    next();
  });
});

// create user model
const User = mongoose.model('User', userSchema);

// create API endpoint for user registration
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// create API endpoint for user login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    res.json({ token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// create protected API endpoint
app.get('/protected', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized Access' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized Access' });
    }

    return res.json({ email });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// start express app
app.listen(4002, () => {
  console.log('Server started on http://localhost:4002');
});
