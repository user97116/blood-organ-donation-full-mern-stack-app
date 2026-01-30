const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, blood_type, address, age, gender, organ_donor, organs_to_donate } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const organsJson = organs_to_donate ? JSON.stringify(organs_to_donate) : null;
    
    req.db.run(
      'INSERT INTO users (name, email, password, phone, blood_type, address, age, gender, organ_donor, organs_to_donate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, blood_type, address, age, gender, organ_donor ? 1 : 0, organsJson],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'User registered successfully', userId: this.lastID });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin register
router.post('/admin/register', async (req, res) => {
  try {
    const { name, email, password, phone, department, employee_id, hospital_id } = req.body;
    
    if (!name || !email || !password || !department || !employee_id || !hospital_id) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    req.db.run(
      'INSERT INTO users (name, email, password, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, 'admin', 'active'],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Admin registered successfully', userId: this.lastID });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  req.db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user.id, role: user.role }, 'your-secret-key');
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, blood_type: user.blood_type } });
  });
});

module.exports = router;
