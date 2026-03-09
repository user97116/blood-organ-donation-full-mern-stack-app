const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'donation.db'));

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['Male', 'Female', 'Other'];
const organTypes = ['Heart', 'Kidney', 'Eye'];
const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Available', 'Pending', 'Completed', 'Expired'];

const firstNames = ['Amit', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Pooja', 'Arjun', 'Kavita', 'Sanjay', 'Meera', 'Aditya', 'Neha', 'Karan', 'Divya', 'Rajesh', 'Swati', 'Nikhil', 'Ritu', 'Manish', 'Shreya', 'Deepak', 'Anita', 'Suresh'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Deshmukh', 'Kulkarni', 'Joshi', 'Mehta', 'Gupta', 'Reddy', 'Rao', 'Nair', 'Iyer', 'Verma', 'Agarwal', 'Chopra', 'Malhotra', 'Kapoor', 'Bhatia', 'Sinha'];
const cities = ['Yavatmal', 'Hingoli', 'Nagpur', 'Akola', 'Washim', 'Amravati', 'Buldhana', 'Wardha', 'Pusad', 'Wani'];

const hospitals = [
  ['Yavatmal District Hospital', 'Civil Lines, Yavatmal 445001', '07232-242345', 'admin@yavatmalhosp.gov.in', 'LIC001'],
  ['Pusad General Hospital', 'Main Road, Pusad 445204', '07232-222456', 'contact@pusadhosp.com', 'LIC002'],
  ['Hingoli District Hospital', 'Station Road, Hingoli 431513', '02456-242100', 'admin@hingolihosp.gov.in', 'LIC003'],
  ['Nagpur Medical College', 'Hanuman Nagar, Nagpur 440003', '0712-2740103', 'info@nmc.edu', 'LIC004'],
  ['AIIMS Nagpur', 'MIHAN, Nagpur 441108', '0712-2969999', 'aiims@nagpur.edu.in', 'LIC005'],
  ['Akola Civil Hospital', 'Station Road, Akola 444001', '0724-2420567', 'emergency@akolahosp.gov.in', 'LIC006'],
  ['Washim District Hospital', 'Hospital Road, Washim 444505', '07252-242789', 'help@washimhosp.gov.in', 'LIC007'],
  ['Amravati Medical Center', 'Rajkamal Chowk, Amravati 444601', '0721-2662890', 'info@amravatimedical.com', 'LIC008'],
  ['Buldhana Civil Hospital', 'Collectorate Road, Buldhana 443001', '07262-242123', 'contact@buldhanacivil.gov.in', 'LIC009'],
  ['Wardha District Hospital', 'Gandhi Chowk, Wardha 442001', '07152-242456', 'care@wardhahosp.gov.in', 'LIC010']
];

const doctors = [
  ['Dr. Rajesh Deshmukh', 'rajesh.d@hospital.com', '9876543210', 'Cardiology'],
  ['Dr. Priya Kulkarni', 'priya.k@hospital.com', '9876543211', 'Nephrology'],
  ['Dr. Amit Sharma', 'amit.s@hospital.com', '9876543212', 'Ophthalmology'],
  ['Dr. Sneha Patel', 'sneha.p@hospital.com', '9876543213', 'General Surgery'],
  ['Dr. Vikram Singh', 'vikram.s@hospital.com', '9876543214', 'Transplant Surgery'],
  ['Dr. Anjali Mehta', 'anjali.m@hospital.com', '9876543215', 'Anesthesiology'],
  ['Dr. Rohan Gupta', 'rohan.g@hospital.com', '9876543216', 'Critical Care'],
  ['Dr. Kavita Reddy', 'kavita.r@hospital.com', '9876543217', 'Nephrology'],
  ['Dr. Sanjay Verma', 'sanjay.v@hospital.com', '9876543218', 'Cardiology'],
  ['Dr. Meera Iyer', 'meera.i@hospital.com', '9876543219', 'Ophthalmology']
];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

async function seedDatabase() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  console.log('🌱 Starting database seeding...');

  // Insert hospitals
  console.log('📍 Inserting hospitals...');
  for (const hospital of hospitals) {
    await new Promise((resolve, reject) => {
      db.run('INSERT INTO hospitals (name, address, phone, email, license_number, status) VALUES (?, ?, ?, ?, ?, ?)', 
        [...hospital, 'Active'], (err) => err ? reject(err) : resolve());
    });
  }

  // Insert doctors
  console.log('👨‍⚕️ Inserting doctors...');
  for (let i = 0; i < doctors.length; i++) {
    const [name, email, phone, specialization] = doctors[i];
    const hospitalId = (i % 10) + 1;
    await new Promise((resolve, reject) => {
      db.run('INSERT INTO doctors (name, email, phone, specialization, hospital_id, license_number, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, phone, specialization, hospitalId, `DOC${String(i + 1).padStart(3, '0')}`, 'Active'], (err) => err ? reject(err) : resolve());
    });
  }

  // Insert admin user
  console.log('👤 Inserting admin user...');
  await new Promise((resolve, reject) => {
    db.run('INSERT INTO users (name, email, password, phone, blood_type, address, age, gender, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['Admin User', 'admin@bloodbank.com', adminPassword, '9999999999', 'O+', 'Admin Office, Nagpur', 35, 'Male', 'admin', 'Active'],
      (err) => err ? reject(err) : resolve());
  });

  // Insert 50 users
  console.log('👥 Inserting 50 users...');
  for (let i = 1; i <= 50; i++) {
    const firstName = random(firstNames);
    const lastName = random(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`;
    const phone = `98765${String(43210 + i).padStart(5, '0')}`;
    const bloodType = random(bloodTypes);
    const city = random(cities);
    const address = `${randomInt(1, 500)} ${random(['MG Road', 'Station Road', 'Gandhi Chowk', 'Main Street', 'Civil Lines'])}, ${city}`;
    const age = randomInt(18, 65);
    const gender = random(genders);
    const role = i <= 5 ? 'hospital' : 'donor';

    await new Promise((resolve, reject) => {
      db.run('INSERT INTO users (name, email, password, phone, blood_type, address, age, gender, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, phone, bloodType, address, age, gender, role, 'Active'],
        (err) => err ? reject(err) : resolve());
    });
  }

  // Insert organ donations (80 donations)
  console.log('🫀 Inserting organ donations...');
  for (let i = 0; i < 80; i++) {
    const donorId = randomInt(2, 51);
    const hospitalId = randomInt(1, 10);
    const organType = random(organTypes);
    const donationType = organType === 'Kidney' ? random(['Living', 'Deceased']) : 'Deceased';
    const donationDate = randomDate(new Date(2024, 0, 1), new Date(2026, 2, 8));
    const status = random(['Completed', 'Pending', 'Available']);

    await new Promise((resolve, reject) => {
      db.run('INSERT INTO organ_donations (donor_id, hospital_id, organ_type, donation_type, donation_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [donorId, hospitalId, organType, donationType, donationDate, status, `${organType} donation - ${donationType}`],
        (err) => err ? reject(err) : resolve());
    });
  }

  // Insert organ requests (60 requests)
  console.log('📋 Inserting organ requests...');
  for (let i = 0; i < 60; i++) {
    const requesterId = randomInt(2, 51);
    const hospitalId = randomInt(1, 10);
    const organType = random(organTypes);
    const bloodType = random(bloodTypes);
    const urgency = random(urgencyLevels);
    const requestedDate = randomDate(new Date(2024, 0, 1), new Date(2026, 2, 8));
    const status = random(['Pending', 'Fulfilled', 'Cancelled']);
    const fulfilledDate = status === 'Fulfilled' ? randomDate(new Date(requestedDate), new Date(2026, 2, 8)) : null;

    await new Promise((resolve, reject) => {
      db.run('INSERT INTO organ_requests (requester_id, hospital_id, organ_type, blood_type, urgency, reason, status, requested_date, fulfilled_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [requesterId, hospitalId, organType, bloodType, urgency, `Urgent ${organType} transplant needed`, status, requestedDate, fulfilledDate],
        (err) => err ? reject(err) : resolve());
    });
  }

  // Insert organ inventory (30 items)
  console.log('📦 Inserting organ inventory...');
  for (let i = 0; i < 30; i++) {
    const organType = random(organTypes);
    const bloodType = random(bloodTypes);
    const hospitalId = randomInt(1, 10);
    const status = random(['Available', 'Reserved', 'Expired']);
    const preservationDate = randomDate(new Date(2025, 0, 1), new Date(2026, 2, 8));

    await new Promise((resolve, reject) => {
      db.run('INSERT INTO organ_inventory (organ_type, blood_type, hospital_id, status, preservation_date) VALUES (?, ?, ?, ?, ?)',
        [organType, bloodType, hospitalId, status, preservationDate],
        (err) => err ? reject(err) : resolve());
    });
  }

  // Insert medical evaluations (40 evaluations)
  console.log('🏥 Inserting medical evaluations...');
  for (let i = 0; i < 40; i++) {
    const userId = randomInt(2, 51);
    const organType = random(organTypes);
    const diseases = random([null, 'Hypertension', 'Diabetes Type 2', 'Asthma', null]);
    const allergies = random([null, 'Penicillin', 'Peanuts', null]);
    const bloodPressure = `${randomInt(110, 140)}/${randomInt(70, 90)}`;
    const diabetesStatus = random(['No', 'Type 1', 'Type 2', 'Pre-diabetic']);
    const evaluationDate = randomDate(new Date(2024, 0, 1), new Date(2026, 2, 8));

    await new Promise((resolve, reject) => {
      db.run('INSERT INTO medical_evaluation (user_id, organ_type, diseases, allergies, blood_pressure, diabetes_status, current_medications, previous_surgeries, emergency_contact_name, emergency_contact_phone, evaluation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, organType, diseases, allergies, bloodPressure, diabetesStatus, random([null, 'Aspirin', 'Metformin', null]), random([null, 'Appendectomy', 'Tonsillectomy', null]), `Emergency Contact ${i}`, `98765${String(10000 + i).padStart(5, '0')}`, evaluationDate],
        (err) => err ? reject(err) : resolve());
    });
  }

  // Insert SOP acceptances (45 acceptances)
  console.log('✅ Inserting SOP acceptances...');
  for (let i = 0; i < 45; i++) {
    const userId = randomInt(2, 51);
    const organType = random(organTypes);
    const acceptedDate = randomDate(new Date(2024, 0, 1), new Date(2026, 2, 8));

    await new Promise((resolve, reject) => {
      db.run('INSERT INTO sop_acceptance (user_id, organ_type, accepted_date, ip_address) VALUES (?, ?, ?, ?)',
        [userId, organType, acceptedDate, `192.168.1.${randomInt(1, 255)}`],
        (err) => err ? reject(err) : resolve());
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log('   - 1 Admin user');
  console.log('   - 50 Regular users (5 hospital staff, 45 donors)');
  console.log('   - 10 Hospitals');
  console.log('   - 10 Doctors');
  console.log('   - 80 Organ donations');
  console.log('   - 60 Organ requests');
  console.log('   - 30 Inventory items');
  console.log('   - 40 Medical evaluations');
  console.log('   - 45 SOP acceptances');
  
  db.close();
}

seedDatabase().catch(err => {
  console.error('❌ Error seeding database:', err);
  db.close();
});
