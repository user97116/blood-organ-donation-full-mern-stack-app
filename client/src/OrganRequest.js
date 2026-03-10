import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrganRequest.css';

const OrganRequest = () => {
  const [formData, setFormData] = useState({
    organ_type: '',
    hospital_id: '',
    urgency: 'medium',
    reason: ''
  });
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchHospitals();
    fetchRequests();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hospitals');
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/organ-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/organ-requests', formData);
      alert('Organ request submitted successfully');
      setFormData({ organ_type: '', hospital_id: '', urgency: 'medium', reason: '' });
      fetchRequests();
    } catch (error) {
      alert('Error submitting request: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="organ-request-container">
      <div className="request-form">
        <h2>Request Organ</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Organ Type *</label>
            <select name="organ_type" value={formData.organ_type} onChange={handleChange} required>
              <option value="">Select organ</option>
              <option value="heart">Heart</option>
              <option value="kidney">Kidney</option>
              <option value="eye">Eye (Cornea)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hospital *</label>
            <select name="hospital_id" value={formData.hospital_id} onChange={handleChange} required>
              <option value="">Select hospital</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Urgency Level *</label>
            <select name="urgency" value={formData.urgency} onChange={handleChange} required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reason *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              placeholder="Explain the medical need"
              required
            />
          </div>

          <button type="submit" className="btn-submit">Submit Request</button>
        </form>
      </div>

      <div className="requests-list">
        <h2>My Organ Requests</h2>
        {requests.length === 0 ? (
          <p className="no-data">No requests found</p>
        ) : (
          <div className="requests-grid">
            {requests.map(req => (
              <div key={req.id} className="request-card">
                <div className="request-header">
                  <span className="organ-type">{req.organ_type}</span>
                  <span className={`urgency-badge ${req.urgency}`}>{req.urgency}</span>
                </div>
                <p><strong>Hospital:</strong> {req.hospital_name}</p>
                <p><strong>Reason:</strong> {req.reason}</p>
                <p><strong>Requested:</strong> {new Date(req.requested_date).toLocaleDateString()}</p>
                <span className={`status-badge ${req.status}`}>{req.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganRequest;
