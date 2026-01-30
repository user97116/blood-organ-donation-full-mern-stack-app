const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all hospitals (public)
router.get('/', (req, res) => {
  req.db.all('SELECT * FROM hospitals ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Add hospital (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, address, phone, email, license_number } = req.body;
  
  req.db.run(
    'INSERT INTO hospitals (name, address, phone, email, license_number) VALUES (?, ?, ?, ?, ?)',
    [name, address, phone, email, license_number],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Hospital added successfully', id: this.lastID });
    }
  );
});

// Update hospital (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, address, phone, email, license_number, status } = req.body;
  
  req.db.run(
    'UPDATE hospitals SET name = ?, address = ?, phone = ?, email = ?, license_number = ?, status = ? WHERE id = ?',
    [name, address, phone, email, license_number, status, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Hospital updated successfully' });
    }
  );
});

// Delete hospital (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  req.db.run('DELETE FROM hospitals WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Hospital deleted successfully' });
  });
});

module.exports = router;
