import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrganDonationForm = ({ onClose, onSuccess }) => {
  const [hospitals, setHospitals] = useState([]);
  const [showSOP, setShowSOP] = useState(false);
  const [formData, setFormData] = useState({
    organ_type: '',
    hospital_id: '',
    medical_diseases: '',
    allergies: '',
    blood_pressure: '',
    diabetes: 'no',
    current_medications: '',
    previous_surgeries: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    consent_sop_accepted: false,
    notes: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/hospitals')
      .then(res => setHospitals(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent_sop_accepted) {
      alert('You must read and accept the SOP to proceed');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/organ-donations', {
        ...formData,
        consent_sop_accepted: formData.consent_sop_accepted ? 1 : 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Organ donation registered successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
        <h2>Organ Donation Registration Form</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Organ Selection */}
          <div className="form-section">
            <h3>Organ Selection</h3>
            <label>
              Select Organ *
              <select name="organ_type" value={formData.organ_type} onChange={handleChange} required>
                <option value="">Choose organ...</option>
                <option value="Kidney">Kidney</option>
                <option value="Liver">Liver</option>
                <option value="Heart">Heart (Deceased Donation Only)</option>
              </select>
            </label>

            <label>
              Hospital *
              <select name="hospital_id" value={formData.hospital_id} onChange={handleChange} required>
                <option value="">Select hospital...</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Medical Information */}
          <div className="form-section">
            <h3>Medical Information</h3>
            
            <label>
              Existing Diseases/Medical Conditions *
              <textarea 
                name="medical_diseases" 
                value={formData.medical_diseases} 
                onChange={handleChange}
                placeholder="List any chronic diseases, heart conditions, kidney problems, etc."
                rows="3"
                required
              />
            </label>

            <label>
              Allergies *
              <textarea 
                name="allergies" 
                value={formData.allergies} 
                onChange={handleChange}
                placeholder="List any drug allergies, food allergies, or write 'None'"
                rows="2"
                required
              />
            </label>

            <label>
              Blood Pressure *
              <input 
                type="text" 
                name="blood_pressure" 
                value={formData.blood_pressure} 
                onChange={handleChange}
                placeholder="e.g., 120/80 mmHg or Normal"
                required
              />
            </label>

            <label>
              Diabetes Status *
              <select name="diabetes" value={formData.diabetes} onChange={handleChange} required>
                <option value="no">No</option>
                <option value="type1">Type 1 Diabetes</option>
                <option value="type2">Type 2 Diabetes</option>
                <option value="prediabetic">Pre-diabetic</option>
              </select>
            </label>

            <label>
              Current Medications
              <textarea 
                name="current_medications" 
                value={formData.current_medications} 
                onChange={handleChange}
                placeholder="List all medications you are currently taking"
                rows="3"
              />
            </label>

            <label>
              Previous Surgeries
              <textarea 
                name="previous_surgeries" 
                value={formData.previous_surgeries} 
                onChange={handleChange}
                placeholder="List any previous surgeries with approximate dates"
                rows="2"
              />
            </label>
          </div>

          {/* Emergency Contact */}
          <div className="form-section">
            <h3>Emergency Contact</h3>
            
            <label>
              Emergency Contact Name *
              <input 
                type="text" 
                name="emergency_contact_name" 
                value={formData.emergency_contact_name} 
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </label>

            <label>
              Emergency Contact Phone *
              <input 
                type="tel" 
                name="emergency_contact_phone" 
                value={formData.emergency_contact_phone} 
                onChange={handleChange}
                placeholder="10-digit phone number"
                required
              />
            </label>
          </div>

          {/* Additional Notes */}
          <div className="form-section">
            <label>
              Additional Notes
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange}
                placeholder="Any other information you'd like to share"
                rows="3"
              />
            </label>
          </div>

          {/* SOP Consent */}
          <div className="form-section sop-section">
            <h3>Standard Operating Procedures (SOP)</h3>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setShowSOP(!showSOP)}
            >
              {showSOP ? 'Hide SOP' : 'Read SOP (Required)'}
            </button>

            {showSOP && (
              <div className="sop-content">
                <h4>Key Points from SOP:</h4>
                <ul>
                  <li><strong>Eligibility:</strong> Age 18-65, sound health, voluntary consent</li>
                  <li><strong>Medical Evaluation:</strong> Complete screening, imaging, psychological assessment</li>
                  <li><strong>Risks:</strong> Surgical complications, infection, organ-specific risks</li>
                  <li><strong>Recovery:</strong> Kidney (4-6 weeks), Liver (8-12 weeks), Heart (deceased only)</li>
                  <li><strong>Rights:</strong> Can withdraw anytime before surgery, confidentiality protected</li>
                  <li><strong>Follow-up:</strong> Lifelong monitoring and annual check-ups required</li>
                </ul>
                <p><a href="/ORGAN_DONATION_SOP.md" target="_blank">Read Full SOP Document</a></p>
              </div>
            )}

            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="consent_sop_accepted" 
                checked={formData.consent_sop_accepted} 
                onChange={handleChange}
                required
              />
              <span>I have read and understood the Standard Operating Procedures (SOP) for organ donation. I voluntarily consent to donate and understand all risks, benefits, and post-donation care requirements. *</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary">Submit Registration</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .form-section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .form-section h3 {
          margin-top: 0;
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }

        .sop-section {
          background: #fff3cd;
          border: 2px solid #ffc107;
        }

        .sop-content {
          margin: 15px 0;
          padding: 15px;
          background: white;
          border-radius: 5px;
          max-height: 300px;
          overflow-y: auto;
        }

        .sop-content ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .sop-content li {
          margin: 8px 0;
          line-height: 1.6;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 15px;
          padding: 15px;
          background: white;
          border-radius: 5px;
        }

        .checkbox-label input[type="checkbox"] {
          margin-top: 3px;
          width: 20px;
          height: 20px;
        }

        .checkbox-label span {
          flex: 1;
          font-size: 14px;
          line-height: 1.5;
        }

        label {
          display: block;
          margin-bottom: 15px;
        }

        label > span:first-child,
        label > strong {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #2c3e50;
        }

        input[type="text"],
        input[type="tel"],
        select,
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        textarea {
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
        }

        .btn-primary {
          background: #27ae60;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-primary:hover {
          background: #229954;
        }

        .btn-secondary {
          background: #95a5a6;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-secondary:hover {
          background: #7f8c8d;
        }
      `}</style>
    </div>
  );
};

export default OrganDonationForm;
