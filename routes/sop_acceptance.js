const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Record SOP acceptance
router.post('/', authenticateToken, (req, res) => {
  const { organ_type, sop_accepted } = req.body;
  const donor_id = req.user.userId;

  req.db.run(`
    INSERT INTO organ_donations (
      donor_id, organ_type, consent_sop_accepted, status
    ) VALUES (?, ?, ?, 'sop_accepted')
  `, [donor_id, organ_type, sop_accepted ? 1 : 0],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'SOP acceptance recorded', id: this.lastID });
    }
  );
});

// Get SOP acceptance status
router.get('/:donorId/:organType', authenticateToken, (req, res) => {
  req.db.get(`
    SELECT consent_sop_accepted, created_at
    FROM organ_donations 
    WHERE donor_id = ? AND organ_type = ?
    ORDER BY created_at DESC 
    LIMIT 1
  `, [req.params.donorId, req.params.organType], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row || { consent_sop_accepted: 0 });
  });
});

module.exports = router;
