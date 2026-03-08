const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get medical evaluation for a donor
router.get('/:donorId', authenticateToken, (req, res) => {
  req.db.get(`
    SELECT medical_diseases, allergies, blood_pressure, diabetes, 
           current_medications, previous_surgeries, 
           emergency_contact_name, emergency_contact_phone
    FROM organ_donations 
    WHERE donor_id = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `, [req.params.donorId], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row || {});
  });
});

// Submit medical evaluation
router.post('/', authenticateToken, (req, res) => {
  const { 
    medical_diseases, allergies, blood_pressure, diabetes,
    current_medications, previous_surgeries,
    emergency_contact_name, emergency_contact_phone
  } = req.body;
  const donor_id = req.user.userId;

  // Update user's latest organ donation record or create a temporary medical record
  req.db.run(`
    INSERT INTO organ_donations (
      donor_id, organ_type, medical_diseases, allergies, blood_pressure, 
      diabetes, current_medications, previous_surgeries,
      emergency_contact_name, emergency_contact_phone, status
    ) VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, 'evaluation')
  `, [donor_id, medical_diseases, allergies, blood_pressure, diabetes,
      current_medications, previous_surgeries, 
      emergency_contact_name, emergency_contact_phone],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Medical evaluation submitted successfully', id: this.lastID });
    }
  );
});

module.exports = router;
