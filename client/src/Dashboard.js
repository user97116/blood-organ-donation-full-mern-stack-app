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
  const [doctorProfile, setDoctorProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const isAdmin = user.role === 'admin';
      
      const [statsRes, donationsRes, requestsRes, organDonationsRes, organRequestsRes, hospitalsRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`),
        axios.get(`${API_URL}/blood-donations`),
        axios.get(`${API_URL}/blood-requests`),
        axios.get(`${API_URL}/organ-donations`),
        axios.get(`${API_URL}/organ-requests`),
        axios.get(`${API_URL}/hospitals`)
      ]);
      
      setStats(statsRes.data);
      setDonations(donationsRes.data);
      setRequests(requestsRes.data);
      setOrganDonations(organDonationsRes.data);
      setOrganRequests(organRequestsRes.data);
      setHospitals(hospitalsRes.data);

      if (user.role === 'doctor') {
        try {
          const doctorMeRes = await axios.get(`${API_URL}/doctors/me`);
          setDoctorProfile(doctorMeRes.data);
        } catch (doctorErr) {
          // Prevent "Loading..." dead-end if profile endpoint has transient issue
          setDoctorProfile({
            hospital_name: '',
            availability_status: 'available',
            schedule: ''
          });
          console.error('Error loading doctor profile:', doctorErr);
        }
      }
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
        {user.role !== 'admin' && user.role !== 'doctor' && (
          <>
            <button className={activeTab === 'donate' ? 'active' : ''} onClick={() => setActiveTab('donate')}>Donate Blood</button>
            <button className={activeTab === 'organ-donate' ? 'active' : ''} onClick={() => setActiveTab('organ-donate')}>Donate Organ</button>
            <button className={activeTab === 'request' ? 'active' : ''} onClick={() => setActiveTab('request')}>Request Blood</button>
            <button className={activeTab === 'organ-request' ? 'active' : ''} onClick={() => setActiveTab('organ-request')}>Request Organ</button>
          </>
        )}
        {user.role === 'doctor' && (
          <>
            <button className={activeTab === 'all-donations' ? 'active' : ''} onClick={() => setActiveTab('all-donations')}>Blood Donations</button>
            <button className={activeTab === 'all-requests' ? 'active' : ''} onClick={() => setActiveTab('all-requests')}>Blood Requests</button>
            <button className={activeTab === 'organ-donations' ? 'active' : ''} onClick={() => setActiveTab('organ-donations')}>Organ Donations</button>
            <button className={activeTab === 'organ-requests' ? 'active' : ''} onClick={() => setActiveTab('organ-requests')}>Organ Requests</button>
            <button className={activeTab === 'availability' ? 'active' : ''} onClick={() => setActiveTab('availability')}>My Availability</button>
          </>
        )}
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>My History</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && <Overview stats={stats} user={user} />}
        {activeTab === 'donate' && <DonateBlood hospitals={hospitals} onSuccess={fetchDashboardData} />}
        {activeTab === 'organ-donate' && <DonateOrgan hospitals={hospitals} onSuccess={fetchDashboardData} />}
        {activeTab === 'request' && <RequestBlood hospitals={hospitals} onSuccess={fetchDashboardData} />}
        {activeTab === 'organ-request' && <RequestOrgan hospitals={hospitals} onSuccess={fetchDashboardData} />}
        {activeTab === 'history' && <History donations={donations} requests={requests} organDonations={organDonations} organRequests={organRequests} user={user} />}
        {activeTab === 'all-donations' && <DoctorView data={donations} type="blood-donations" />}
        {activeTab === 'all-requests' && <DoctorView data={requests} type="blood-requests" />}
        {activeTab === 'organ-donations' && <DoctorView data={organDonations} type="organ-donations" />}
        {activeTab === 'organ-requests' && <DoctorView data={organRequests} type="organ-requests" />}
        {activeTab === 'availability' && user.role === 'doctor' && (
          <DoctorAvailability profile={doctorProfile} onSuccess={fetchDashboardData} />
        )}
      </div>
    </div>
  );
}

function DoctorView({ data, type }) {
  const [statusFilter, setStatusFilter] = useState('');
  const isOrgan = type.startsWith('organ');
  const isRequest = type.endsWith('requests');

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${type}/${id}`, { status });
      window.location.reload();
    } catch { alert('Error updating status'); }
  };

  const filtered = data.filter(d => !statusFilter || d.status === statusFilter);

  return (
    <div>
      <div className="section-header" style={{marginBottom:'1rem'}}>
        <h3 style={{fontSize:'1rem',color:'#222'}}>
          {type.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
        </h3>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{padding:'0.35rem 0.75rem',borderRadius:'20px',border:'1.5px solid #e2e6ea',fontSize:'0.8rem',cursor:'pointer'}}>
          <option value="">All Statuses</option>
          {(isOrgan
            ? (isRequest ? ['pending','fulfilled','rejected'] : ['pending','eligible','completed','rejected'])
            : (isRequest ? ['pending','fulfilled','rejected'] : ['active','expired','used'])
          ).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>{isRequest ? 'Requester' : 'Donor'}</th>
              {isOrgan ? <th>Organ</th> : <th>Blood Type</th>}
              {!isOrgan && !isRequest && <th>Quantity</th>}
              {isRequest && <th>Urgency</th>}
              <th>Hospital</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td>{new Date(d.donation_date || d.requested_date || d.created_at).toLocaleDateString()}</td>
                <td>{d.donor_name || d.requester_name || '—'}</td>
                <td>{d.organ_type || d.blood_type || '—'}</td>
                {!isOrgan && !isRequest && <td>{d.quantity} units</td>}
                {isRequest && <td><span className={`urgency ${d.urgency}`}>{d.urgency}</span></td>}
                <td>{d.hospital_name || '—'}</td>
                <td><span className={`status ${d.status}`}>{d.status}</span></td>
                <td>
                  <select value={d.status} onChange={e => updateStatus(d.id, e.target.value)}
                    style={{fontSize:'0.78rem',padding:'0.25rem 0.5rem',borderRadius:'5px',border:'1px solid #ddd'}}>
                    {(isOrgan
                      ? (isRequest ? ['pending','fulfilled','rejected'] : ['pending','eligible','completed','rejected'])
                      : (isRequest ? ['pending','fulfilled','rejected'] : ['active','expired','used'])
                    ).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DoctorAvailability({ profile, onSuccess }) {
  const [accountStatus, setAccountStatus] = useState('active');
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [schedule, setSchedule] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setAccountStatus(profile.status || 'active');
      setAvailabilityStatus(profile.availability_status || 'available');
      setSchedule(profile.schedule || '');
    }
  }, [profile]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.put(`${API_URL}/doctors/me/availability`, {
        status: accountStatus,
        availability_status: availabilityStatus,
        schedule
      });
      setMessage('Availability updated successfully!');
      onSuccess();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error updating availability');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p>Loading doctor profile...</p>;

  return (
    <div className="donate-section">
      <h2>My Availability</h2>
      <p><strong>Hospital:</strong> {profile.hospital_name || '—'}</p>
      {message && (
        <div className={message.includes('success') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}
      <form onSubmit={save} className="donation-form">
        <div className="form-group">
          <label>Account Status</label>
          <select value={accountStatus} onChange={(e) => setAccountStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="form-group">
          <label>Availability Status</label>
          <select value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)}>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="on_leave">On Leave</option>
            <option value="off_duty">Off Duty</option>
          </select>
        </div>
        <div className="form-group">
          <label>Schedule</label>
          <input
            type="text"
            placeholder="e.g. Mon-Fri 9am-5pm"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Availability'}
        </button>
      </form>
    </div>
  );
}

function Overview({ stats, user }) {
  return (
    <div className="overview">
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <h3>Total Donors</h3>
          <p className="stat-number">{stats.totalDonors || 0}</p>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">🏥</div>
          <h3>Total Hospitals</h3>
          <p className="stat-number">{stats.totalHospitals || 0}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🩸</div>
          <h3>Total Donations</h3>
          <p className="stat-number">{stats.totalDonations || 0}</p>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
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
  const [filters, setFilters] = useState({
    bdStatus: '', bdType: '',
    odStatus: '', odType: '',
    brStatus: '', brType: '', brUrgency: '',
    orStatus: '', orType: '', orUrgency: '',
    dateRange: '',
  });

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const getDateCutoff = () => {
    if (!filters.dateRange) return null;
    const now = new Date();
    const days = { 'week': 7, 'month': 30, '3months': 90, '6months': 180, 'year': 365 }[filters.dateRange];
    return new Date(now - days * 86400000);
  };

  const inDateRange = (dateStr) => {
    const cutoff = getDateCutoff();
    return !cutoff || new Date(dateStr) >= cutoff;
  };

  const filteredDonations = donations.filter(d =>
    (!filters.bdStatus || d.status === filters.bdStatus) &&
    (!filters.bdType || d.blood_type === filters.bdType) &&
    inDateRange(d.donation_date)
  );
  const filteredOrganDonations = organDonations.filter(d =>
    (!filters.odStatus || d.status === filters.odStatus) &&
    (!filters.odType || d.organ_type === filters.odType) &&
    inDateRange(d.donation_date || d.created_at)
  );
  const filteredRequests = requests.filter(r =>
    (!filters.brStatus || r.status === filters.brStatus) &&
    (!filters.brType || r.blood_type === filters.brType) &&
    (!filters.brUrgency || r.urgency === filters.brUrgency) &&
    inDateRange(r.requested_date)
  );
  const filteredOrganRequests = organRequests.filter(r =>
    (!filters.orStatus || r.status === filters.orStatus) &&
    (!filters.orType || r.organ_type === filters.orType) &&
    (!filters.orUrgency || r.urgency === filters.orUrgency) &&
    inDateRange(r.requested_date)
  );

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
      <div className="history-date-filter">
        <label>Show:</label>
        <select value={filters.dateRange} onChange={e => setFilter('dateRange', e.target.value)}>
          <option value="">All Time</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="year">Last Year</option>
        </select>
      </div>
      <div className="history-section">
        <h3>My Blood Donations</h3>
        <div className="history-filters">
          <select value={filters.bdType} onChange={e => setFilter('bdType', e.target.value)}>
            <option value="">All Blood Types</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filters.bdStatus} onChange={e => setFilter('bdStatus', e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="used">Used</option>
          </select>
        </div>
        <div className="history-table">
          {filteredDonations.length > 0 ? (
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
                {filteredDonations.map(donation => (
                  <tr key={donation.id}>
                    <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
                    <td>{donation.blood_type}</td>
                    <td>{donation.quantity} units</td>
                    <td>{donation.hospital_name || 'N/A'}</td>
                    <td><span className={`status ${donation.status}`}>{donation.status}</span></td>
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
        <div className="history-filters">
          <select value={filters.odType} onChange={e => setFilter('odType', e.target.value)}>
            <option value="">All Organs</option>
            <option value="Heart">Heart</option>
            <option value="Kidneys">Kidneys</option>
            <option value="Kidney">Kidney</option>
            <option value="Corneas">Corneas</option>
            <option value="Liver">Liver</option>
          </select>
          <select value={filters.odStatus} onChange={e => setFilter('odStatus', e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="eligible">Eligible</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="history-table">
          {filteredOrganDonations.length > 0 ? (
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
                {filteredOrganDonations.map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.donation_date ? new Date(donation.donation_date).toLocaleDateString() : 'Pending'}</td>
                    <td>{donation.organ_type}</td>
                    <td>{donation.hospital_name || 'N/A'}</td>
                    <td><span className={`status ${donation.status}`}>{donation.status}</span></td>
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
        <div className="history-filters">
          <select value={filters.brType} onChange={e => setFilter('brType', e.target.value)}>
            <option value="">All Blood Types</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filters.brUrgency} onChange={e => setFilter('brUrgency', e.target.value)}>
            <option value="">All Urgencies</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select value={filters.brStatus} onChange={e => setFilter('brStatus', e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="history-table">
          {filteredRequests.length > 0 ? (
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
                {filteredRequests.map(request => (
                  <tr key={request.id}>
                    <td>{new Date(request.requested_date).toLocaleDateString()}</td>
                    <td>{request.blood_type}</td>
                    <td>{request.quantity} units</td>
                    <td><span className={`urgency ${request.urgency}`}>{request.urgency}</span></td>
                    <td><span className={`status ${request.status}`}>{request.status}</span></td>
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
        <div className="history-filters">
          <select value={filters.orType} onChange={e => setFilter('orType', e.target.value)}>
            <option value="">All Organs</option>
            <option value="Heart">Heart</option>
            <option value="Kidneys">Kidneys</option>
            <option value="Kidney">Kidney</option>
            <option value="Corneas">Corneas</option>
            <option value="Liver">Liver</option>
          </select>
          <select value={filters.orUrgency} onChange={e => setFilter('orUrgency', e.target.value)}>
            <option value="">All Urgencies</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select value={filters.orStatus} onChange={e => setFilter('orStatus', e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="history-table">
          {filteredOrganRequests.length > 0 ? (
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
                {filteredOrganRequests.map(request => (
                  <tr key={request.id}>
                    <td>{new Date(request.requested_date).toLocaleDateString()}</td>
                    <td>{request.organ_type}</td>
                    <td><span className={`urgency ${request.urgency}`}>{request.urgency}</span></td>
                    <td><span className={`status ${request.status}`}>{request.status}</span></td>
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSOP, setShowSOP] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent_sop_accepted) {
      setMessage('You must read and accept the SOP to proceed');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/organ-donations`, {
        ...formData,
        consent_sop_accepted: formData.consent_sop_accepted ? 1 : 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Organ donation registered successfully!');
      setFormData({
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
      onSuccess();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error registering organ donation');
    } finally {
      setLoading(false);
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
    <div className="donate-section">
      <h2>Organ Donation Registration Form</h2>
      {message && <div className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</div>}
      
      <form onSubmit={handleSubmit} className="donation-form">
        {/* Organ Selection */}
        <div className="form-section">
          <h3>Organ Selection</h3>
          <div className="form-group">
            <label>Select Organ *</label>
            <select name="organ_type" value={formData.organ_type} onChange={handleChange} required>
              <option value="">Choose organ...</option>
              <option value="Heart">Heart (Deceased Donation Only)</option>
              <option value="Kidney">Kidney</option>
              <option value="Eye">Eye (Cornea)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hospital *</label>
            <select name="hospital_id" value={formData.hospital_id} onChange={handleChange} required>
              <option value="">Select hospital...</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Medical Information */}
        <div className="form-section">
          <h3>Medical Information</h3>
          
          <div className="form-group">
            <label>Existing Diseases/Medical Conditions *</label>
            <textarea 
              name="medical_diseases" 
              value={formData.medical_diseases} 
              onChange={handleChange}
              placeholder="List any chronic diseases, heart conditions, kidney problems, etc."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Allergies *</label>
            <textarea 
              name="allergies" 
              value={formData.allergies} 
              onChange={handleChange}
              placeholder="List any drug allergies, food allergies, or write 'None'"
              rows="2"
              required
            />
          </div>

          <div className="form-group">
            <label>Blood Pressure *</label>
            <input 
              type="text" 
              name="blood_pressure" 
              value={formData.blood_pressure} 
              onChange={handleChange}
              placeholder="e.g., 120/80 mmHg or Normal"
              required
            />
          </div>

          <div className="form-group">
            <label>Diabetes Status *</label>
            <select name="diabetes" value={formData.diabetes} onChange={handleChange} required>
              <option value="no">No</option>
              <option value="type1">Type 1 Diabetes</option>
              <option value="type2">Type 2 Diabetes</option>
              <option value="prediabetic">Pre-diabetic</option>
            </select>
          </div>

          <div className="form-group">
            <label>Current Medications</label>
            <textarea 
              name="current_medications" 
              value={formData.current_medications} 
              onChange={handleChange}
              placeholder="List all medications you are currently taking"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Previous Surgeries</label>
            <textarea 
              name="previous_surgeries" 
              value={formData.previous_surgeries} 
              onChange={handleChange}
              placeholder="List any previous surgeries with approximate dates"
              rows="2"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="form-section">
          <h3>Emergency Contact</h3>
          
          <div className="form-group">
            <label>Emergency Contact Name *</label>
            <input 
              type="text" 
              name="emergency_contact_name" 
              value={formData.emergency_contact_name} 
              onChange={handleChange}
              placeholder="Full name"
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
              placeholder="10-digit phone number"
              required
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div className="form-group">
          <label>Additional Notes</label>
          <textarea 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange}
            placeholder="Any other information you'd like to share"
            rows="3"
          />
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
              
              {formData.organ_type === 'Heart' && (
                <div>
                  <h5>Heart Donation (Deceased Only)</h5>
                  <ul>
                    <li><strong>Eligibility:</strong> Brain death certification required, age 18-55 years</li>
                    <li><strong>Evaluation:</strong> Echocardiogram, ECG, cardiac enzymes, tissue typing</li>
                    <li><strong>Procedure:</strong> Multi-organ retrieval surgery, cold preservation</li>
                    <li><strong>Time Critical:</strong> Must transplant within 4-6 hours</li>
                    <li><strong>Family Consent:</strong> Required after brain death declaration</li>
                    <li><strong>Success Rate:</strong> 90% one-year survival</li>
                  </ul>
                  <p><a href="https://github.com/yourusername/blood-organ-donation/blob/main/SOP_HEART_DONATION.md" target="_blank" rel="noopener noreferrer">Read Full Heart Donation SOP</a></p>
                </div>
              )}
              
              {formData.organ_type === 'Kidney' && (
                <div>
                  <h5>Kidney Donation (Living & Deceased)</h5>
                  <ul>
                    <li><strong>Eligibility:</strong> Age 18-65, BMI &lt;35, two healthy kidneys, GFR &gt;80</li>
                    <li><strong>Evaluation:</strong> 3-phase screening (medical, imaging, psychological)</li>
                    <li><strong>Surgery:</strong> Laparoscopic nephrectomy, 2-3 hours, 2-3 day hospital stay</li>
                    <li><strong>Recovery:</strong> 4-6 weeks, return to normal activities</li>
                    <li><strong>Risks:</strong> Bleeding (1-2%), infection (1-2%), long-term hypertension (5-10%)</li>
                    <li><strong>Follow-up:</strong> Lifelong annual check-ups required</li>
                  </ul>
                  <p><a href="https://github.com/yourusername/blood-organ-donation/blob/main/SOP_KIDNEY_DONATION.md" target="_blank" rel="noopener noreferrer">Read Full Kidney Donation SOP</a></p>
                </div>
              )}
              
              {formData.organ_type === 'Eye' && (
                <div>
                  <h5>Eye (Cornea) Donation (Deceased Only)</h5>
                  <ul>
                    <li><strong>Eligibility:</strong> All ages (1-75 years), within 6-8 hours after death</li>
                    <li><strong>Procedure:</strong> Eye retrieval (30-40 minutes), prosthetic eyes placed</li>
                    <li><strong>Preservation:</strong> Up to 14 days in preservation medium</li>
                    <li><strong>Transplant:</strong> Corneal transplant restores vision, 80-90% success rate</li>
                    <li><strong>Funeral:</strong> Open casket possible, no visible difference</li>
                    <li><strong>Impact:</strong> One donor can help 2 people (both corneas)</li>
                  </ul>
                  <p><a href="https://github.com/yourusername/blood-organ-donation/blob/main/SOP_EYE_DONATION.md" target="_blank" rel="noopener noreferrer">Read Full Eye Donation SOP</a></p>
                </div>
              )}
              
              {!formData.organ_type && (
                <div>
                  <p><strong>Please select an organ type above to view specific SOP information.</strong></p>
                  <ul>
                    <li><a href="https://github.com/yourusername/blood-organ-donation/blob/main/SOP_HEART_DONATION.md" target="_blank" rel="noopener noreferrer">Heart Donation SOP</a></li>
                    <li><a href="https://github.com/yourusername/blood-organ-donation/blob/main/SOP_KIDNEY_DONATION.md" target="_blank" rel="noopener noreferrer">Kidney Donation SOP</a></li>
                    <li><a href="https://github.com/yourusername/blood-organ-donation/blob/main/SOP_EYE_DONATION.md" target="_blank" rel="noopener noreferrer">Eye Donation SOP</a></li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="checkbox-group">
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
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Submitting...' : 'Submit Registration'}
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
