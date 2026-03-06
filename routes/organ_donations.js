const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all organ donations
router.get('/', (req, res) => {
  req.db.all(`SELECT od.*, u.name as donor_name, h.name as hospital_name 
          FROM organ_donations od 
          LEFT JOIN users u ON od.donor_id = u.id 
          LEFT JOIN hospitals h ON od.hospital_id = h.id 
          ORDER BY od.created_at DESC`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Add organ donation
router.post('/', authenticateToken, (req, res) => {
  const { 
    organ_type, hospital_id, notes, 
    medical_diseases, allergies, blood_pressure, diabetes, 
    current_medications, previous_surgeries,
    emergency_contact_name, emergency_contact_phone,
    consent_sop_accepted
  } = req.body;
  const donor_id = req.user.userId;

  req.db.run(
    `INSERT INTO organ_donations (
      donor_id, hospital_id, organ_type, notes,
      medical_diseases, allergies, blood_pressure, diabetes,
      current_medications, previous_surgeries,
      emergency_contact_name, emergency_contact_phone,
      consent_sop_accepted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [donor_id, hospital_id, organ_type, notes,
     medical_diseases, allergies, blood_pressure, diabetes,
     current_medications, previous_surgeries,
     emergency_contact_name, emergency_contact_phone,
     consent_sop_accepted],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ donation registered successfully', id: this.lastID });
    }
  );
});

// Update organ donation status
router.put('/:id', authenticateToken, (req, res) => {
  const { status, donation_date } = req.body;
  const updateDate = status === 'completed' ? new Date().toISOString().split('T')[0] : null;
  
  req.db.run('UPDATE organ_donations SET status = ?, donation_date = ? WHERE id = ?', 
    [status, donation_date || updateDate, req.params.id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Organ donation updated successfully' });
    });
});

// Delete organ donation
router.delete('/:id', authenticateToken, (req, res) => {
  req.db.run('DELETE FROM organ_donations WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Organ donation deleted successfully' });
  });
});

module.exports = router;
