const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get organ inventory
router.get('/', (req, res) => {
  req.db.all(`
    SELECT organ_type, COUNT(*) as available_count, status
    FROM organ_donations 
    WHERE status = 'available'
    GROUP BY organ_type
  `, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Get organ inventory by hospital
router.get('/hospital/:hospitalId', (req, res) => {
  req.db.all(`
    SELECT organ_type, COUNT(*) as available_count, status
    FROM organ_donations 
    WHERE hospital_id = ? AND status = 'available'
    GROUP BY organ_type
  `, [req.params.hospitalId], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
