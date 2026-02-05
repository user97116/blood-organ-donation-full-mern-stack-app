import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Login, Register, AdminRegister } from './Auth';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';
import './App.css';

const API_URL = 'http://localhost:5000/api';

// Set up axios interceptor for auth
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      <div className="App">
        <Navbar user={user} logout={logout} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/register" element={!user ? <AdminRegister setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

function Navbar({ user, logout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">🩸 BloodBank Pro</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <span className="welcome">Welcome, {user.name}</span>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/admin/register">Admin Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Home() {
  const [inventory, setInventory] = useState([]);
  const [donors, setDonors] = useState([]);
  const [organInventory, setOrganInventory] = useState([]);
  const [filters, setFilters] = useState({
    bloodType: '',
    organType: '',
    location: ''
  });

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const [inventoryRes, donorsRes, organInventoryRes] = await Promise.all([
        axios.get(`${API_URL}/blood-inventory`),
        axios.get(`${API_URL}/donors`),
        axios.get(`${API_URL}/organ-inventory`)
      ]);
      
      setInventory(inventoryRes.data);
      setDonors(donorsRes.data);
      setOrganInventory(organInventoryRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesBloodType = !filters.bloodType || donor.blood_type === filters.bloodType;
    const matchesLocation = !filters.location || donor.address.includes(filters.location);
    
    let matchesOrganType = true;
    if (filters.organType) {
      if (donor.organ_donor && donor.organs_to_donate) {
        try {
          const organs = JSON.parse(donor.organs_to_donate);
          matchesOrganType = organs.includes(filters.organType);
        } catch (e) {
          matchesOrganType = false;
        }
      } else {
        matchesOrganType = false;
      }
    }
    
    return matchesBloodType && matchesLocation && matchesOrganType;
  });

  const handleActionClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Save Lives Through Blood & Organ Donation</h1>
        <p>Join our community of life-savers. Every donation counts.</p>
        <Link to="/register" className="cta-button">Become a Donor</Link>
      </div>

      <div className="search-section">
        <h2>Find Donors</h2>
        <div className="search-filters">
          <select 
            value={filters.bloodType} 
            onChange={(e) => setFilters({...filters, bloodType: e.target.value})}
          >
            <option value="">All Blood Types</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          
          <select 
            value={filters.organType} 
            onChange={(e) => setFilters({...filters, organType: e.target.value})}
          >
            <option value="">All Organ Types</option>
            <option value="Heart">Heart</option>
            <option value="Liver">Liver</option>
            <option value="Kidneys">Kidneys</option>
            <option value="Lungs">Lungs</option>
            <option value="Pancreas">Pancreas</option>
            <option value="Corneas">Corneas</option>
            <option value="Skin">Skin</option>
            <option value="Bone">Bone</option>
          </select>
          
          <select 
            value={filters.location} 
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          >
            <option value="">All Locations</option>
            <option value="Yavatmal">Yavatmal</option>
            <option value="Pusad">Pusad</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Akola">Akola</option>
            <option value="Washim">Washim</option>
            <option value="Amravati">Amravati</option>
            <option value="Buldhana">Buldhana</option>
            <option value="Wardha">Wardha</option>
          </select>
        </div>

        <div className="donors-grid">
          {filteredDonors.length > 0 ? (
            filteredDonors.map(donor => (
              <div key={donor.id} className="donor-card">
                <h4>{donor.name}</h4>
                <p><strong>Blood Type:</strong> {donor.blood_type}</p>
                <p><strong>Location:</strong> {donor.address}</p>
                {donor.organ_donor && donor.organs_to_donate && (
                  <p><strong>Organ Donor:</strong> {
                    (() => {
                      try {
                        return JSON.parse(donor.organs_to_donate).join(', ');
                      } catch (e) {
                        return 'Yes';
                      }
                    })()
                  }</p>
                )}
                <button onClick={handleActionClick} className="contact-btn">Contact Donor</button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No donors found matching your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>

      <div className="inventory-section">
        <div className="blood-inventory">
          <h2>Current Blood Inventory</h2>
          <div className="inventory-grid">
            {inventory.map((item, index) => (
              <div key={index} className="inventory-card">
                <h3>{item.blood_type}</h3>
                <p className="quantity">{item.total_quantity} units</p>
                <p className="units">{item.units} donations</p>
                <p className="expiry">Expires: {new Date(item.earliest_expiry).toLocaleDateString()}</p>
                <button onClick={handleActionClick} className="request-btn">Request Blood</button>
              </div>
            ))}
          </div>
        </div>

        <div className="organ-inventory">
          <h2>Organ Donation Statistics</h2>
          <div className="organ-stats">
            <div className="stat-card">
              <h3>Active Organ Donors</h3>
              <p className="stat-number">{donors.filter(d => d.organ_donor).length}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Organ Donations</h3>
              <p className="stat-number">{organInventory.filter(o => o.status === 'pending').length}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Organ Donations</h3>
              <p className="stat-number">{organInventory.filter(o => o.status === 'completed').length}</p>
            </div>
          </div>
          <button onClick={handleActionClick} className="request-btn">Request Organ</button>
        </div>
      </div>
      <div className="precautions-section">
        <h2>Donation Precautions</h2>
        <div className="precautions-content">
          <div className="precaution-card">
            <h3>Blood Donation</h3>
            <ul>
              <li>Eat a healthy meal and drink plenty of fluids.</li>
              <li>Get a good night's sleep.</li>
              <li>Bring a photo ID.</li>
              <li>Avoid heavy lifting or vigorous exercise for the rest of the day.</li>
            </ul>
          </div>
          <div className="precaution-card">
            <h3>Organ Donation</h3>
            <ul>
              <li>Discuss your decision with your family.</li>
              <li>Register as an organ donor.</li>
              <li>Maintain a healthy lifestyle.</li>
              <li>Your health is a priority; donation only happens after all life-saving efforts have been exhausted.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
