const bcrypt = require('bcryptjs');

const insertDummyData = async (db) => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Insert hospitals
  const hospitals = [
    ['Yavatmal District Hospital', 'Civil Lines, Yavatmal, Maharashtra 445001', '07232-242345', 'admin@yavatmalhosp.gov.in', 'LIC001'],
    ['Pusad General Hospital', 'Main Road, Pusad, Maharashtra 445204', '07232-222456', 'contact@pusadhosp.com', 'LIC002'],
    ['Nagpur Medical College', 'Hanuman Nagar, Nagpur, Maharashtra 440003', '0712-2740103', 'info@nmc.edu', 'LIC003'],
    ['Akola Civil Hospital', 'Station Road, Akola, Maharashtra 444001', '0724-2420567', 'emergency@akolahosp.gov.in', 'LIC004'],
    ['Washim District Hospital', 'Hospital Road, Washim, Maharashtra 444505', '07252-242789', 'help@washimhosp.gov.in', 'LIC005'],
    ['Amravati Medical Center', 'Rajkamal Chowk, Amravati, Maharashtra 444601', '0721-2662890', 'info@amravatimedical.com', 'LIC006'],
    ['Buldhana Civil Hospital', 'Collectorate Road, Buldhana, Maharashtra 443001', '07262-242123', 'contact@buldhanacivil.gov.in', 'LIC007'],
    ['Wardha District Hospital', 'Gandhi Chowk, Wardha, Maharashtra 442001', '07152-242456', 'care@wardhahosp.gov.in', 'LIC008']
  ];

  hospitals.forEach(hospital => {
    db.run('INSERT INTO hospitals (name, address, phone, email, license_number) VALUES (?, ?, ?, ?, ?)', hospital);
  });

  // Insert users (admins and donors)
  const users = [
    // Admins
    ['Dr. Rajesh Sharma', 'admin@bloodbank.com', adminPassword, '9876543210', 'O+', 'Civil Lines, Yavatmal, Maharashtra', 35, 'male', 1, '["Heart", "Liver", "Kidneys"]', 'admin'],
    ['Dr. Priya Deshmukh', 'priya.admin@hospital.com', adminPassword, '9876543211', 'A+', 'Main Road, Pusad, Maharashtra', 42, 'female', 1, '["Corneas", "Skin"]', 'admin'],
    ['Dr. Amit Patil', 'amit.admin@healthcare.com', adminPassword, '9876543212', 'B+', 'Hanuman Nagar, Nagpur, Maharashtra', 38, 'male', 0, null, 'admin'],
    
    // Donors
    ['Sunita Joshi', 'sunita.j@email.com', hashedPassword, '9123456789', 'A+', 'Shivaji Nagar, Yavatmal, Maharashtra', 28, 'female', 1, '["Heart", "Liver"]', 'donor'],
    ['Rahul Kale', 'rahul.k@email.com', hashedPassword, '9123456790', 'B-', 'Gandhi Chowk, Pusad, Maharashtra', 32, 'male', 1, '["Kidneys", "Pancreas"]', 'donor'],
    ['Meera Bhosale', 'meera.b@email.com', hashedPassword, '9123456791', 'AB+', 'Station Road, Akola, Maharashtra', 25, 'female', 0, null, 'donor'],
    ['Vikram Jadhav', 'vikram.j@email.com', hashedPassword, '9123456792', 'O-', 'Hospital Road, Washim, Maharashtra', 29, 'male', 1, '["Heart", "Lungs", "Liver"]', 'donor'],
    ['Kavita Raut', 'kavita.r@email.com', hashedPassword, '9123456793', 'A-', 'Rajkamal Chowk, Amravati, Maharashtra', 35, 'female', 1, '["Corneas", "Skin", "Bone"]', 'donor'],
    ['Sachin Wagh', 'sachin.w@email.com', hashedPassword, '9123456794', 'B+', 'Collectorate Road, Buldhana, Maharashtra', 27, 'male', 0, null, 'donor'],
    ['Pooja Gaikwad', 'pooja.g@email.com', hashedPassword, '9123456795', 'AB-', 'Gandhi Chowk, Wardha, Maharashtra', 31, 'female', 1, '["Heart", "Liver", "Kidneys"]', 'donor'],
    ['Anil Thakur', 'anil.t@email.com', hashedPassword, '9123456796', 'O+', 'Mahatma Gandhi Road, Yavatmal, Maharashtra', 26, 'male', 1, '["Lungs", "Pancreas"]', 'donor'],
    ['Shweta Kulkarni', 'shweta.k@email.com', hashedPassword, '9123456797', 'A+', 'Nehru Chowk, Pusad, Maharashtra', 33, 'female', 0, null, 'donor'],
    ['Deepak Meshram', 'deepak.m@email.com', hashedPassword, '9123456798', 'B-', 'Civil Lines, Nagpur, Maharashtra', 24, 'male', 1, '["Heart", "Corneas"]', 'donor'],
    ['Manisha Dongre', 'manisha.d@email.com', hashedPassword, '9123456799', 'AB+', 'Shastri Nagar, Akola, Maharashtra', 30, 'female', 1, '["Liver", "Kidneys", "Skin"]', 'donor'],
    ['Suresh Bawane', 'suresh.b@email.com', hashedPassword, '9123456800', 'O-', 'Tilak Road, Washim, Maharashtra', 28, 'male', 0, null, 'donor'],
    ['Rekha Sonkusare', 'rekha.s@email.com', hashedPassword, '9123456801', 'A-', 'Camp Area, Amravati, Maharashtra', 36, 'female', 1, '["Heart", "Lungs"]', 'donor'],
    ['Ganesh Borkar', 'ganesh.b@email.com', hashedPassword, '9123456802', 'B+', 'Sadar Bazaar, Buldhana, Maharashtra', 29, 'male', 1, '["Liver", "Pancreas", "Bone"]', 'donor'],
    ['Vandana Khandare', 'vandana.k@email.com', hashedPassword, '9123456803', 'AB-', 'Kasturba Road, Wardha, Maharashtra', 32, 'female', 0, null, 'donor'],
    ['Mahesh Dhanorkar', 'mahesh.d@email.com', hashedPassword, '9123456804', 'O+', 'Bajaj Nagar, Yavatmal, Maharashtra', 27, 'male', 1, '["Heart", "Kidneys"]', 'donor'],
    ['Seema Waghmare', 'seema.w@email.com', hashedPassword, '9123456805', 'A+', 'Subhash Nagar, Pusad, Maharashtra', 25, 'female', 1, '["Corneas", "Skin", "Liver"]', 'donor'],
    ['Pravin Uike', 'pravin.u@email.com', hashedPassword, '9123456806', 'B-', 'Ramdaspeth, Nagpur, Maharashtra', 34, 'male', 0, null, 'donor']
  ];

  users.forEach(user => {
    db.run('INSERT INTO users (name, email, password, phone, blood_type, address, age, gender, organ_donor, organs_to_donate, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', user);
  });

  // Insert doctors
  const doctors = [
    ['Dr. Ashok Deshmukh', 'dr.deshmukh@yavatmalhosp.gov.in', '9876543220', 'Hematology', 1, 'MD12345'],
    ['Dr. Sunanda Kale', 'dr.kale@pusadhosp.com', '9876543221', 'Emergency Medicine', 2, 'MD12346'],
    ['Dr. Ramesh Patil', 'dr.patil@nmc.edu', '9876543222', 'Blood Banking', 3, 'MD12347'],
    ['Dr. Vandana Joshi', 'dr.joshi@akolahosp.gov.in', '9876543223', 'Trauma Surgery', 4, 'MD12348'],
    ['Dr. Sunil Bhosale', 'dr.bhosale@washimhosp.gov.in', '9876543224', 'Internal Medicine', 5, 'MD12349'],
    ['Dr. Madhuri Raut', 'dr.raut@amravatimedical.com', '9876543225', 'Cardiology', 6, 'MD12350'],
    ['Dr. Prakash Wagh', 'dr.wagh@buldhanacivil.gov.in', '9876543226', 'Pediatrics', 7, 'MD12351'],
    ['Dr. Kavita Gaikwad', 'dr.gaikwad@wardhahosp.gov.in', '9876543227', 'Pediatric Surgery', 8, 'MD12352'],
    ['Dr. Anil Thakur', 'dr.thakur@yavatmalhosp.gov.in', '9876543228', 'Anesthesiology', 1, 'MD12353'],
    ['Dr. Shweta Kulkarni', 'dr.kulkarni@pusadhosp.com', '9876543229', 'Orthopedics', 2, 'MD12354']
  ];

  doctors.forEach(doctor => {
    db.run('INSERT INTO doctors (name, email, phone, specialization, hospital_id, license_number) VALUES (?, ?, ?, ?, ?, ?)', doctor);
  });

  // Insert blood donations (more realistic data)
  const donations = [
    [4, 1, 'A+', 1, '2024-01-15', '2024-02-19', 'active', 'Regular donation'],
    [5, 2, 'B-', 2, '2024-01-20', '2024-02-24', 'active', 'First time donor'],
    [6, 1, 'AB+', 1, '2024-01-25', '2024-03-01', 'active', 'Repeat donor'],
    [7, 3, 'O-', 2, '2024-02-01', '2024-03-08', 'active', 'Emergency donation'],
    [8, 2, 'A-', 1, '2024-02-05', '2024-03-12', 'active', 'Regular donation'],
    [9, 4, 'B+', 1, '2024-02-10', '2024-03-17', 'active', 'Community drive'],
    [10, 1, 'AB-', 2, '2024-02-15', '2024-03-22', 'active', 'Scheduled donation'],
    [11, 3, 'O+', 1, '2024-02-18', '2024-03-25', 'active', 'Walk-in donation'],
    [12, 5, 'A+', 2, '2024-02-20', '2024-03-27', 'active', 'Corporate drive'],
    [13, 2, 'B-', 1, '2024-02-22', '2024-03-29', 'active', 'Regular donor'],
    [14, 4, 'AB+', 1, '2024-02-25', '2024-04-01', 'active', 'Replacement donation'],
    [15, 1, 'O-', 2, '2024-02-28', '2024-04-04', 'active', 'Emergency response'],
    [16, 3, 'A-', 1, '2024-03-01', '2024-04-05', 'active', 'Scheduled donation'],
    [17, 5, 'B+', 1, '2024-03-03', '2024-04-07', 'active', 'First time donor'],
    [18, 2, 'AB-', 2, '2024-03-05', '2024-04-09', 'active', 'Regular donation']
  ];

  donations.forEach(donation => {
    db.run('INSERT INTO blood_donations (donor_id, hospital_id, blood_type, quantity, donation_date, expiry_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', donation);
  });

  // Insert blood requests
  const requests = [
    [6, 1, 'A+', 3, 'high', 'Surgery preparation', 'pending', '2024-02-20'],
    [7, 2, 'O-', 2, 'critical', 'Emergency trauma', 'fulfilled', '2024-02-18', '2024-02-18'],
    [8, 3, 'B+', 1, 'medium', 'Routine procedure', 'pending', '2024-02-22'],
    [9, 1, 'AB+', 2, 'low', 'Elective surgery', 'pending', '2024-02-25'],
    [10, 4, 'O+', 4, 'critical', 'Multiple trauma patients', 'fulfilled', '2024-02-19', '2024-02-19'],
    [11, 5, 'A-', 1, 'medium', 'Cancer treatment', 'pending', '2024-02-26'],
    [12, 2, 'B-', 3, 'high', 'Cardiac surgery', 'fulfilled', '2024-02-21', '2024-02-21'],
    [13, 3, 'AB-', 1, 'low', 'Planned surgery', 'pending', '2024-02-27'],
    [14, 1, 'O-', 2, 'critical', 'Emergency delivery', 'fulfilled', '2024-02-23', '2024-02-23'],
    [15, 4, 'A+', 2, 'medium', 'Orthopedic surgery', 'pending', '2024-02-28']
  ];

  requests.forEach(request => {
    db.run('INSERT INTO blood_requests (requester_id, hospital_id, blood_type, quantity, urgency, reason, status, requested_date, fulfilled_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', request);
  });

  // Insert comprehensive blood inventory
  const inventory = [
    ['A+', 25, '2024-03-15', 1, 'active'],
    ['A+', 18, '2024-03-20', 2, 'active'],
    ['A+', 12, '2024-03-25', 3, 'active'],
    ['A-', 8, '2024-03-12', 1, 'active'],
    ['A-', 15, '2024-03-18', 4, 'active'],
    ['A-', 6, '2024-03-22', 5, 'active'],
    ['B+', 20, '2024-03-18', 2, 'active'],
    ['B+', 14, '2024-03-24', 6, 'active'],
    ['B+', 9, '2024-03-28', 7, 'active'],
    ['B-', 5, '2024-03-10', 2, 'active'],
    ['B-', 11, '2024-03-16', 8, 'active'],
    ['B-', 7, '2024-03-21', 1, 'active'],
    ['AB+', 6, '2024-03-20', 3, 'active'],
    ['AB+', 4, '2024-03-26', 4, 'active'],
    ['AB+', 8, '2024-03-30', 5, 'active'],
    ['AB-', 3, '2024-03-08', 3, 'active'],
    ['AB-', 5, '2024-03-14', 6, 'active'],
    ['AB-', 2, '2024-03-19', 7, 'active'],
    ['O+', 30, '2024-03-22', 1, 'active'],
    ['O+', 22, '2024-03-28', 2, 'active'],
    ['O+', 16, '2024-04-02', 8, 'active'],
    ['O-', 15, '2024-03-14', 4, 'active'],
    ['O-', 12, '2024-03-20', 5, 'active'],
    ['O-', 8, '2024-03-25', 1, 'active']
  ];

  inventory.forEach(item => {
    db.run('INSERT INTO blood_inventory (blood_type, quantity, expiry_date, hospital_id, status) VALUES (?, ?, ?, ?, ?)', item);
  });

  // Insert organ donations
  const organDonations = [
    [4, 1, 'Heart', 'completed', '2024-01-10', 'Successful heart donation'],
    [7, 2, 'Liver', 'completed', '2024-01-15', 'Liver donation for transplant'],
    [10, 3, 'Kidneys', 'pending', null, 'Kidney donation scheduled'],
    [8, 1, 'Corneas', 'completed', '2024-02-01', 'Cornea donation'],
    [14, 4, 'Heart', 'pending', null, 'Heart donation evaluation'],
    [16, 2, 'Liver', 'completed', '2024-02-10', 'Successful liver donation'],
    [19, 5, 'Kidneys', 'pending', null, 'Kidney donation in process'],
    [11, 3, 'Lungs', 'completed', '2024-02-15', 'Lung donation completed']
  ];

  organDonations.forEach(donation => {
    db.run('INSERT INTO organ_donations (donor_id, hospital_id, organ_type, status, donation_date, notes) VALUES (?, ?, ?, ?, ?, ?)', donation);
  });

  // Insert organ requests
  const organRequests = [
    [6, 1, 'Heart', 'critical', 'Heart failure patient', 'pending', '2024-02-20'],
    [9, 2, 'Liver', 'high', 'Liver cirrhosis treatment', 'fulfilled', '2024-02-18', '2024-02-18'],
    [12, 3, 'Kidneys', 'medium', 'Kidney disease patient', 'pending', '2024-02-22'],
    [15, 4, 'Corneas', 'low', 'Vision restoration', 'pending', '2024-02-25'],
    [18, 1, 'Lungs', 'critical', 'Lung disease patient', 'pending', '2024-02-26'],
    [20, 5, 'Heart', 'high', 'Cardiac surgery needed', 'pending', '2024-02-27'],
    [13, 2, 'Liver', 'medium', 'Hepatitis treatment', 'fulfilled', '2024-02-21', '2024-02-21'],
    [17, 3, 'Kidneys', 'critical', 'Renal failure patient', 'pending', '2024-02-28']
  ];

  organRequests.forEach(request => {
    db.run('INSERT INTO organ_requests (requester_id, hospital_id, organ_type, urgency, reason, status, requested_date, fulfilled_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', request);
  });

  console.log('✅ Comprehensive dummy data inserted successfully');
  console.log('📊 Data includes: 8 hospitals, 21 users, 10 doctors, 15 blood donations, 10 blood requests, 24 inventory items, 8 organ donations, 8 organ requests');
};

module.exports = { insertDummyData };
