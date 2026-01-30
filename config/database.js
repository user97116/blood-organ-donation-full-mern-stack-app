const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const initializeDatabase = () => {
  const dbPath = path.join(__dirname, '../donation.db');
  const db = new sqlite3.Database(dbPath);

  // Drop existing tables to ensure clean data
  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS organ_requests`);
    db.run(`DROP TABLE IF EXISTS organ_donations`);
    db.run(`DROP TABLE IF EXISTS blood_inventory`);
    db.run(`DROP TABLE IF EXISTS blood_requests`);
    db.run(`DROP TABLE IF EXISTS blood_donations`);
    db.run(`DROP TABLE IF EXISTS doctors`);
    db.run(`DROP TABLE IF EXISTS hospitals`);
    db.run(`DROP TABLE IF EXISTS users`);;

    // Create tables in correct order
    db.run(`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      blood_type TEXT,
      address TEXT,
      age INTEGER,
      gender TEXT,
      organ_donor INTEGER DEFAULT 0,
      organs_to_donate TEXT,
      role TEXT DEFAULT 'donor',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE hospitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      license_number TEXT UNIQUE,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      specialization TEXT,
      hospital_id INTEGER,
      license_number TEXT UNIQUE,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hospital_id) REFERENCES hospitals (id)
    )`);

    db.run(`CREATE TABLE blood_donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_id INTEGER,
      hospital_id INTEGER,
      blood_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      donation_date DATE NOT NULL,
      expiry_date DATE NOT NULL,
      status TEXT DEFAULT 'active',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (donor_id) REFERENCES users (id),
      FOREIGN KEY (hospital_id) REFERENCES hospitals (id)
    )`);

    db.run(`CREATE TABLE blood_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requester_id INTEGER,
      hospital_id INTEGER,
      blood_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      urgency TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'pending',
      requested_date DATE NOT NULL,
      fulfilled_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (requester_id) REFERENCES users (id),
      FOREIGN KEY (hospital_id) REFERENCES hospitals (id)
    )`);

    db.run(`CREATE TABLE blood_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      blood_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      expiry_date DATE NOT NULL,
      hospital_id INTEGER,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hospital_id) REFERENCES hospitals (id)
    )`);

    db.run(`CREATE TABLE organ_donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_id INTEGER,
      hospital_id INTEGER,
      organ_type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      donation_date DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (donor_id) REFERENCES users (id),
      FOREIGN KEY (hospital_id) REFERENCES hospitals (id)
    )`);

    db.run(`CREATE TABLE organ_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requester_id INTEGER,
      hospital_id INTEGER,
      organ_type TEXT NOT NULL,
      urgency TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'pending',
      requested_date DATE NOT NULL,
      fulfilled_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (requester_id) REFERENCES users (id),
      FOREIGN KEY (hospital_id) REFERENCES hospitals (id)
    )`);
  });

  return db;
};

module.exports = { initializeDatabase };
