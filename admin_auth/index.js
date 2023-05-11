require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(cors({ 
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));
app.use(express.json());

// connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/admin', { useNewUrlParser: true })
  .then(() => console.log('Connected to database'))
  .catch(error => console.log(error));

// create admin schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// hash password before saving to database
adminSchema.pre('save', function (next) {
  const admin = this;
  if (!admin.isModified('password')) return next();
  bcrypt.hash(admin.password, 10, function (error, hashedPassword) {
    if (error) return next(error);
    admin.password = hashedPassword;
    next();
  });
});

// create admin model
const Admin = mongoose.model('Admin', adminSchema);

// create API endpoint for admin login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET);
    res.json({ token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// create protected API endpoint
app.get('/protected', (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized Access' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { adminId } = decoded;

    return res.json({ message: `Protected data for admin ${adminId}` });
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized Access' });
      }
});


  // start express app
app.listen(4003, () => {
  console.log('Server started on http://localhost:4003');
});
