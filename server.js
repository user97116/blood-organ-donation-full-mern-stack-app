const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const { insertDummyData } = require('./data/dummyData');
const { authenticateToken } = require('./middleware/auth');

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
app.use('/api/organ-donations', require('./routes/organ_donations'));
app.use('/api/organ-requests', require('./routes/organ_requests'));
app.use('/api/organ-inventory', require('./routes/organ_inventory'));
app.use('/api/medical-evaluation', require('./routes/medical_evaluation'));
app.use('/api/sop-acceptance', require('./routes/sop_acceptance'));
app.use('/api', require('./routes/chat'));

// Users management (admin)
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  db.all('SELECT id, name, email, phone, blood_type, role, status, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { role, status } = req.body;
  db.run('UPDATE users SET role = ?, status = ? WHERE id = ?', [role, status, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'User updated successfully' });
  });
});

// Doctors management
app.get('/api/doctors', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  db.all(`SELECT d.*, h.name as hospital_name 
          FROM doctors d 
          LEFT JOIN hospitals h ON d.hospital_id = h.id 
          ORDER BY d.created_at DESC`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/doctors', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { name, email, phone, specialization, hospital_id, license_number } = req.body;
  db.run('INSERT INTO doctors (name, email, phone, specialization, hospital_id, license_number) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone, specialization, hospital_id, license_number], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Doctor added successfully', id: this.lastID });
    });
});

app.put('/api/doctors/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { status, availability_status, schedule } = req.body;

  db.run(
    `UPDATE doctors
     SET status = COALESCE(?, status),
         availability_status = COALESCE(?, availability_status),
         schedule = COALESCE(?, schedule)
     WHERE id = ?`,
    [status || null, availability_status || null, schedule || null, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Doctor updated successfully' });
    }
  );
});

// Doctor self availability/profile
app.get('/api/doctors/me', authenticateToken, (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Doctor access required' });
  }

  const lookupByEmail = (name, email) => {
    db.get(
      `SELECT d.*, h.name as hospital_name
       FROM doctors d
       LEFT JOIN hospitals h ON d.hospital_id = h.id
       WHERE d.email = ?`,
      [email],
      (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (row) return res.json(row);

        // Backfill profile for older doctor users that do not yet have doctors row.
        db.run(
          `INSERT INTO doctors (name, email, status, availability_status)
           VALUES (?, ?, 'active', 'available')`,
          [name, email],
          function(insertErr) {
            if (insertErr) return res.status(400).json({ error: insertErr.message });
            db.get(
              `SELECT d.*, h.name as hospital_name
               FROM doctors d
               LEFT JOIN hospitals h ON d.hospital_id = h.id
               WHERE d.id = ?`,
              [this.lastID],
              (fetchErr, createdRow) => {
                if (fetchErr) return res.status(400).json({ error: fetchErr.message });
                res.json(createdRow);
              }
            );
          }
        );
      }
    );
  };

  if (req.user.email) {
    const fallbackName = req.user.email.split('@')[0] || 'Doctor';
    return lookupByEmail(fallbackName, req.user.email);
  }

  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.user.userId], (uErr, userRow) => {
    if (uErr) return res.status(400).json({ error: uErr.message });
    if (!userRow) return res.status(404).json({ error: 'Doctor profile not found' });
    lookupByEmail(userRow.name, userRow.email);
  });
});

app.put('/api/doctors/me/availability', authenticateToken, (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Doctor access required' });
  }

  const { status, availability_status, schedule } = req.body;
  if (!availability_status) {
    return res.status(400).json({ error: 'availability_status is required' });
  }

  const updateByEmail = (name, email) => {
    db.run(
      `UPDATE doctors
       SET status = COALESCE(?, status),
           availability_status = ?,
           schedule = COALESCE(?, schedule)
       WHERE email = ?`,
      [status || null, availability_status, schedule || null, email],
      function(err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes > 0) {
          return res.json({ message: 'Availability updated successfully' });
        }

        db.run(
          `INSERT INTO doctors (name, email, status, availability_status, schedule)
           VALUES (?, ?, ?, ?, ?)`,
          [name, email, status || 'active', availability_status, schedule || null],
          function(insertErr) {
            if (insertErr) return res.status(400).json({ error: insertErr.message });
            res.json({ message: 'Availability updated successfully' });
          }
        );
      }
    );
  };

  if (req.user.email) {
    const fallbackName = req.user.email.split('@')[0] || 'Doctor';
    return updateByEmail(fallbackName, req.user.email);
  }

  db.get('SELECT name, email FROM users WHERE id = ?', [req.user.userId], (uErr, userRow) => {
    if (uErr) return res.status(400).json({ error: uErr.message });
    if (!userRow) return res.status(404).json({ error: 'Doctor profile not found' });
    updateByEmail(userRow.name, userRow.email);
  });
});

// Blood donations
app.get('/api/blood-donations', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const query = req.user.role === 'admin'
    ? `SELECT bd.*, u.name as donor_name, h.name as hospital_name 
       FROM blood_donations bd 
       LEFT JOIN users u ON bd.donor_id = u.id 
       LEFT JOIN hospitals h ON bd.hospital_id = h.id
       ORDER BY bd.created_at DESC`
    : req.user.role === 'doctor'
      ? `SELECT bd.*, u.name as donor_name, h.name as hospital_name
         FROM blood_donations bd
         LEFT JOIN users u ON bd.donor_id = u.id
         LEFT JOIN hospitals h ON bd.hospital_id = h.id
         WHERE bd.hospital_id = (
           SELECT d.hospital_id
           FROM doctors d
           WHERE d.email = (SELECT u.email FROM users u WHERE u.id = ?)
         )
         ORDER BY bd.created_at DESC`
      : `SELECT bd.*, u.name as donor_name, h.name as hospital_name 
         FROM blood_donations bd 
         LEFT JOIN users u ON bd.donor_id = u.id 
         LEFT JOIN hospitals h ON bd.hospital_id = h.id
         WHERE bd.donor_id = ?
         ORDER BY bd.created_at DESC`;

  const params = req.user.role === 'admin'
    ? []
    : req.user.role === 'doctor'
      ? [userId]
      : [userId];
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Blood requests
app.get('/api/blood-requests', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const query = req.user.role === 'admin'
    ? `SELECT br.*, u.name as requester_name, h.name as hospital_name 
       FROM blood_requests br 
       LEFT JOIN users u ON br.requester_id = u.id 
       LEFT JOIN hospitals h ON br.hospital_id = h.id
       ORDER BY br.created_at DESC`
    : req.user.role === 'doctor'
      ? `SELECT br.*, u.name as requester_name, h.name as hospital_name
         FROM blood_requests br
         LEFT JOIN users u ON br.requester_id = u.id
         LEFT JOIN hospitals h ON br.hospital_id = h.id
         WHERE br.hospital_id = (
           SELECT d.hospital_id
           FROM doctors d
           WHERE d.email = (SELECT u.email FROM users u WHERE u.id = ?)
         )
         ORDER BY br.created_at DESC`
      : `SELECT br.*, u.name as requester_name, h.name as hospital_name 
         FROM blood_requests br 
         LEFT JOIN users u ON br.requester_id = u.id 
         LEFT JOIN hospitals h ON br.hospital_id = h.id
         WHERE br.requester_id = ?
         ORDER BY br.created_at DESC`;
  
  const params = req.user.role === 'admin'
    ? []
    : req.user.role === 'doctor'
      ? [userId]
      : [userId];
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Organ requests
app.get('/api/organ-requests', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const query = req.user.role === 'admin'
    ? `SELECT orr.*, u.name as requester_name, h.name as hospital_name 
       FROM organ_requests orr 
       LEFT JOIN users u ON orr.requester_id = u.id 
       LEFT JOIN hospitals h ON orr.hospital_id = h.id 
       ORDER BY orr.created_at DESC`
    : `SELECT orr.*, h.name as hospital_name 
       FROM organ_requests orr 
       LEFT JOIN hospitals h ON orr.hospital_id = h.id 
       WHERE orr.requester_id = ?
       ORDER BY orr.created_at DESC`;
  
  const params = req.user.role === 'admin' ? [] : [userId];
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/organ-requests', authenticateToken, (req, res) => {
  const { organ_type, urgency, reason, hospital_id } = req.body;
  const requester_id = req.user.userId;
  const requested_date = new Date().toISOString().split('T')[0];
  
  db.run('INSERT INTO organ_requests (requester_id, hospital_id, organ_type, urgency, reason, requested_date) VALUES (?, ?, ?, ?, ?, ?)',
    [requester_id, hospital_id, organ_type, urgency, reason, requested_date], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ request submitted successfully', id: this.lastID });
    });
});

// Admin actions for blood donations
app.put('/api/blood-donations/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { status } = req.body;
  db.run('UPDATE blood_donations SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Blood donation updated successfully' });
  });
});

app.delete('/api/blood-donations/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  db.run('DELETE FROM blood_donations WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Blood donation deleted successfully' });
  });
});

// Admin actions for blood requests
app.put('/api/blood-requests/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { status, fulfilled_date } = req.body;
  const updateDate = status === 'fulfilled' ? new Date().toISOString().split('T')[0] : null;
  
  db.run('UPDATE blood_requests SET status = ?, fulfilled_date = ? WHERE id = ?', 
    [status, fulfilled_date || updateDate, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Blood request updated successfully' });
    });
});

app.delete('/api/blood-requests/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  db.run('DELETE FROM blood_requests WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Blood request deleted successfully' });
  });
});

// Admin actions for organ requests
app.put('/api/organ-requests/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { status, fulfilled_date } = req.body;
  const updateDate = status === 'fulfilled' ? new Date().toISOString().split('T')[0] : null;
  
  db.run('UPDATE organ_requests SET status = ?, fulfilled_date = ? WHERE id = ?', 
    [status, fulfilled_date || updateDate, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ request updated successfully' });
    });
});

app.delete('/api/organ-requests/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  db.run('DELETE FROM organ_requests WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Organ request deleted successfully' });
  });
});

// Delete user (admin)
app.delete('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
});

// Delete doctor (admin)
app.delete('/api/doctors/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  db.run('DELETE FROM doctors WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Doctor deleted successfully' });
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {};
  const userId = req.user.userId;
  
  db.get('SELECT COUNT(*) as count FROM users WHERE role = "donor"', (err, row) => {
    stats.totalDonors = row ? row.count : 0;
    
    db.get('SELECT COUNT(*) as count FROM blood_donations WHERE donor_id = ?', [userId], (err, row) => {
      stats.totalDonations = row ? row.count : 0;
      
      db.get('SELECT COUNT(*) as count FROM blood_requests WHERE requester_id = ? AND status = "pending"', [userId], (err, row) => {
        stats.pendingRequests = row ? row.count : 0;
        
        db.get('SELECT COUNT(*) as count FROM hospitals', (err, row) => {
          stats.totalHospitals = row ? row.count : 0;
          res.json(stats);
        });
      });
    });
  });
});

// Public dashboard stats (no auth) for home page
app.get('/api/dashboard/public-stats', (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as count FROM users WHERE role = "donor"', (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    stats.totalDonors = row ? row.count : 0;

    db.get('SELECT COUNT(*) as count FROM blood_donations', (err2, row2) => {
      if (err2) return res.status(400).json({ error: err2.message });
      stats.totalDonations = row2 ? row2.count : 0;

      db.get('SELECT COUNT(*) as count FROM blood_requests WHERE status = "pending"', (err3, row3) => {
        if (err3) return res.status(400).json({ error: err3.message });
        stats.pendingRequests = row3 ? row3.count : 0;

        db.get('SELECT COUNT(*) as count FROM hospitals', (err4, row4) => {
          if (err4) return res.status(400).json({ error: err4.message });
          stats.totalHospitals = row4 ? row4.count : 0;
          res.json(stats);
        });
      });
    });
  });
});

// Blood donations
app.post('/api/blood-donations', authenticateToken, (req, res) => {
  const { blood_type, quantity, hospital_id, notes } = req.body;
  const donor_id = req.user.userId;
  const donation_date = new Date().toISOString().split('T')[0];
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 35);
  const expiry_date = expiryDate.toISOString().split('T')[0];
  
  db.run(
    'INSERT INTO blood_donations (donor_id, hospital_id, blood_type, quantity, donation_date, expiry_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [donor_id, hospital_id, blood_type, quantity, donation_date, expiry_date, notes],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Blood donation recorded successfully', id: this.lastID });
    }
  );
});

// Blood requests
app.post('/api/blood-requests', authenticateToken, (req, res) => {
  const { blood_type, quantity, urgency, reason, hospital_id } = req.body;
  const requester_id = req.user.userId;
  const requested_date = new Date().toISOString().split('T')[0];
  
  db.run(
    'INSERT INTO blood_requests (requester_id, hospital_id, blood_type, quantity, urgency, reason, requested_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [requester_id, hospital_id, blood_type, quantity, urgency, reason, requested_date],
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
app.get('/api/organ-inventory', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const query = req.user.role === 'admin'
    ? `SELECT * FROM organ_donations ORDER BY created_at DESC`
    : `SELECT * FROM organ_donations WHERE donor_id = ? ORDER BY created_at DESC`;
  
  const params = req.user.role === 'admin' ? [] : [userId];
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database initialized with dummy data`);
});
