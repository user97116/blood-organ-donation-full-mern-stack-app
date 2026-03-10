import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Login, Register, AdminRegister } from './Auth';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';
import ChatAssistant from './ChatAssistant';
import OrganDonation from './OrganDonation';
import OrganRequest from './OrganRequest';
import OrganInventory from './OrganInventory';
import MedicalHistory from './MedicalHistory';
import './App.css';

const API_URL = 'http://localhost:5000/api';

// Set up axios interceptor for auth
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token added to request:', token.substring(0, 20) + '...');
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log('Token from localStorage:', token ? token.substring(0, 20) + '...' : 'none');
    console.log('User from localStorage:', userData);
    
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
          <Route path="/chat" element={user ? <ChatAssistant /> : <Navigate to="/login" />} />
          <Route path="/organ-donation" element={user ? <OrganDonation /> : <Navigate to="/login" />} />
          <Route path="/organ-request" element={user ? <OrganRequest /> : <Navigate to="/login" />} />
          <Route path="/organ-inventory" element={user?.role === 'admin' ? <OrganInventory /> : <Navigate to="/dashboard" />} />
          <Route path="/medical-history" element={user ? <MedicalHistory /> : <Navigate to="/login" />} />
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
            <Link to="/chat">AI Assistant</Link>
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
  const [organInventory, setOrganInventory] = useState([]);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const inventoryRes = await axios.get(`${API_URL}/blood-inventory`);
      setInventory(inventoryRes.data);
      // Don't fetch organ-inventory for public - it requires auth
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getOrganCount = (organType) => {
    if (!organInventory || !Array.isArray(organInventory)) return 0;
    return organInventory.filter(o => 
      o.organ_type === organType && 
      (o.status === 'pending' || o.status === 'eligible')
    ).length;
  };

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
          <h2>Available Organ Donors</h2>
          <p className="organ-intro">Organ donation requires authentication. Please login to view organ availability and make requests.</p>
          <div className="organ-availability-grid">
            <div className="organ-card">
              <div className="organ-icon">❤️</div>
              <h3>Heart</h3>
              <p className="organ-count">Login to view</p>
              <button onClick={handleActionClick} className="request-btn">Request</button>
            </div>
            <div className="organ-card">
              <div className="organ-icon">🫘</div>
              <h3>Kidney</h3>
              <p className="organ-count">Login to view</p>
              <button onClick={handleActionClick} className="request-btn">Request</button>
            </div>
            <div className="organ-card">
              <div className="organ-icon">👁️</div>
              <h3>Eye</h3>
              <p className="organ-count">Login to view</p>
              <button onClick={handleActionClick} className="request-btn">Request</button>
            </div>
          </div>
        </div>
      </div>
      <div className="sop-section">
        <h2>Standard Operating Procedures (SOP) for Organ Donation</h2>
        <p className="sop-intro">Complete guidelines and protocols for safe organ donation</p>
        
        <div className="sop-grid">
          <div className="sop-card">
            <div className="sop-header">
              <span className="sop-icon">❤️</span>
              <h3>Heart Donation</h3>
              <span className="sop-badge">Deceased Only</span>
            </div>
            <div className="sop-content">
              <h4>Eligibility Criteria</h4>
              <ul>
                <li>Age: 18-55 years (up to 65 in exceptional cases)</li>
                <li>Brain death certification required</li>
                <li>Normal cardiac function (EF ≥45%)</li>
                <li>No active infections or heart disease</li>
              </ul>
              <h4>Key Requirements</h4>
              <ul>
                <li>Two independent physicians must certify brain death</li>
                <li>Echocardiogram and cardiac evaluation</li>
                <li>Family consent and legal authorization</li>
                <li>Hemodynamic stability maintained</li>
              </ul>
            </div>
          </div>

          <div className="sop-card">
            <div className="sop-header">
              <span className="sop-icon">🫘</span>
              <h3>Kidney Donation</h3>
              <span className="sop-badge">Living & Deceased</span>
            </div>
            <div className="sop-content">
              <h4>Eligibility Criteria</h4>
              <ul>
                <li>Age: 18-65 years (living), up to 70 (deceased)</li>
                <li>Normal kidney function (GFR ≥80 ml/min)</li>
                <li>BMI: 18-35 kg/m²</li>
                <li>Blood pressure controlled</li>
              </ul>
              <h4>Evaluation Process</h4>
              <ul>
                <li>Phase 1: Medical history & blood tests</li>
                <li>Phase 2: Imaging (CT/MRI) & tissue typing</li>
                <li>Phase 3: Psychological evaluation</li>
                <li>Lifelong follow-up for living donors</li>
              </ul>
            </div>
          </div>

          <div className="sop-card">
            <div className="sop-header">
              <span className="sop-icon">👁️</span>
              <h3>Eye (Cornea) Donation</h3>
              <span className="sop-badge">Deceased Only</span>
            </div>
            <div className="sop-content">
              <h4>Eligibility Criteria</h4>
              <ul>
                <li>Age: All ages (newborn to elderly)</li>
                <li>Retrieval within 6-8 hours of death</li>
                <li>No active eye infections</li>
                <li>Previous eye surgery not a contraindication</li>
              </ul>
              <h4>Key Points</h4>
              <ul>
                <li>Most liberal eligibility criteria</li>
                <li>Can restore sight to corneal blind</li>
                <li>Minimal disfigurement (prosthetic placed)</li>
                <li>Stored in preservation media (14 days)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="sop-footer">
          <p><strong>Important:</strong> All donors must read and accept organ-specific SOP before registration. Complete medical evaluation and consent forms are mandatory.</p>
          <Link to="/register" className="sop-cta-button">Register as Organ Donor</Link>
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
