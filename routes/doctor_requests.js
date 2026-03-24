const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Create doctor request (user -> admin later assigns)
router.post('/', authenticateToken, (req, res) => {
  const { hospital_id, topic, message } = req.body;

  if (!hospital_id || !message) {
    return res.status(400).json({ error: 'hospital_id and message are required' });
  }

  req.db.run(
    `INSERT INTO doctor_requests (requester_id, hospital_id, topic, message, status)
     VALUES (?, ?, ?, ?, 'pending')`,
    [req.user.userId, hospital_id, topic || 'general', message],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Doctor request submitted successfully', id: this.lastID });
    }
  );
});

// List doctor requests
// - admin: all
// - doctor: assigned to them
// - others: their own requests
router.get('/', authenticateToken, (req, res) => {
  const role = req.user.role;
  const userId = req.user.userId;

  let query = '';
  let params = [];

  if (role === 'admin') {
    query = `
      SELECT dr.*,
             r.name as requester_name,
             h.name as hospital_name,
             d.name as doctor_name
      FROM doctor_requests dr
      LEFT JOIN users r ON dr.requester_id = r.id
      LEFT JOIN hospitals h ON dr.hospital_id = h.id
      LEFT JOIN doctors d ON dr.assigned_doctor_id = d.id
      ORDER BY dr.created_at DESC
    `;
  } else if (role === 'doctor') {
    // Map logged-in doctor (users row) -> doctors table by email
    query = `
      SELECT dr.*,
             r.name as requester_name,
             h.name as hospital_name,
             d.name as doctor_name
      FROM doctor_requests dr
      LEFT JOIN users r ON dr.requester_id = r.id
      LEFT JOIN hospitals h ON dr.hospital_id = h.id
      LEFT JOIN doctors d ON dr.assigned_doctor_id = d.id
      WHERE dr.assigned_doctor_id = (
        SELECT d2.id
        FROM doctors d2
        WHERE d2.email = (SELECT u.email FROM users u WHERE u.id = ?)
      )
      ORDER BY dr.created_at DESC
    `;
    params = [userId];
  } else {
    query = `
      SELECT dr.*,
             h.name as hospital_name
      FROM doctor_requests dr
      LEFT JOIN hospitals h ON dr.hospital_id = h.id
      WHERE dr.requester_id = ?
      ORDER BY dr.created_at DESC
    `;
    params = [userId];
  }

  req.db.all(query, params, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Admin assigns a request to a doctor
router.put('/:id/assign', authenticateToken, requireAdmin, (req, res) => {
  const { doctor_id } = req.body;

  if (!doctor_id) {
    return res.status(400).json({ error: 'doctor_id is required' });
  }

  // Ensure doctor belongs to the same hospital as the request
  req.db.get(
    `SELECT hospital_id FROM doctor_requests WHERE id = ?`,
    [req.params.id],
    (err, reqRow) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!reqRow) return res.status(404).json({ error: 'Request not found' });

      req.db.get(
        `SELECT hospital_id FROM doctors WHERE id = ?`,
        [doctor_id],
        (err2, doctorRow) => {
          if (err2) return res.status(400).json({ error: err2.message });
          if (!doctorRow) return res.status(404).json({ error: 'Doctor not found' });

          if (doctorRow.hospital_id !== reqRow.hospital_id) {
            return res
              .status(400)
              .json({ error: 'Doctor must belong to the same hospital as the request' });
          }

          req.db.run(
            `UPDATE doctor_requests
             SET assigned_doctor_id = ?, status = 'assigned', assigned_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [doctor_id, req.params.id],
            function (err3) {
              if (err3) return res.status(400).json({ error: err3.message });
              res.json({ message: 'Doctor assigned successfully' });
            }
          );
        }
      );
    }
  );
});

module.exports = router;

