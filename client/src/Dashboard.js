import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [organDonations, setOrganDonations] = useState([]);
  const [organRequests, setOrganRequests] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const isAdmin = user.role === 'admin';
      const userParam = isAdmin ? '' : `?userId=${user.id}`;
      
      const [statsRes, donationsRes, requestsRes, organDonationsRes, organRequestsRes, hospitalsRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`),
        axios.get(`${API_URL}/blood-donations${userParam}`),
        axios.get(`${API_URL}/blood-requests${userParam}`),
        axios.get(`${API_URL}/organ-donations${userParam}`),
        axios.get(`${API_URL}/organ-requests${userParam}`),
        axios.get(`${API_URL}/hospitals`)
      ]);
      
      setStats(statsRes.data);
      setDonations(donationsRes.data);
      setRequests(requestsRes.data);
      setOrganDonations(organDonationsRes.data);
      setOrganRequests(organRequestsRes.data);
      setHospitals(hospitalsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'donate' ? 'active' : ''}
          onClick={() => setActiveTab('donate')}
        >
          Donate Blood
        </button>
        <button 
          className={activeTab === 'organ-donate' ? 'active' : ''}
          onClick={() => setActiveTab('organ-donate')}
        >
          Donate Organ
        </button>
        <button 
          className={activeTab === 'request' ? 'active' : ''}
          onClick={() => setActiveTab('request')}
        >
          Request Blood
        </button>
        <button 
          className={activeTab === 'organ-request' ? 'active' : ''}
          onClick={() => setActiveTab('organ-request')}
        >
          Request Organ
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          My History
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <Overview stats={stats} user={user} />
        )}
        {activeTab === 'donate' && (
          <DonateBlood hospitals={hospitals} onSuccess={fetchDashboardData} />
        )}
        {activeTab === 'organ-donate' && (
          <DonateOrgan hospitals={hospitals} onSuccess={fetchDashboardData} />
        )}
        {activeTab === 'request' && (
          <RequestBlood hospitals={hospitals} onSuccess={fetchDashboardData} />
        )}
        {activeTab === 'organ-request' && (
          <RequestOrgan hospitals={hospitals} onSuccess={fetchDashboardData} />
        )}
        {activeTab === 'history' && (
          <History donations={donations} requests={requests} organDonations={organDonations} organRequests={organRequests} user={user} />
        )}
      </div>
    </div>
  );
}

function Overview({ stats, user }) {
  return (
    <div className="overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Donors</h3>
          <p className="stat-number">{stats.totalDonors || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Hospitals</h3>
          <p className="stat-number">{stats.totalHospitals || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Donations</h3>
          <p className="stat-number">{stats.totalDonations || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p className="stat-number">{stats.pendingRequests || 0}</p>
        </div>
      </div>

      <div className="user-info">
        <h3>Your Profile</h3>
        <div className="profile-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Blood Type:</strong> {user.blood_type || 'Not specified'}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
}

function DonateBlood({ hospitals, onSuccess }) {
  const [formData, setFormData] = useState({
    blood_type: '',
    quantity: 1,
    hospital_id: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${API_URL}/blood-donations`, formData);
      setMessage('Blood donation recorded successfully!');
      setFormData({ blood_type: '', quantity: 1, hospital_id: '', notes: '' });
      onSuccess();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error recording donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-section">
      <h2>Donate Blood</h2>
      {message && <div className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</div>}
      
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-row">
          <div className="form-group">
            <label>Blood Type</label>
            <select
              value={formData.blood_type}
              onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
              required
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity (units)</label>
            <input
              type="number"
              min="1"
              max="4"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Hospital</label>
          <select
            value={formData.hospital_id}
            onChange={(e) => setFormData({...formData, hospital_id: e.target.value})}
            required
          >
            <option value="">Select Hospital</option>
            {hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="3"
            placeholder="Any additional information..."
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Recording...' : 'Donate Blood'}
        </button>
      </form>
    </div>
  );
}

function RequestBlood({ hospitals, onSuccess }) {
  const [formData, setFormData] = useState({
    blood_type: '',
    quantity: 1,
    urgency: '',
    reason: '',
    hospital_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${API_URL}/blood-requests`, formData);
      setMessage('Blood request submitted successfully!');
      setFormData({ blood_type: '', quantity: 1, urgency: '', reason: '', hospital_id: '' });
      onSuccess();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-section">
      <h2>Request Blood</h2>
      {message && <div className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</div>}
      
      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-row">
          <div className="form-group">
            <label>Blood Type Needed</label>
            <select
              value={formData.blood_type}
              onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
              required
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity (units)</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Urgency Level</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({...formData, urgency: e.target.value})}
              required
            >
              <option value="">Select Urgency</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hospital</label>
            <select
              value={formData.hospital_id}
              onChange={(e) => setFormData({...formData, hospital_id: e.target.value})}
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map(hospital => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Reason for Request</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            rows="3"
            placeholder="Please describe the medical reason for this blood request..."
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}

function History({ donations, requests, organDonations, organRequests, user }) {
  const updateBloodDonationStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/blood-donations/${id}`, { status });
      window.location.reload();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const updateBloodRequestStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/blood-requests/${id}`, { status });
      window.location.reload();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const updateOrganDonationStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/organ-donations/${id}`, { status });
      window.location.reload();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const updateOrganRequestStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/organ-requests/${id}`, { status });
      window.location.reload();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="history">
      <div className="history-section">
        <h3>My Blood Donations</h3>
        <div className="history-table">
          {donations.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Blood Type</th>
                  <th>Quantity</th>
                  <th>Hospital</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id}>
                    <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
                    <td>{donation.blood_type}</td>
                    <td>{donation.quantity} units</td>
                    <td>{donation.hospital_name || 'N/A'}</td>
                    <td className={`status ${donation.status}`}>{donation.status}</td>
                    {isAdmin && (
                      <td>
                        <select 
                          value={donation.status} 
                          onChange={(e) => updateBloodDonationStatus(donation.id, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="expired">Expired</option>
                          <option value="used">Used</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No blood donations recorded yet.</p>
          )}
        </div>
      </div>

      <div className="history-section">
        <h3>My Organ Donations</h3>
        <div className="history-table">
          {organDonations.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Organ Type</th>
                  <th>Hospital</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {organDonations.map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.donation_date ? new Date(donation.donation_date).toLocaleDateString() : 'Pending'}</td>
                    <td>{donation.organ_type}</td>
                    <td>{donation.hospital_name || 'N/A'}</td>
                    <td className={`status ${donation.status}`}>{donation.status}</td>
                    {isAdmin && (
                      <td>
                        <select 
                          value={donation.status} 
                          onChange={(e) => updateOrganDonationStatus(donation.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="eligible">Eligible</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No organ donations registered yet.</p>
          )}
        </div>
      </div>

      <div className="history-section">
        <h3>My Blood Requests</h3>
        <div className="history-table">
          {requests.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Blood Type</th>
                  <th>Quantity</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request.id}>
                    <td>{new Date(request.requested_date).toLocaleDateString()}</td>
                    <td>{request.blood_type}</td>
                    <td>{request.quantity} units</td>
                    <td className={`urgency ${request.urgency}`}>{request.urgency}</td>
                    <td className={`status ${request.status}`}>{request.status}</td>
                    {isAdmin && (
                      <td>
                        <select 
                          value={request.status} 
                          onChange={(e) => updateBloodRequestStatus(request.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No blood requests submitted yet.</p>
          )}
        </div>
      </div>

      <div className="history-section">
        <h3>My Organ Requests</h3>
        <div className="history-table">
          {organRequests.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Organ Type</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {organRequests.map(request => (
                  <tr key={request.id}>
                    <td>{new Date(request.requested_date).toLocaleDateString()}</td>
                    <td>{request.organ_type}</td>
                    <td className={`urgency ${request.urgency}`}>{request.urgency}</td>
                    <td className={`status ${request.status}`}>{request.status}</td>
                    {isAdmin && (
                      <td>
                        <select 
                          value={request.status} 
                          onChange={(e) => updateOrganRequestStatus(request.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No organ requests submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DonateOrgan({ hospitals, onSuccess }) {
  const [formData, setFormData] = useState({
    organ_type: 'Kidney',
    hospital_id: '',
    notes: '',
    health_condition: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const organDiseases = {
    Kidney: ['Kidney Stones', 'Chronic Kidney Disease', 'Polycystic Kidney Disease'],
    Liver: ['Hepatitis', 'Cirrhosis', 'Liver Cancer'],
    Heart: ['Coronary Artery Disease', 'Heart Failure', 'Arrhythmia'],
    Lungs: ['Asthma', 'Chronic Obstructive Pulmonary Disease (COPD)', 'Pneumonia'],
    Cornea: ['Keratoconus', 'Fuchs Dystrophy', 'Corneal Ulcer'],
    Skin: ['Eczema', 'Psoriasis', 'Skin Cancer'],
    Bone: ['Osteoporosis', 'Arthritis', 'Bone Cancer'],
    Pancreas: ['Pancreatitis', 'Diabetes', 'Pancreatic Cancer']
  };

  const handleOrganChange = (e) => {
    setFormData({
     ...formData,
      organ_type: e.target.value,
      health_condition: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${API_URL}/organ-donations`, formData);
      setMessage('Organ donation registered successfully!');
      setFormData({ organ_type: 'Kidney', hospital_id: '', notes: '', health_condition: '' });
      onSuccess();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error registering organ donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-section">
      <h2>Register Organ Donation</h2>
      {message && <div className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</div>}
      
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label>Organ Type</label>
          <select
            value={formData.organ_type}
            onChange={handleOrganChange}
            required
          >
            <option value="Kidney">Kidney</option>
            <option value="Liver">Liver</option>
            <option value="Heart">Heart</option>
            <option value="Lungs">Lungs</option>
            <option value="Cornea">Cornea</option>
            <option value="Skin">Skin</option>
            <option value="Bone">Bone</option>
            <option value="Pancreas">Pancreas</option>
          </select>
        </div>

        <div className="form-group">
          <label>Health Condition (if applicable)</label>
          <select
            value={formData.health_condition}
            onChange={(e) => setFormData({...formData, health_condition: e.target.value})}
          >
            <option value="">Select a condition</option>
            {organDiseases[formData.organ_type] && organDiseases[formData.organ_type].map(disease => (
              <option key={disease} value={disease}>{disease}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Hospital</label>
          <select
            value={formData.hospital_id}
            onChange={(e) => setFormData({...formData, hospital_id: e.target.value})}
            required
          >
            <option value="">Select Hospital</option>
            {hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="3"
            placeholder="Any additional information about the organ donation..."
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Registering...' : 'Register Organ Donation'}
        </button>
      </form>
    </div>
  );
}

function RequestOrgan({ hospitals, onSuccess }) {
  const [formData, setFormData] = useState({
    organ_type: 'Kidney',
    urgency: 'medium',
    reason: '',
    hospital_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${API_URL}/organ-requests`, formData);
      setMessage('Organ request submitted successfully!');
      setFormData({ organ_type: 'Kidney', urgency: 'medium', reason: '', hospital_id: '' });
      onSuccess();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error submitting organ request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-section">
      <h2>Request Organ</h2>
      {message && <div className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</div>}
      
      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-row">
          <div className="form-group">
            <label>Organ Type Needed</label>
            <select
              value={formData.organ_type}
              onChange={(e) => setFormData({...formData, organ_type: e.target.value})}
              required
            >
              <option value="Kidney">Kidney</option>
              <option value="Liver">Liver</option>
              <option value="Heart">Heart</option>
              <option value="Lungs">Lungs</option>
              <option value="Cornea">Cornea</option>
              <option value="Skin">Skin</option>
              <option value="Bone">Bone</option>
              <option value="Pancreas">Pancreas</option>
            </select>
          </div>

          <div className="form-group">
            <label>Urgency Level</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({...formData, urgency: e.target.value})}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Hospital</label>
          <select
            value={formData.hospital_id}
            onChange={(e) => setFormData({...formData, hospital_id: e.target.value})}
            required
          >
            <option value="">Select Hospital</option>
            {hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Medical Reason for Request</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            rows="3"
            placeholder="Please describe the medical condition requiring organ transplant..."
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Submitting...' : 'Submit Organ Request'}
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
