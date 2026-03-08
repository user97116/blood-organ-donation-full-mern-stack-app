const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all organ requests
router.get('/', authenticateToken, (req, res) => {
  const query = req.user.role === 'admin' 
    ? `SELECT or.*, u.name as requester_name, h.name as hospital_name 
       FROM organ_requests or 
       LEFT JOIN users u ON or.requester_id = u.id 
       LEFT JOIN hospitals h ON or.hospital_id = h.id 
       ORDER BY or.created_at DESC`
    : `SELECT or.*, h.name as hospital_name 
       FROM organ_requests or 
       LEFT JOIN hospitals h ON or.hospital_id = h.id 
       WHERE or.requester_id = ? 
       ORDER BY or.created_at DESC`;
  
  const params = req.user.role === 'admin' ? [] : [req.user.userId];
  
  req.db.all(query, params, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Create organ request
router.post('/', authenticateToken, (req, res) => {
  const { organ_type, hospital_id, urgency, reason } = req.body;
  const requester_id = req.user.userId;
  const requested_date = new Date().toISOString().split('T')[0];

  req.db.run(
    `INSERT INTO organ_requests (requester_id, hospital_id, organ_type, urgency, reason, requested_date) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [requester_id, hospital_id, organ_type, urgency, reason, requested_date],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ request submitted successfully', id: this.lastID });
    }
  );
});

// Update organ request status
router.put('/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  const fulfilled_date = status === 'fulfilled' ? new Date().toISOString().split('T')[0] : null;
  
  req.db.run('UPDATE organ_requests SET status = ?, fulfilled_date = ? WHERE id = ?', 
    [status, fulfilled_date, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ request updated successfully' });
    });
});

module.exports = router;
