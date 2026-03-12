# BLOOD & ORGAN DONATION MANAGEMENT SYSTEM
## Final Year Project Report - Part 4

# CHAPTER 5
# IMPLEMENTATION

## 5.1 Implementation Strategy

The project was implemented using an iterative and incremental approach:

**Phase 1: Foundation (Weeks 1-2)**
- Project setup and environment configuration
- Database schema design and implementation
- Basic Express server setup
- React application initialization

**Phase 2: Core Features (Weeks 3-6)**
- User authentication system
- Blood donation module
- Blood inventory management
- Hospital management
- Basic admin panel

**Phase 3: Advanced Features (Weeks 7-10)**
- Organ donation module
- SOP integration
- AI assistant development
- Enhanced admin panel
- Request management

**Phase 4: Testing and Refinement (Weeks 11-12)**
- Unit testing
- Integration testing
- Bug fixes
- Performance optimization
- Documentation

## 5.2 Module Implementation

### 5.2.1 User Authentication Module

**Registration Implementation:**

```javascript
// Backend: routes/auth.js
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, blood_type, age, gender } = req.body;
    
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert user
      db.run(
        `INSERT INTO users (name, email, password, phone, blood_type, age, gender) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, phone, blood_type, age, gender],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Registration failed' });
          }
          
          // Generate JWT token
          const token = jwt.sign(
            { id: this.lastID, role: 'donor' },
            'secret_key',
            { expiresIn: '24h' }
          );
          
          res.status(201).json({
            token,
            user: { id: this.lastID, name, email, role: 'donor' }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

**Login Implementation:**

```javascript
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      // Generate token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        'secret_key',
        { expiresIn: '24h' }
      );
      
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

**Authentication Middleware:**

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Frontend Login Component:**

```javascript
// client/src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
```

### 5.2.2 Blood Donation Module

**Backend Implementation:**

```javascript
// routes/bloodDonations.js
router.post('/blood-donations', auth, (req, res) => {
  const { hospital_id, blood_type, quantity, donation_date } = req.body;
  const donor_id = req.user.id;
  
  // Calculate expiry date (35 days from donation)
  const expiryDate = new Date(donation_date);
  expiryDate.setDate(expiryDate.getDate() + 35);
  
  // Insert donation record
  db.run(
    `INSERT INTO blood_donations 
     (donor_id, hospital_id, blood_type, quantity, donation_date, expiry_date) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [donor_id, hospital_id, blood_type, quantity, donation_date, expiryDate.toISOString().split('T')[0]],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to record donation' });
      }
      
      // Update inventory
      db.run(
        `INSERT INTO blood_inventory (blood_type, quantity, expiry_date, hospital_id)
         VALUES (?, ?, ?, ?)`,
        [blood_type, quantity, expiryDate.toISOString().split('T')[0], hospital_id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update inventory' });
          }
          res.status(201).json({ message: 'Donation recorded successfully' });
        }
      );
    }
  );
});

router.get('/blood-donations', auth, (req, res) => {
  const query = req.user.role === 'admin'
    ? `SELECT bd.*, u.name as donor_name, h.name as hospital_name 
       FROM blood_donations bd
       JOIN users u ON bd.donor_id = u.id
       JOIN hospitals h ON bd.hospital_id = h.id
       ORDER BY bd.donation_date DESC`
    : `SELECT bd.*, h.name as hospital_name 
       FROM blood_donations bd
       JOIN hospitals h ON bd.hospital_id = h.id
       WHERE bd.donor_id = ?
       ORDER BY bd.donation_date DESC`;
  
  const params = req.user.role === 'admin' ? [] : [req.user.id];
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch donations' });
    }
    res.json(rows);
  });
});
```

**Frontend Component:**

```javascript
// client/src/DonateBlood.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DonateBlood() {
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    hospital_id: '',
    blood_type: '',
    quantity: 1,
    donation_date: new Date().toISOString().split('T')[0]
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/hospitals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHospitals(response.data);
    } catch (error) {
      console.error('Failed to fetch hospitals');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/blood-donations', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Donation recorded successfully!');
      setFormData({
        hospital_id: '',
        blood_type: '',
        quantity: 1,
        donation_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      setMessage('Failed to record donation');
    }
  };

  return (
    <div className="donate-blood-container">
      <h2>Donate Blood</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <select
          value={formData.hospital_id}
          onChange={(e) => setFormData({...formData, hospital_id: e.target.value})}
          required
        >
          <option value="">Select Hospital</option>
          {hospitals.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
        
        <select
          value={formData.blood_type}
          onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
          required
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        
        <input
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          placeholder="Quantity (units)"
          required
        />
        
        <input
          type="date"
          value={formData.donation_date}
          onChange={(e) => setFormData({...formData, donation_date: e.target.value})}
          required
        />
        
        <button type="submit">Record Donation</button>
      </form>
    </div>
  );
}

export default DonateBlood;
```

### 5.2.3 Organ Donation Module

**Database Schema:**

```sql
CREATE TABLE organ_donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id INTEGER,
  hospital_id INTEGER,
  organ_type TEXT NOT NULL,
  medical_diseases TEXT,
  allergies TEXT,
  blood_pressure TEXT,
  diabetes TEXT,
  current_medications TEXT,
  previous_surgeries TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  consent_sop_accepted INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  donation_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
```

**Backend Route:**

```javascript
router.post('/organ-donations', auth, (req, res) => {
  const {
    hospital_id,
    organ_type,
    medical_diseases,
    allergies,
    blood_pressure,
    diabetes,
    current_medications,
    previous_surgeries,
    emergency_contact_name,
    emergency_contact_phone,
    consent_sop_accepted
  } = req.body;
  
  const donor_id = req.user.id;
  
  db.run(
    `INSERT INTO organ_donations 
     (donor_id, hospital_id, organ_type, medical_diseases, allergies, 
      blood_pressure, diabetes, current_medications, previous_surgeries,
      emergency_contact_name, emergency_contact_phone, consent_sop_accepted)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [donor_id, hospital_id, organ_type, medical_diseases, allergies,
     blood_pressure, diabetes, current_medications, previous_surgeries,
     emergency_contact_name, emergency_contact_phone, consent_sop_accepted],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to register organ donation' });
      }
      
      // Update user as organ donor
      db.run(
        `UPDATE users SET organ_donor = 1, organs_to_donate = ? WHERE id = ?`,
        [organ_type, donor_id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update user' });
          }
          res.status(201).json({ message: 'Organ donation registered successfully' });
        }
      );
    }
  );
});
```

### 5.2.4 Hospital Management Module

**Backend Implementation:**

```javascript
// routes/hospitals.js
router.get('/hospitals', auth, (req, res) => {
  db.all('SELECT * FROM hospitals WHERE status = "active"', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch hospitals' });
    }
    res.json(rows);
  });
});

router.post('/hospitals', auth, adminOnly, (req, res) => {
  const { name, address, phone, email, license_number } = req.body;
  
  db.run(
    `INSERT INTO hospitals (name, address, phone, email, license_number)
     VALUES (?, ?, ?, ?, ?)`,
    [name, address, phone, email, license_number],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add hospital' });
      }
      res.status(201).json({ id: this.lastID, message: 'Hospital added successfully' });
    }
  );
});

router.put('/hospitals/:id', auth, adminOnly, (req, res) => {
  const { name, address, phone, email, license_number } = req.body;
  const { id } = req.params;
  
  db.run(
    `UPDATE hospitals 
     SET name = ?, address = ?, phone = ?, email = ?, license_number = ?
     WHERE id = ?`,
    [name, address, phone, email, license_number, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update hospital' });
      }
      res.json({ message: 'Hospital updated successfully' });
    }
  );
});

router.delete('/hospitals/:id', auth, adminOnly, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM hospitals WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete hospital' });
    }
    res.json({ message: 'Hospital deleted successfully' });
  });
});
```

---
