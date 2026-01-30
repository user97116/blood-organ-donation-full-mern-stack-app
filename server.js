const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const { insertDummyData } = require('./data/dummyData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = initializeDatabase();

// Add database to request object
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Force insert dummy data after tables are created
setTimeout(() => {
  console.log('🔄 Inserting dummy data...');
  insertDummyData(db);
}, 1000);

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/hospitals', require('./routes/hospitals'));

// Users management (admin)
app.get('/api/users', (req, res) => {
  db.all('SELECT id, name, email, phone, blood_type, role, status, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/users/:id', (req, res) => {
  const { role, status } = req.body;
  db.run('UPDATE users SET role = ?, status = ? WHERE id = ?', [role, status, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'User updated successfully' });
  });
});

// Doctors management
app.get('/api/doctors', (req, res) => {
  db.all(`SELECT d.*, h.name as hospital_name 
          FROM doctors d 
          LEFT JOIN hospitals h ON d.hospital_id = h.id 
          ORDER BY d.created_at DESC`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/doctors', (req, res) => {
  const { name, email, phone, specialization, hospital_id, license_number } = req.body;
  db.run('INSERT INTO doctors (name, email, phone, specialization, hospital_id, license_number) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone, specialization, hospital_id, license_number], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Doctor added successfully', id: this.lastID });
    });
});

// Blood donations
app.get('/api/blood-donations', (req, res) => {
  const userId = req.query.userId;
  let query = `SELECT bd.*, u.name as donor_name, h.name as hospital_name 
               FROM blood_donations bd 
               LEFT JOIN users u ON bd.donor_id = u.id 
               LEFT JOIN hospitals h ON bd.hospital_id = h.id`;
  
  if (userId) {
    query += ` WHERE bd.donor_id = ${userId}`;
  }
  
  query += ` ORDER BY bd.created_at DESC`;
  
  db.all(query, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Blood requests
app.get('/api/blood-requests', (req, res) => {
  db.all(`SELECT br.*, u.name as requester_name, h.name as hospital_name 
          FROM blood_requests br 
          LEFT JOIN users u ON br.requester_id = u.id 
          LEFT JOIN hospitals h ON br.hospital_id = h.id 
          ORDER BY br.created_at DESC`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Organ donations
app.get('/api/organ-donations', (req, res) => {
  db.all(`SELECT od.*, u.name as donor_name, h.name as hospital_name 
          FROM organ_donations od 
          LEFT JOIN users u ON od.donor_id = u.id 
          LEFT JOIN hospitals h ON od.hospital_id = h.id 
          ORDER BY od.created_at DESC`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/organ-donations', (req, res) => {
  const { organ_type, hospital_id, notes } = req.body;
  db.run('INSERT INTO organ_donations (donor_id, hospital_id, organ_type, notes) VALUES (?, ?, ?, ?)',
    [1, hospital_id, organ_type, notes], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ donation recorded successfully', id: this.lastID });
    });
});

// Organ requests
app.get('/api/organ-requests', (req, res) => {
  db.all(`SELECT orr.*, u.name as requester_name, h.name as hospital_name 
          FROM organ_requests orr 
          LEFT JOIN users u ON orr.requester_id = u.id 
          LEFT JOIN hospitals h ON orr.hospital_id = h.id 
          ORDER BY orr.created_at DESC`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/organ-requests', (req, res) => {
  const { organ_type, urgency, reason, hospital_id } = req.body;
  const requested_date = new Date().toISOString().split('T')[0];
  
  db.run('INSERT INTO organ_requests (requester_id, hospital_id, organ_type, urgency, reason, requested_date) VALUES (?, ?, ?, ?, ?, ?)',
    [1, hospital_id, organ_type, urgency, reason, requested_date], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ request submitted successfully', id: this.lastID });
    });
});

// Admin actions for blood donations
app.put('/api/blood-donations/:id', (req, res) => {
  const { status } = req.body;
  db.run('UPDATE blood_donations SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Blood donation updated successfully' });
  });
});

app.delete('/api/blood-donations/:id', (req, res) => {
  db.run('DELETE FROM blood_donations WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Blood donation deleted successfully' });
  });
});

// Admin actions for blood requests
app.put('/api/blood-requests/:id', (req, res) => {
  const { status, fulfilled_date } = req.body;
  const updateDate = status === 'fulfilled' ? new Date().toISOString().split('T')[0] : null;
  
  db.run('UPDATE blood_requests SET status = ?, fulfilled_date = ? WHERE id = ?', 
    [status, fulfilled_date || updateDate, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Blood request updated successfully' });
    });
});

app.delete('/api/blood-requests/:id', (req, res) => {
  db.run('DELETE FROM blood_requests WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Blood request deleted successfully' });
  });
});

// Admin actions for organ donations
app.put('/api/organ-donations/:id', (req, res) => {
  const { status, donation_date } = req.body;
  const updateDate = status === 'completed' ? new Date().toISOString().split('T')[0] : null;
  
  db.run('UPDATE organ_donations SET status = ?, donation_date = ? WHERE id = ?', 
    [status, donation_date || updateDate, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ donation updated successfully' });
    });
});

app.delete('/api/organ-donations/:id', (req, res) => {
  db.run('DELETE FROM organ_donations WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Organ donation deleted successfully' });
  });
});

// Admin actions for organ requests
app.put('/api/organ-requests/:id', (req, res) => {
  const { status, fulfilled_date } = req.body;
  const updateDate = status === 'fulfilled' ? new Date().toISOString().split('T')[0] : null;
  
  db.run('UPDATE organ_requests SET status = ?, fulfilled_date = ? WHERE id = ?', 
    [status, fulfilled_date || updateDate, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ request updated successfully' });
    });
});

app.delete('/api/organ-requests/:id', (req, res) => {
  db.run('DELETE FROM organ_requests WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Organ request deleted successfully' });
  });
});

// Delete user (admin)
app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
});

// Delete doctor (admin)
app.delete('/api/doctors/:id', (req, res) => {
  db.run('DELETE FROM doctors WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Doctor deleted successfully' });
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as count FROM users WHERE role = "donor"', (err, row) => {
    stats.totalDonors = row ? row.count : 0;
    
    db.get('SELECT COUNT(*) as count FROM blood_donations', (err, row) => {
      stats.totalDonations = row ? row.count : 0;
      
      db.get('SELECT COUNT(*) as count FROM blood_requests WHERE status = "pending"', (err, row) => {
        stats.pendingRequests = row ? row.count : 0;
        
        db.get('SELECT COUNT(*) as count FROM hospitals', (err, row) => {
          stats.totalHospitals = row ? row.count : 0;
          res.json(stats);
        });
      });
    });
  });
});

// Blood donations
app.post('/api/blood-donations', (req, res) => {
  const { blood_type, quantity, hospital_id, notes } = req.body;
  const donation_date = new Date().toISOString().split('T')[0];
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 35);
  const expiry_date = expiryDate.toISOString().split('T')[0];
  
  db.run(
    'INSERT INTO blood_donations (donor_id, hospital_id, blood_type, quantity, donation_date, expiry_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [1, hospital_id, blood_type, quantity, donation_date, expiry_date, notes],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Blood donation recorded successfully', id: this.lastID });
    }
  );
});

// Blood requests
app.post('/api/blood-requests', (req, res) => {
  const { blood_type, quantity, urgency, reason, hospital_id } = req.body;
  const requested_date = new Date().toISOString().split('T')[0];
  
  db.run(
    'INSERT INTO blood_requests (requester_id, hospital_id, blood_type, quantity, urgency, reason, requested_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [1, hospital_id, blood_type, quantity, urgency, reason, requested_date],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Blood request submitted successfully', id: this.lastID });
    }
  );
});

// Get blood inventory
app.get('/api/blood-inventory', (req, res) => {
  db.all(`SELECT blood_type, 
                 SUM(quantity) as total_quantity,
                 COUNT(*) as units,
                 MIN(expiry_date) as earliest_expiry,
                 h.name as hospital_name
          FROM blood_inventory bi
          LEFT JOIN hospitals h ON bi.hospital_id = h.id
          WHERE bi.status = 'active'
          GROUP BY blood_type
          ORDER BY blood_type`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Get public donors (for search)
app.get('/api/donors', (req, res) => {
  db.all(`SELECT id, name, blood_type, address, organ_donor, organs_to_donate 
          FROM users 
          WHERE role = 'donor' AND status = 'active'
          ORDER BY name`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Get organ inventory/stats
app.get('/api/organ-inventory', (req, res) => {
  db.all(`SELECT * FROM organ_donations ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database initialized with dummy data`);
});
