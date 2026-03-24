import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [organDonations, setOrganDonations] = useState([]);
  const [organRequests, setOrganRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      console.log('Fetching admin data...');
      const [statsRes, usersRes, hospitalsRes, doctorsRes, donationsRes, requestsRes, organDonationsRes, organRequestsRes, inventoryRes, doctorRequestsRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`),
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/hospitals`),
        axios.get(`${API_URL}/doctors`),
        axios.get(`${API_URL}/blood-donations`),
        axios.get(`${API_URL}/blood-requests`),
        axios.get(`${API_URL}/organ-donations`),
        axios.get(`${API_URL}/organ-requests`),
        axios.get(`${API_URL}/blood-inventory`),
        axios.get(`${API_URL}/doctor-requests`)
      ]);
      
      console.log('Hospitals:', hospitalsRes.data.length);
      console.log('Doctors:', doctorsRes.data.length);
      console.log('Users:', usersRes.data.length);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setHospitals(hospitalsRes.data);
      setDoctors(doctorsRes.data);
      setDonations(donationsRes.data);
      setRequests(requestsRes.data);
      setOrganDonations(organDonationsRes.data);
      setOrganRequests(organRequestsRes.data);
      setInventory(inventoryRes.data);
      setDoctorRequests(doctorRequestsRes.data);
      
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Error fetching admin data:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(`Error loading admin data: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Blood Bank Management System</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'hospitals' ? 'active' : ''}
          onClick={() => setActiveTab('hospitals')}
        >
          Hospitals
        </button>
        <button 
          className={activeTab === 'doctors' ? 'active' : ''}
          onClick={() => setActiveTab('doctors')}
        >
          Doctors
        </button>
        <button 
          className={activeTab === 'inventory' ? 'active' : ''}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        <button 
          className={activeTab === 'donations' ? 'active' : ''}
          onClick={() => setActiveTab('donations')}
        >
          Donations
        </button>
        <button 
          className={activeTab === 'requests' ? 'active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          Blood Requests
        </button>
        <button
          className={activeTab === 'doctor-requests' ? 'active' : ''}
          onClick={() => setActiveTab('doctor-requests')}
        >
          Doctor Assistance Requests
        </button>
        <button 
          className={activeTab === 'organ-donations' ? 'active' : ''}
          onClick={() => setActiveTab('organ-donations')}
        >
          Organ Donations
        </button>
        <button 
          className={activeTab === 'organ-requests' ? 'active' : ''}
          onClick={() => setActiveTab('organ-requests')}
        >
          Organ Requests
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <AdminDashboard stats={stats} />}
            {activeTab === 'users' && <UserManagement users={users} onUpdate={fetchAdminData} />}
            {activeTab === 'hospitals' && <HospitalManagement hospitals={hospitals} onUpdate={fetchAdminData} />}
            {activeTab === 'doctors' && <DoctorManagement doctors={doctors} hospitals={hospitals} onUpdate={fetchAdminData} />}
            {activeTab === 'inventory' && <InventoryManagement inventory={inventory} />}
            {activeTab === 'donations' && <DonationManagement donations={donations} />}
            {activeTab === 'requests' && <RequestManagement requests={requests} />}
            {activeTab === 'doctor-requests' && (
              <DoctorAssignmentRequests
                requests={doctorRequests}
                doctors={doctors}
                onUpdate={fetchAdminData}
              />
            )}
            {activeTab === 'organ-donations' && <OrganDonationManagement organDonations={organDonations} />}
            {activeTab === 'organ-requests' && <OrganRequestManagement organRequests={organRequests} />}
          </>
        )}
      </div>
    </div>
  );
}

function AdminDashboard({ stats }) {
  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card primary">
          <h3>Total Donors</h3>
          <p className="stat-number">{stats.totalDonors || 0}</p>
        </div>
        <div className="stat-card success">
          <h3>Total Hospitals</h3>
          <p className="stat-number">{stats.totalHospitals || 0}</p>
        </div>
        <div className="stat-card info">
          <h3>Total Donations</h3>
          <p className="stat-number">{stats.totalDonations || 0}</p>
        </div>
        <div className="stat-card warning">
          <h3>Pending Requests</h3>
          <p className="stat-number">{stats.pendingRequests || 0}</p>
        </div>
      </div>
    </div>
  );
}

function UserManagement({ users, onUpdate }) {
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = users.filter(u =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter) &&
    (!statusFilter || u.status === statusFilter)
  );

  const updateUser = async (userId, updates) => {
    try {
      await axios.put(`${API_URL}/users/${userId}`, updates);
      onUpdate();
      setEditingUser(null);
    } catch (error) {
      alert('Error updating user');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`);
        onUpdate();
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
      </div>
      <div className="admin-filters">
        <input placeholder="Search name / email..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="donor">Donor</option>
          <option value="admin">Admin</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Blood Type</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.blood_type || 'N/A'}</td>
                <td>
                  {editingUser === user.id ? (
                    <select 
                      defaultValue={user.role}
                      onChange={(e) => updateUser(user.id, { role: e.target.value, status: user.status })}
                    >
                      <option value="donor">Donor</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <select 
                      defaultValue={user.status}
                      onChange={(e) => updateUser(user.id, { role: user.role, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`status ${user.status}`}>{user.status}</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                      className="edit-btn"
                    >
                      {editingUser === user.id ? 'Cancel' : 'Edit'}
                    </button>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HospitalManagement({ hospitals, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [formData, setFormData] = useState({
    name: '', address: '', phone: '', email: '', license_number: ''
  });

  console.log('HospitalManagement - hospitals count:', hospitals.length);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHospital) {
        await axios.put(`${API_URL}/hospitals/${editingHospital.id}`, { ...formData, status: editingHospital.status });
      } else {
        await axios.post(`${API_URL}/hospitals`, formData);
      }
      setFormData({ name: '', address: '', phone: '', email: '', license_number: '' });
      setShowForm(false);
      setEditingHospital(null);
      onUpdate();
    } catch (error) {
      alert('Error saving hospital');
    }
  };

  const deleteHospital = async (id) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      try {
        await axios.delete(`${API_URL}/hospitals/${id}`);
        onUpdate();
      } catch (error) {
        alert('Error deleting hospital');
      }
    }
  };

  const editHospital = (hospital) => {
    setEditingHospital(hospital);
    setFormData({
      name: hospital.name,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email,
      license_number: hospital.license_number
    });
    setShowForm(true);
  };

  return (
    <div className="hospital-management">
      <div className="section-header">
        <h2>Hospital Management</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="add-btn"
        >
          {showForm ? 'Cancel' : 'Add Hospital'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingHospital ? 'Edit Hospital' : 'Add New Hospital'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Hospital Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-row">
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="License Number"
                value={formData.license_number}
                onChange={(e) => setFormData({...formData, license_number: e.target.value})}
              />
            </div>
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
            <button type="submit" className="submit-btn">
              {editingHospital ? 'Update Hospital' : 'Add Hospital'}
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>License</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No hospitals found. Click "Add Hospital" to add one.
                </td>
              </tr>
            ) : (
              hospitals.map(hospital => (
                <tr key={hospital.id}>
                  <td>{hospital.name}</td>
                  <td>{hospital.address}</td>
                  <td>{hospital.phone}</td>
                  <td>{hospital.email}</td>
                  <td>{hospital.license_number}</td>
                  <td><span className={`status ${hospital.status}`}>{hospital.status}</span></td>
                  <td>
                    <button onClick={() => editHospital(hospital)} className="edit-btn">Edit</button>
                    <button onClick={() => deleteHospital(hospital.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DoctorManagement({ doctors, hospitals, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', specialization: '', hospital_id: '', license_number: ''
  });
  const [doctorEdits, setDoctorEdits] = useState({});

  console.log('DoctorManagement - doctors count:', doctors.length);

  useEffect(() => {
    const initial = {};
    doctors.forEach((doctor) => {
      initial[doctor.id] = {
        status: doctor.status || 'active',
        availability_status: doctor.availability_status || 'available',
        schedule: doctor.schedule || ''
      };
    });
    setDoctorEdits(initial);
  }, [doctors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/doctors`, formData);
      setFormData({ name: '', email: '', phone: '', specialization: '', hospital_id: '', license_number: '' });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      alert('Error adding doctor');
    }
  };

  const updateDoctorAvailability = async (doctorId) => {
    try {
      await axios.put(`${API_URL}/doctors/${doctorId}`, doctorEdits[doctorId]);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.error || 'Error updating doctor availability');
    }
  };

  return (
    <div className="doctor-management">
      <div className="section-header">
        <h2>Doctor Management</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="add-btn"
        >
          {showForm ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>Add New Doctor</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Doctor Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              />
            </div>
            <div className="form-row">
              <select
                value={formData.hospital_id}
                onChange={(e) => setFormData({...formData, hospital_id: e.target.value})}
                required
              >
                <option value="">Select Hospital</option>
                {hospitals.map(hospital => (
                  <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="License Number"
                value={formData.license_number}
                onChange={(e) => setFormData({...formData, license_number: e.target.value})}
              />
            </div>
            <button type="submit" className="submit-btn">Add Doctor</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Hospital</th>
              <th>License</th>
              <th>Account Status</th>
              <th>Availability</th>
              <th>Schedule</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                  No doctors found. Click "Add Doctor" to add one.
                </td>
              </tr>
            ) : (
              doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.hospital_name}</td>
                  <td>{doctor.license_number}</td>
                  <td>
                    <select
                      value={doctorEdits[doctor.id]?.status || 'active'}
                      onChange={(e) =>
                        setDoctorEdits((prev) => ({
                          ...prev,
                          [doctor.id]: { ...prev[doctor.id], status: e.target.value }
                        }))
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={doctorEdits[doctor.id]?.availability_status || 'available'}
                      onChange={(e) =>
                        setDoctorEdits((prev) => ({
                          ...prev,
                          [doctor.id]: { ...prev[doctor.id], availability_status: e.target.value }
                        }))
                      }
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="on_leave">On Leave</option>
                      <option value="off_duty">Off Duty</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="e.g. Mon-Fri 9am-5pm"
                      value={doctorEdits[doctor.id]?.schedule || ''}
                      onChange={(e) =>
                        setDoctorEdits((prev) => ({
                          ...prev,
                          [doctor.id]: { ...prev[doctor.id], schedule: e.target.value }
                        }))
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => updateDoctorAvailability(doctor.id)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryManagement({ inventory }) {
  return (
    <div className="inventory-management">
      <h2>Blood Inventory</h2>
      <div className="inventory-grid">
        {inventory.map((item, index) => (
          <div key={index} className="inventory-card">
            <h3>{item.blood_type}</h3>
            <div className="inventory-details">
              <p><strong>Total Units:</strong> {item.total_quantity}</p>
              <p><strong>Donations:</strong> {item.units}</p>
              <p><strong>Earliest Expiry:</strong> {new Date(item.earliest_expiry).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonationManagement({ donations }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = donations.filter(d =>
    (!statusFilter || d.status === statusFilter) &&
    (!typeFilter || d.blood_type === typeFilter)
  );

  const updateDonationStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/blood-donations/${id}`, { status });
      window.location.reload();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const deleteDonation = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        await axios.delete(`${API_URL}/blood-donations/${id}`);
        window.location.reload();
      } catch (error) {
        alert('Error deleting donation');
      }
    }
  };

  return (
    <div className="donation-management">
      <div className="section-header"><h2>All Blood Donations</h2></div>
      <div className="admin-filters">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Blood Types</option>
          {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="used">Used</option>
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Donor</th><th>Blood Type</th><th>Quantity</th><th>Hospital</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(donation => (
              <tr key={donation.id}>
                <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
                <td>{donation.donor_name}</td>
                <td>{donation.blood_type}</td>
                <td>{donation.quantity} units</td>
                <td>{donation.hospital_name || 'N/A'}</td>
                <td><span className={`status ${donation.status}`}>{donation.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <select 
                      value={donation.status} 
                      onChange={(e) => updateDonationStatus(donation.id, e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="used">Used</option>
                    </select>
                    <button 
                      onClick={() => deleteDonation(donation.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RequestManagement({ requests }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');

  const filtered = requests.filter(r =>
    (!statusFilter || r.status === statusFilter) &&
    (!typeFilter || r.blood_type === typeFilter) &&
    (!urgencyFilter || r.urgency === urgencyFilter)
  );

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/blood-requests/${id}`, { status });
      window.location.reload();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await axios.delete(`${API_URL}/blood-requests/${id}`);
        window.location.reload();
      } catch (error) {
        alert('Error deleting request');
      }
    }
  };

  return (
    <div className="request-management">
      <div className="section-header"><h2>All Blood Requests</h2></div>
      <div className="admin-filters">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Blood Types</option>
          {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}>
          <option value="">All Urgencies</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Requester</th><th>Blood Type</th><th>Quantity</th><th>Urgency</th><th>Hospital</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(request => (
              <tr key={request.id}>
                <td>{new Date(request.requested_date).toLocaleDateString()}</td>
                <td>{request.requester_name}</td>
                <td>{request.blood_type}</td>
                <td>{request.quantity} units</td>
                <td><span className={`urgency ${request.urgency}`}>{request.urgency}</span></td>
                <td>{request.hospital_name || 'N/A'}</td>
                <td><span className={`status ${request.status}`}>{request.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <select 
                      value={request.status} 
                      onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button 
                      onClick={() => deleteRequest(request.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrganDonationManagement({ organDonations }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = organDonations.filter(d =>
    (!statusFilter || d.status === statusFilter) &&
    (!typeFilter || d.organ_type === typeFilter)
  );

  const updateOrganDonationStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/organ-donations/${id}`, { status });
      window.location.reload();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const deleteOrganDonation = async (id) => {
    if (window.confirm('Are you sure you want to delete this organ donation?')) {
      try {
        await axios.delete(`${API_URL}/organ-donations/${id}`);
        window.location.reload();
      } catch (error) {
        alert('Error deleting organ donation');
      }
    }
  };

  return (
    <div className="organ-donation-management">
      <div className="section-header"><h2>All Organ Donations</h2></div>
      <div className="admin-filters">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Organs</option>
          <option value="heart">Heart</option>
          <option value="kidney">Kidney</option>
          <option value="eye">Eye</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="eligible">Eligible</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Donor</th><th>Organ Type</th><th>Hospital</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(donation => (
              <tr key={donation.id}>
                <td>{donation.donation_date ? new Date(donation.donation_date).toLocaleDateString() : 'Pending'}</td>
                <td>{donation.donor_name}</td>
                <td>{donation.organ_type}</td>
                <td>{donation.hospital_name || 'N/A'}</td>
                <td><span className={`status ${donation.status}`}>{donation.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <select 
                      value={donation.status} 
                      onChange={(e) => updateOrganDonationStatus(donation.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="eligible">Eligible</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button 
                      onClick={() => deleteOrganDonation(donation.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrganRequestManagement({ organRequests }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');

  const filtered = organRequests.filter(r =>
    (!statusFilter || r.status === statusFilter) &&
    (!typeFilter || r.organ_type === typeFilter) &&
    (!urgencyFilter || r.urgency === urgencyFilter)
  );

  const updateOrganRequestStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/organ-requests/${id}`, { status });
      window.location.reload();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const deleteOrganRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this organ request?')) {
      try {
        await axios.delete(`${API_URL}/organ-requests/${id}`);
        window.location.reload();
      } catch (error) {
        alert('Error deleting organ request');
      }
    }
  };

  return (
    <div className="organ-request-management">
      <div className="section-header"><h2>All Organ Requests</h2></div>
      <div className="admin-filters">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Organs</option>
          <option value="heart">Heart</option>
          <option value="kidney">Kidney</option>
          <option value="eye">Eye</option>
        </select>
        <select value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}>
          <option value="">All Urgencies</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Requester</th><th>Organ Type</th><th>Urgency</th><th>Hospital</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(request => (
              <tr key={request.id}>
                <td>{new Date(request.requested_date).toLocaleDateString()}</td>
                <td>{request.requester_name}</td>
                <td>{request.organ_type}</td>
                <td><span className={`urgency ${request.urgency}`}>{request.urgency}</span></td>
                <td>{request.hospital_name || 'N/A'}</td>
                <td><span className={`status ${request.status}`}>{request.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <select 
                      value={request.status} 
                      onChange={(e) => updateOrganRequestStatus(request.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button 
                      onClick={() => deleteOrganRequest(request.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DoctorAssignmentRequests({ requests, doctors, onUpdate }) {
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = requests.filter(r => !statusFilter || r.status === statusFilter);

  const assignDoctor = async (requestId, doctorId) => {
    try {
      await axios.put(`${API_URL}/doctor-requests/${requestId}/assign`, { doctor_id: doctorId });
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.error || 'Error assigning doctor');
    }
  };

  return (
    <div className="doctor-assignment-requests">
      <div className="section-header">
        <h2>Doctor Assistance Requests</h2>
      </div>

      <div className="admin-filters">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Requester</th>
              <th>Hospital</th>
              <th>Topic</th>
              <th>Message</th>
              <th>Status</th>
              <th>Assign Doctor</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(r => {
                const availableDoctors = doctors.filter(d => d.hospital_id === r.hospital_id);
                return (
                  <tr key={r.id}>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>{r.requester_name || '—'}</td>
                    <td>{r.hospital_name || '—'}</td>
                    <td>{r.topic || '—'}</td>
                    <td style={{ maxWidth: 280, wordBreak: 'break-word' }}>{r.message}</td>
                    <td><span className={`status ${r.status}`}>{r.status}</span></td>
                    <td>
                      <select
                        value={r.assigned_doctor_id || ''}
                        onChange={(e) => {
                          const doctorId = e.target.value;
                          if (!doctorId) return;
                          assignDoctor(r.id, doctorId);
                        }}
                      >
                        <option value="">Select doctor</option>
                        {availableDoctors.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.specialization || '—'})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No doctor assistance requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;
