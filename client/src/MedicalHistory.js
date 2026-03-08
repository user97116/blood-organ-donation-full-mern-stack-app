import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MedicalHistory.css';

const MedicalHistory = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    medical_diseases: '',
    allergies: '',
    blood_pressure: '',
    diabetes: 'none',
    current_medications: '',
    previous_surgeries: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/medical-evaluation', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Medical history saved successfully');
      if (onComplete) onComplete(formData);
    } catch (error) {
      alert('Error saving medical history: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="medical-history-form">
      <h2>Medical History & Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medical Diseases/Conditions</label>
          <textarea
            name="medical_diseases"
            value={formData.medical_diseases}
            onChange={handleChange}
            placeholder="List any chronic diseases, conditions, or health issues"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Allergies</label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Drug allergies, food allergies, etc."
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Blood Pressure</label>
          <input
            type="text"
            name="blood_pressure"
            value={formData.blood_pressure}
            onChange={handleChange}
            placeholder="e.g., 120/80"
          />
        </div>

        <div className="form-group">
          <label>Diabetes Status</label>
          <select name="diabetes" value={formData.diabetes} onChange={handleChange}>
            <option value="none">None</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
            <option value="prediabetic">Pre-diabetic</option>
          </select>
        </div>

        <div className="form-group">
          <label>Current Medications</label>
          <textarea
            name="current_medications"
            value={formData.current_medications}
            onChange={handleChange}
            placeholder="List all current medications with dosage"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Previous Surgeries</label>
          <textarea
            name="previous_surgeries"
            value={formData.previous_surgeries}
            onChange={handleChange}
            placeholder="List any previous surgeries and dates"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Emergency Contact Name *</label>
          <input
            type="text"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Emergency Contact Phone *</label>
          <input
            type="tel"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">Save Medical History</button>
      </form>
    </div>
  );
};

export default MedicalHistory;
