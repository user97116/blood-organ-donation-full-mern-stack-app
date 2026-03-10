import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SOPModal from './SOPModal';
import MedicalHistory from './MedicalHistory';
import './OrganDonation.css';

const OrganDonation = () => {
  const [step, setStep] = useState(1);
  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [showSOP, setShowSOP] = useState(false);
  const [sopAccepted, setSopAccepted] = useState(false);
  const [medicalData, setMedicalData] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hospitals');
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const handleOrganSelect = (organ) => {
    setSelectedOrgan(organ);
    setShowSOP(true);
  };

  const handleSOPAccept = async () => {
    try {
      await axios.post('http://localhost:5000/api/sop-acceptance', {
        organ_type: selectedOrgan,
        sop_accepted: true
      });
      setSopAccepted(true);
      setShowSOP(false);
      setStep(2);
    } catch (error) {
      alert('Error recording SOP acceptance');
    }
  };

  const handleSOPDecline = () => {
    setShowSOP(false);
    setSelectedOrgan('');
  };

  const handleMedicalComplete = (data) => {
    setMedicalData(data);
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/organ-donations', {
        organ_type: selectedOrgan,
        hospital_id: selectedHospital,
        notes,
        ...medicalData,
        consent_sop_accepted: 1
      });
      alert('Organ donation registered successfully!');
      resetForm();
    } catch (error) {
      alert('Error registering donation: ' + error.response?.data?.error);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedOrgan('');
    setSopAccepted(false);
    setMedicalData(null);
    setSelectedHospital('');
    setNotes('');
  };

  return (
    <div className="organ-donation-container">
      <h1>Organ Donation Registration</h1>
      
      {step === 1 && (
        <div className="organ-selection">
          <h2>Select Organ to Donate</h2>
          <div className="organ-cards">
            <div className="organ-card" onClick={() => handleOrganSelect('heart')}>
              <h3>❤️ Heart</h3>
              <p>Deceased donor only</p>
              <p className="age-range">Age: 0-65 years</p>
            </div>
            <div className="organ-card" onClick={() => handleOrganSelect('kidney')}>
              <h3>🫘 Kidney</h3>
              <p>Living or deceased donor</p>
              <p className="age-range">Age: 18-65 years</p>
            </div>
            <div className="organ-card" onClick={() => handleOrganSelect('eye')}>
              <h3>👁️ Eye (Cornea)</h3>
              <p>Deceased donor only</p>
              <p className="age-range">All ages</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <MedicalHistory onComplete={handleMedicalComplete} />
      )}

      {step === 3 && (
        <div className="final-registration">
          <h2>Complete Registration</h2>
          <div className="form-group">
            <label>Selected Organ</label>
            <input type="text" value={selectedOrgan} disabled />
          </div>
          <div className="form-group">
            <label>Select Hospital *</label>
            <select 
              value={selectedHospital} 
              onChange={(e) => setSelectedHospital(e.target.value)}
              required
            >
              <option value="">Choose a hospital</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Any additional information"
            />
          </div>
          <div className="action-buttons">
            <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
            <button onClick={handleFinalSubmit} className="btn-primary">Submit Registration</button>
          </div>
        </div>
      )}

      {showSOP && (
        <SOPModal 
          organType={selectedOrgan}
          onAccept={handleSOPAccept}
          onDecline={handleSOPDecline}
        />
      )}
    </div>
  );
};

export default OrganDonation;
