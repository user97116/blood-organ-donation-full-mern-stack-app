import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrganInventory.css';

const OrganInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/organ-inventory');
      setInventory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const organIcons = {
    heart: '❤️',
    kidney: '🫘',
    eye: '👁️'
  };

  return (
    <div className="organ-inventory-container">
      <h1>Organ Inventory</h1>
      {loading ? (
        <p className="loading">Loading inventory...</p>
      ) : inventory.length === 0 ? (
        <p className="no-data">No organs available in inventory</p>
      ) : (
        <div className="inventory-grid">
          {inventory.map((item, index) => (
            <div key={index} className="inventory-card">
              <div className="organ-icon">{organIcons[item.organ_type] || '🫀'}</div>
              <h3>{item.organ_type}</h3>
              <div className="count">{item.available_count}</div>
              <p className="label">Available</p>
              <span className={`status-badge ${item.status}`}>{item.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganInventory;
