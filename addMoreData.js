const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./donation.db');

const addMoreData = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // More hospitals
  const hospitals = [
    ['Chandrapur District Hospital', 'Main Road, Chandrapur, Maharashtra 442401', '07172-255100', 'chandrapur@hospital.gov.in', 'LIC021'],
    ['Gondia Civil Hospital', 'Civil Lines, Gondia, Maharashtra 441601', '07182-233200', 'gondia@hospital.gov.in', 'LIC022'],
    ['Bhandara District Hospital', 'Hospital Road, Bhandara, Maharashtra 441904', '07184-244300', 'bhandara@hospital.gov.in', 'LIC023'],
    ['Gadchiroli District Hospital', 'Collectorate Road, Gadchiroli, Maharashtra 442605', '07132-222400', 'gadchiroli@hospital.gov.in', 'LIC024'],
    ['Yavatmal Civil Hospital', 'Station Road, Yavatmal, Maharashtra 445001', '07232-255500', 'yavatmalcivil@hospital.gov.in', 'LIC025'],
    ['Pusad Sub-District Hospital', 'Gandhi Chowk, Pusad, Maharashtra 445204', '07232-266600', 'pusadsub@hospital.gov.in', 'LIC026'],
    ['Wani Community Hospital', 'Market Road, Wani, Maharashtra 445304', '07234-277700', 'wani@hospital.gov.in', 'LIC027'],
    ['Umarkhed Rural Hospital', 'Umarkhed, Yavatmal, Maharashtra 445206', '07235-288800', 'umarkhed@hospital.gov.in', 'LIC028'],
    ['Digras Primary Health Center', 'Digras, Yavatmal, Maharashtra 445203', '07236-299900', 'digras@hospital.gov.in', 'LIC029'],
    ['Ralegaon Sub-District Hospital', 'Ralegaon, Yavatmal, Maharashtra 445402', '07237-211100', 'ralegaon@hospital.gov.in', 'LIC030']
  ];

  // More donors
  const users = [
    ['Rajesh Kumar', 'rajesh.k@email.com', hashedPassword, '9234567890', 'O+', 'Chandrapur, Maharashtra 442401', 28, 'male', 1, '["Heart", "Kidneys"]', 'donor'],
    ['Priya Sharma', 'priya.s@email.com', hashedPassword, '9234567891', 'A+', 'Gondia, Maharashtra 441601', 25, 'female', 1, '["Liver", "Corneas"]', 'donor'],
    ['Amit Verma', 'amit.v@email.com', hashedPassword, '9234567892', 'B+', 'Bhandara, Maharashtra 441904', 32, 'male', 0, null, 'donor'],
    ['Sneha Patil', 'sneha.p@email.com', hashedPassword, '9234567893', 'AB+', 'Gadchiroli, Maharashtra 442605', 29, 'female', 1, '["Kidneys", "Pancreas"]', 'donor'],
    ['Vijay Singh', 'vijay.s@email.com', hashedPassword, '9234567894', 'O-', 'Yavatmal, Maharashtra 445001', 35, 'male', 1, '["Heart", "Lungs", "Liver"]', 'donor'],
    ['Anjali Desai', 'anjali.d@email.com', hashedPassword, '9234567895', 'A-', 'Pusad, Maharashtra 445204', 27, 'female', 1, '["Corneas", "Skin"]', 'donor'],
    ['Karan Mehta', 'karan.m@email.com', hashedPassword, '9234567896', 'B-', 'Wani, Maharashtra 445304', 30, 'male', 1, '["Liver", "Kidneys"]', 'donor'],
    ['Ritu Agarwal', 'ritu.a@email.com', hashedPassword, '9234567897', 'AB-', 'Umarkhed, Maharashtra 445206', 26, 'female', 0, null, 'donor'],
    ['Sanjay Rao', 'sanjay.r@email.com', hashedPassword, '9234567898', 'O+', 'Digras, Maharashtra 445203', 33, 'male', 1, '["Heart", "Kidneys"]', 'donor'],
    ['Neeta Joshi', 'neeta.j@email.com', hashedPassword, '9234567899', 'A+', 'Ralegaon, Maharashtra 445402', 31, 'female', 1, '["Liver", "Pancreas"]', 'donor'],
    ['Rohit Gupta', 'rohit.g@email.com', hashedPassword, '9234567900', 'B+', 'Chandrapur, Maharashtra 442401', 24, 'male', 1, '["Kidneys", "Corneas"]', 'donor'],
    ['Kavita Nair', 'kavita.n@email.com', hashedPassword, '9234567901', 'O+', 'Gondia, Maharashtra 441601', 28, 'female', 1, '["Heart", "Liver"]', 'donor'],
    ['Arjun Reddy', 'arjun.r@email.com', hashedPassword, '9234567902', 'A-', 'Bhandara, Maharashtra 441904', 29, 'male', 0, null, 'donor'],
    ['Divya Iyer', 'divya.i@email.com', hashedPassword, '9234567903', 'AB+', 'Gadchiroli, Maharashtra 442605', 27, 'female', 1, '["Corneas", "Skin", "Bone"]', 'donor'],
    ['Manoj Tiwari', 'manoj.t@email.com', hashedPassword, '9234567904', 'B-', 'Yavatmal, Maharashtra 445001', 34, 'male', 1, '["Liver", "Kidneys"]', 'donor'],
    ['Pooja Saxena', 'pooja.sx@email.com', hashedPassword, '9234567905', 'O-', 'Pusad, Maharashtra 445204', 26, 'female', 1, '["Heart", "Lungs"]', 'donor'],
    ['Rahul Pandey', 'rahul.p@email.com', hashedPassword, '9234567906', 'A+', 'Wani, Maharashtra 445304', 31, 'male', 1, '["Kidneys", "Pancreas"]', 'donor'],
    ['Simran Kaur', 'simran.k@email.com', hashedPassword, '9234567907', 'AB-', 'Umarkhed, Maharashtra 445206', 25, 'female', 0, null, 'donor'],
    ['Aditya Malhotra', 'aditya.m@email.com', hashedPassword, '9234567908', 'O+', 'Digras, Maharashtra 445203', 30, 'male', 1, '["Heart", "Liver", "Kidneys"]', 'donor'],
    ['Nisha Chopra', 'nisha.c@email.com', hashedPassword, '9234567909', 'B+', 'Ralegaon, Maharashtra 445402', 28, 'female', 1, '["Corneas", "Skin"]', 'donor']
  ];

  // More doctors
  const doctors = [
    ['Dr. Ramesh Chandrapur', 'dr.ramesh@chandrapur.gov.in', '9876543250', 'Cardiology', 21, 'MD12374'],
    ['Dr. Sunita Gondia', 'dr.sunita@gondia.gov.in', '9876543251', 'Nephrology', 22, 'MD12375'],
    ['Dr. Prakash Bhandara', 'dr.prakash@bhandara.gov.in', '9876543252', 'General Surgery', 23, 'MD12376'],
    ['Dr. Meena Gadchiroli', 'dr.meena@gadchiroli.gov.in', '9876543253', 'Pediatrics', 24, 'MD12377'],
    ['Dr. Suresh Yavatmal', 'dr.suresh@yavatmalcivil.gov.in', '9876543254', 'Orthopedics', 25, 'MD12378'],
    ['Dr. Anita Pusad', 'dr.anita@pusadsub.gov.in', '9876543255', 'Gynecology', 26, 'MD12379'],
    ['Dr. Vijay Wani', 'dr.vijay@wani.gov.in', '9876543256', 'Internal Medicine', 27, 'MD12380'],
    ['Dr. Rekha Umarkhed', 'dr.rekha@umarkhed.gov.in', '9876543257', 'Dermatology', 28, 'MD12381'],
    ['Dr. Anil Digras', 'dr.anil@digras.gov.in', '9876543258', 'Emergency Medicine', 29, 'MD12382'],
    ['Dr. Savita Ralegaon', 'dr.savita@ralegaon.gov.in', '9876543259', 'Anesthesiology', 30, 'MD12383']
  ];

  // More blood donations
  const donations = [
    [38, 21, 'O+', 1, '2024-04-05', '2024-05-10', 'active', 'Regular donation - Chandrapur'],
    [39, 22, 'A+', 2, '2024-04-06', '2024-05-11', 'active', 'First time donor - Gondia'],
    [40, 23, 'B+', 1, '2024-04-07', '2024-05-12', 'active', 'Community drive - Bhandara'],
    [41, 24, 'AB+', 1, '2024-04-08', '2024-05-13', 'active', 'Regular donor - Gadchiroli'],
    [42, 25, 'O-', 2, '2024-04-09', '2024-05-14', 'active', 'Emergency donation - Yavatmal'],
    [43, 26, 'A-', 1, '2024-04-10', '2024-05-15', 'active', 'Scheduled donation - Pusad'],
    [44, 27, 'B-', 1, '2024-04-11', '2024-05-16', 'active', 'Walk-in donation - Wani'],
    [46, 29, 'O+', 2, '2024-04-13', '2024-05-18', 'active', 'Regular donation - Digras'],
    [47, 30, 'A+', 1, '2024-04-14', '2024-05-19', 'active', 'Community drive - Ralegaon'],
    [48, 21, 'B+', 1, '2024-04-15', '2024-05-20', 'active', 'Repeat donor - Chandrapur'],
    [49, 22, 'O+', 2, '2024-04-16', '2024-05-21', 'active', 'Blood bank donation - Gondia'],
    [51, 24, 'AB+', 1, '2024-04-18', '2024-05-23', 'active', 'Regular donation - Gadchiroli'],
    [52, 25, 'B-', 2, '2024-04-19', '2024-05-24', 'active', 'Emergency response - Yavatmal'],
    [53, 26, 'O-', 1, '2024-04-20', '2024-05-25', 'active', 'Scheduled donation - Pusad'],
    [54, 27, 'A+', 1, '2024-04-21', '2024-05-26', 'active', 'Walk-in donation - Wani']
  ];

  // More blood requests
  const requests = [
    [38, 21, 'O+', 2, 'high', 'Surgery preparation - Chandrapur', 'pending', '2024-04-10'],
    [39, 22, 'A+', 3, 'critical', 'Emergency trauma - Gondia', 'pending', '2024-04-11'],
    [40, 23, 'B+', 1, 'medium', 'Routine procedure - Bhandara', 'pending', '2024-04-12'],
    [41, 24, 'AB+', 2, 'high', 'Surgical emergency - Gadchiroli', 'fulfilled', '2024-04-13', '2024-04-13'],
    [42, 25, 'O-', 4, 'critical', 'Multiple trauma - Yavatmal', 'pending', '2024-04-14'],
    [43, 26, 'A-', 1, 'low', 'Elective surgery - Pusad', 'pending', '2024-04-15'],
    [44, 27, 'B-', 2, 'medium', 'Cancer treatment - Wani', 'pending', '2024-04-16'],
    [46, 29, 'O+', 3, 'high', 'Emergency delivery - Digras', 'fulfilled', '2024-04-18', '2024-04-18'],
    [47, 30, 'A+', 2, 'medium', 'Planned surgery - Ralegaon', 'pending', '2024-04-19'],
    [48, 21, 'B+', 1, 'low', 'Routine transfusion - Chandrapur', 'pending', '2024-04-20']
  ];

  // More organ donations
  const organDonations = [
    [38, 21, 'Heart', 'completed', '2024-03-15', 'Heart donation - Chandrapur'],
    [39, 22, 'Kidneys', 'pending', null, 'Kidney evaluation - Gondia'],
    [41, 24, 'Liver', 'completed', '2024-03-20', 'Liver donation - Gadchiroli'],
    [42, 25, 'Heart', 'pending', null, 'Heart donation scheduled - Yavatmal'],
    [43, 26, 'Corneas', 'completed', '2024-03-25', 'Cornea donation - Pusad'],
    [44, 27, 'Kidneys', 'pending', null, 'Kidney donation in process - Wani'],
    [46, 29, 'Liver', 'completed', '2024-03-30', 'Liver transplant - Digras'],
    [47, 30, 'Kidneys', 'pending', null, 'Kidney evaluation - Ralegaon'],
    [48, 21, 'Corneas', 'completed', '2024-04-02', 'Cornea donation - Chandrapur'],
    [49, 22, 'Heart', 'pending', null, 'Heart donation scheduled - Gondia']
  ];

  // More organ requests
  const organRequests = [
    [40, 23, 'Heart', 'critical', 'Heart failure patient - Bhandara', 'pending', '2024-04-05'],
    [41, 24, 'Kidneys', 'high', 'Renal disease - Gadchiroli', 'fulfilled', '2024-04-06', '2024-04-06'],
    [42, 25, 'Liver', 'critical', 'Liver cirrhosis - Yavatmal', 'pending', '2024-04-07'],
    [43, 26, 'Corneas', 'medium', 'Vision restoration - Pusad', 'pending', '2024-04-08'],
    [44, 27, 'Kidneys', 'high', 'Kidney transplant needed - Wani', 'pending', '2024-04-09'],
    [45, 28, 'Heart', 'critical', 'Cardiac emergency - Umarkhed', 'pending', '2024-04-10'],
    [46, 29, 'Liver', 'high', 'Hepatic disease - Digras', 'fulfilled', '2024-04-11', '2024-04-11'],
    [47, 30, 'Kidneys', 'medium', 'Renal disease - Ralegaon', 'pending', '2024-04-12']
  ];

  // Insert data
  console.log('Adding more hospitals...');
  hospitals.forEach(h => {
    db.run('INSERT INTO hospitals (name, address, phone, email, license_number) VALUES (?, ?, ?, ?, ?)', h);
  });

  console.log('Adding more users...');
  users.forEach(u => {
    db.run('INSERT INTO users (name, email, password, phone, blood_type, address, age, gender, organ_donor, organs_to_donate, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', u);
  });

  console.log('Adding more doctors...');
  doctors.forEach(d => {
    db.run('INSERT INTO doctors (name, email, phone, specialization, hospital_id, license_number) VALUES (?, ?, ?, ?, ?, ?)', d);
  });

  console.log('Adding more blood donations...');
  donations.forEach(d => {
    db.run('INSERT INTO blood_donations (donor_id, hospital_id, blood_type, quantity, donation_date, expiry_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', d);
  });

  console.log('Adding more blood requests...');
  requests.forEach(r => {
    db.run('INSERT INTO blood_requests (requester_id, hospital_id, blood_type, quantity, urgency, reason, status, requested_date, fulfilled_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', r);
  });

  console.log('Adding more organ donations...');
  organDonations.forEach(od => {
    db.run('INSERT INTO organ_donations (donor_id, hospital_id, organ_type, status, donation_date, notes) VALUES (?, ?, ?, ?, ?, ?)', od);
  });

  console.log('Adding more organ requests...');
  organRequests.forEach(orr => {
    db.run('INSERT INTO organ_requests (requester_id, hospital_id, organ_type, urgency, reason, status, requested_date, fulfilled_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', orr);
  });

  setTimeout(() => {
    console.log('✅ Additional data added successfully!');
    console.log('📊 Added:');
    console.log('   - 10 more hospitals');
    console.log('   - 20 more donors');
    console.log('   - 10 more doctors');
    console.log('   - 15 more blood donations');
    console.log('   - 10 more blood requests');
    console.log('   - 10 more organ donations');
    console.log('   - 8 more organ requests');
    db.close();
  }, 1000);
};

addMoreData();
