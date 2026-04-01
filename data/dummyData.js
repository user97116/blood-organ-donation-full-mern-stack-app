const bcrypt = require('bcryptjs');

const insertDummyData = async (db) => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Insert hospitals - Maharashtra Vidarbha Region
  const hospitals = [
    // Yavatmal District
    ['Yavatmal District Hospital', 'Civil Lines, Yavatmal, Maharashtra 445001', '07232-242345', 'admin@yavatmalhosp.gov.in', 'LIC001'],
    ['Pusad General Hospital', 'Main Road, Pusad, Maharashtra 445204', '07232-222456', 'contact@pusadhosp.com', 'LIC002'],
    ['Wani Rural Hospital', 'Wani Road, Wani, Yavatmal 445304', '07234-223456', 'wani@hospital.gov.in', 'LIC003'],
    ['Darwha Primary Health Center', 'Darwha, Yavatmal 445202', '07235-234567', 'darwha@phc.gov.in', 'LIC004'],
    
    // Hingoli District
    ['Hingoli District Hospital', 'Station Road, Hingoli, Maharashtra 431513', '02456-242100', 'admin@hingolihosp.gov.in', 'LIC005'],
    ['Kalamnuri Sub-District Hospital', 'Kalamnuri, Hingoli 431702', '02456-252200', 'kalamnuri@hospital.gov.in', 'LIC006'],
    ['Basmat Rural Hospital', 'Basmat, Hingoli 431512', '02456-262300', 'basmat@hospital.gov.in', 'LIC007'],
    
    // Nagpur Division
    ['Nagpur Medical College & Hospital', 'Hanuman Nagar, Nagpur, Maharashtra 440003', '0712-2740103', 'info@nmc.edu', 'LIC008'],
    ['AIIMS Nagpur', 'MIHAN, Nagpur 441108', '0712-2969999', 'aiims@nagpur.edu.in', 'LIC009'],
    ['Indira Gandhi Govt Medical College', 'CA Road, Nagpur 440018', '0712-2742711', 'iggmc@nagpur.gov.in', 'LIC010'],
    
    // Akola District
    ['Akola Civil Hospital', 'Station Road, Akola, Maharashtra 444001', '0724-2420567', 'emergency@akolahosp.gov.in', 'LIC011'],
    ['Akot Sub-District Hospital', 'Akot, Akola 444101', '0724-2452678', 'akot@hospital.gov.in', 'LIC012'],
    
    // Washim District
    ['Washim District Hospital', 'Hospital Road, Washim, Maharashtra 444505', '07252-242789', 'help@washimhosp.gov.in', 'LIC013'],
    ['Karanja Rural Hospital', 'Karanja Lad, Washim 444105', '07252-252890', 'karanja@hospital.gov.in', 'LIC014'],
    
    // Amravati District
    ['Amravati Medical Center', 'Rajkamal Chowk, Amravati, Maharashtra 444601', '0721-2662890', 'info@amravatimedical.com', 'LIC015'],
    ['Govt Medical College Amravati', 'Camp Area, Amravati 444603', '0721-2662345', 'gmc@amravati.gov.in', 'LIC016'],
    
    // Buldhana District
    ['Buldhana Civil Hospital', 'Collectorate Road, Buldhana, Maharashtra 443001', '07262-242123', 'contact@buldhanacivil.gov.in', 'LIC017'],
    ['Malkapur Sub-District Hospital', 'Malkapur, Buldhana 443101', '07263-252234', 'malkapur@hospital.gov.in', 'LIC018'],
    
    // Wardha District
    ['Wardha District Hospital', 'Gandhi Chowk, Wardha, Maharashtra 442001', '07152-242456', 'care@wardhahosp.gov.in', 'LIC019'],
    ['Kasturba Health Society Hospital', 'Sevagram, Wardha 442102', '07152-284038', 'khs@sevagram.org', 'LIC020']
  ];

  hospitals.forEach(hospital => {
    db.run('INSERT INTO hospitals (name, address, phone, email, license_number) VALUES (?, ?, ?, ?, ?)', hospital);
  });

  // Insert users (admins and donors) - Maharashtra Vidarbha Region
  const users = [
    // Admins
    ['Dr. Rajesh Sharma', 'admin@bloodbank.com', adminPassword, '9876543210', 'O+', 'Civil Lines, Yavatmal, Maharashtra', 35, 'male', 1, '["Heart", "Liver", "Kidneys"]', 'admin'],
    ['Dr. Priya Deshmukh', 'priya.admin@hospital.com', adminPassword, '9876543211', 'A+', 'Main Road, Pusad, Maharashtra', 42, 'female', 1, '["Corneas", "Skin"]', 'admin'],
    ['Dr. Amit Patil', 'amit.admin@healthcare.com', adminPassword, '9876543212', 'B+', 'Hanuman Nagar, Nagpur, Maharashtra', 38, 'male', 0, null, 'admin'],
    ['Dr. Sanjay Bhagat', 'sanjay.admin@hingoli.gov.in', adminPassword, '9876543213', 'AB+', 'Station Road, Hingoli, Maharashtra', 45, 'male', 1, '["Heart", "Kidneys"]', 'admin'],
    
    // Donors - Yavatmal District
    ['Sunita Joshi', 'sunita.j@email.com', hashedPassword, '9123456789', 'A+', 'Shivaji Nagar, Yavatmal, Maharashtra 445001', 28, 'female', 1, '["Heart", "Liver"]', 'donor'],
    ['Rahul Kale', 'rahul.k@email.com', hashedPassword, '9123456790', 'B-', 'Gandhi Chowk, Pusad, Maharashtra 445204', 32, 'male', 1, '["Kidneys", "Pancreas"]', 'donor'],
    ['Anil Thakur', 'anil.t@email.com', hashedPassword, '9123456796', 'O+', 'Mahatma Gandhi Road, Yavatmal, Maharashtra 445001', 26, 'male', 1, '["Lungs", "Pancreas"]', 'donor'],
    ['Shweta Kulkarni', 'shweta.k@email.com', hashedPassword, '9123456797', 'A+', 'Nehru Chowk, Pusad, Maharashtra 445204', 33, 'female', 0, null, 'donor'],
    ['Mahesh Dhanorkar', 'mahesh.d@email.com', hashedPassword, '9123456804', 'O+', 'Bajaj Nagar, Yavatmal, Maharashtra 445001', 27, 'male', 1, '["Heart", "Kidneys"]', 'donor'],
    ['Seema Waghmare', 'seema.w@email.com', hashedPassword, '9123456805', 'A+', 'Subhash Nagar, Pusad, Maharashtra 445204', 25, 'female', 1, '["Corneas", "Skin", "Liver"]', 'donor'],
    ['Ramesh Gawande', 'ramesh.g@email.com', hashedPassword, '9123456820', 'B+', 'Wani, Yavatmal 445304', 30, 'male', 1, '["Heart", "Liver"]', 'donor'],
    ['Anita Deshmukh', 'anita.d@email.com', hashedPassword, '9123456821', 'O-', 'Darwha, Yavatmal 445202', 29, 'female', 1, '["Kidneys", "Corneas"]', 'donor'],
    
    // Donors - Hingoli District
    ['Prakash Bansod', 'prakash.b@email.com', hashedPassword, '9123456807', 'AB+', 'Station Road, Hingoli 431513', 31, 'male', 1, '["Heart", "Liver", "Kidneys"]', 'donor'],
    ['Lata Gaikwad', 'lata.g@email.com', hashedPassword, '9123456808', 'A-', 'Kalamnuri, Hingoli 431702', 27, 'female', 1, '["Corneas", "Skin"]', 'donor'],
    ['Sunil Jadhav', 'sunil.j@email.com', hashedPassword, '9123456809', 'O+', 'Basmat, Hingoli 431512', 34, 'male', 1, '["Kidneys", "Liver"]', 'donor'],
    ['Vaishali Pawar', 'vaishali.p@email.com', hashedPassword, '9123456810', 'B+', 'Hingoli Town, Hingoli 431513', 26, 'female', 0, null, 'donor'],
    ['Dilip Rathod', 'dilip.r@email.com', hashedPassword, '9123456811', 'A+', 'Kalamnuri Road, Hingoli 431702', 29, 'male', 1, '["Heart", "Lungs"]', 'donor'],
    ['Savita Bhosale', 'savita.b@email.com', hashedPassword, '9123456812', 'AB-', 'Basmat Market, Hingoli 431512', 32, 'female', 1, '["Liver", "Kidneys"]', 'donor'],
    
    // Donors - Nagpur Division
    ['Deepak Meshram', 'deepak.m@email.com', hashedPassword, '9123456798', 'B-', 'Civil Lines, Nagpur, Maharashtra 440003', 24, 'male', 1, '["Heart", "Corneas"]', 'donor'],
    ['Pravin Uike', 'pravin.u@email.com', hashedPassword, '9123456806', 'B-', 'Ramdaspeth, Nagpur, Maharashtra 440010', 34, 'male', 0, null, 'donor'],
    ['Neha Thakre', 'neha.t@email.com', hashedPassword, '9123456813', 'O+', 'Dharampeth, Nagpur 440010', 28, 'female', 1, '["Kidneys", "Liver"]', 'donor'],
    ['Vikas Bhoyar', 'vikas.b@email.com', hashedPassword, '9123456814', 'A+', 'Sitabuldi, Nagpur 440012', 30, 'male', 1, '["Heart", "Lungs"]', 'donor'],
    
    // Donors - Akola District
    ['Meera Bhosale', 'meera.b@email.com', hashedPassword, '9123456791', 'AB+', 'Station Road, Akola, Maharashtra 444001', 25, 'female', 0, null, 'donor'],
    ['Manisha Dongre', 'manisha.d@email.com', hashedPassword, '9123456799', 'AB+', 'Shastri Nagar, Akola, Maharashtra 444001', 30, 'female', 1, '["Liver", "Kidneys", "Skin"]', 'donor'],
    ['Santosh Wankhede', 'santosh.w@email.com', hashedPassword, '9123456815', 'B+', 'Akot, Akola 444101', 33, 'male', 1, '["Heart", "Kidneys"]', 'donor'],
    
    // Donors - Washim District
    ['Vikram Jadhav', 'vikram.j@email.com', hashedPassword, '9123456792', 'O-', 'Hospital Road, Washim, Maharashtra 444505', 29, 'male', 1, '["Heart", "Lungs", "Liver"]', 'donor'],
    ['Suresh Bawane', 'suresh.b@email.com', hashedPassword, '9123456800', 'O-', 'Tilak Road, Washim, Maharashtra 444505', 28, 'male', 0, null, 'donor'],
    ['Rupali Deshmukh', 'rupali.d@email.com', hashedPassword, '9123456816', 'A-', 'Karanja Lad, Washim 444105', 27, 'female', 1, '["Corneas", "Skin"]', 'donor'],
    
    // Donors - Amravati District
    ['Kavita Raut', 'kavita.r@email.com', hashedPassword, '9123456793', 'A-', 'Rajkamal Chowk, Amravati, Maharashtra 444601', 35, 'female', 1, '["Corneas", "Skin", "Bone"]', 'donor'],
    ['Rekha Sonkusare', 'rekha.s@email.com', hashedPassword, '9123456801', 'A-', 'Camp Area, Amravati, Maharashtra 444603', 36, 'female', 1, '["Heart", "Lungs"]', 'donor'],
    ['Ajay Deshmukh', 'ajay.d@email.com', hashedPassword, '9123456817', 'O+', 'Badnera Road, Amravati 444701', 31, 'male', 1, '["Liver", "Kidneys"]', 'donor'],
    
    // Donors - Buldhana District
    ['Sachin Wagh', 'sachin.w@email.com', hashedPassword, '9123456794', 'B+', 'Collectorate Road, Buldhana, Maharashtra 443001', 27, 'male', 0, null, 'donor'],
    ['Ganesh Borkar', 'ganesh.b@email.com', hashedPassword, '9123456802', 'B+', 'Sadar Bazaar, Buldhana, Maharashtra 443001', 29, 'male', 1, '["Liver", "Pancreas", "Bone"]', 'donor'],
    ['Madhuri Kale', 'madhuri.k@email.com', hashedPassword, '9123456818', 'AB+', 'Malkapur, Buldhana 443101', 28, 'female', 1, '["Heart", "Kidneys"]', 'donor'],
    
    // Donors - Wardha District
    ['Pooja Gaikwad', 'pooja.g@email.com', hashedPassword, '9123456795', 'AB-', 'Gandhi Chowk, Wardha, Maharashtra 442001', 31, 'female', 1, '["Heart", "Liver", "Kidneys"]', 'donor'],
    ['Vandana Khandare', 'vandana.k@email.com', hashedPassword, '9123456803', 'AB-', 'Kasturba Road, Wardha, Maharashtra 442001', 32, 'female', 0, null, 'donor'],
    ['Sanjay Meshram', 'sanjay.m@email.com', hashedPassword, '9123456819', 'O-', 'Sevagram, Wardha 442102', 35, 'male', 1, '["Lungs", "Liver"]', 'donor']
  ];

  users.forEach(user => {
    db.run('INSERT INTO users (name, email, password, phone, blood_type, address, age, gender, organ_donor, organs_to_donate, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', user);
  });

  // Insert doctors - Maharashtra Vidarbha Region
  const doctors = [
    // Yavatmal District
    ['Dr. Ashok Deshmukh', 'dr.deshmukh@yavatmalhosp.gov.in', '9876543220', 'Hematology', 1, 'MD12345'],
    ['Dr. Sunanda Kale', 'dr.kale@pusadhosp.com', '9876543221', 'Emergency Medicine', 2, 'MD12346'],
    ['Dr. Anil Thakur', 'dr.thakur@yavatmalhosp.gov.in', '9876543228', 'Anesthesiology', 1, 'MD12353'],
    ['Dr. Shweta Kulkarni', 'dr.kulkarni@pusadhosp.com', '9876543229', 'Orthopedics', 2, 'MD12354'],
    ['Dr. Ramesh Gawande', 'dr.gawande@wanihosp.gov.in', '9876543230', 'General Surgery', 3, 'MD12355'],
    ['Dr. Anita Deshmukh', 'dr.anita@darwha.gov.in', '9876543231', 'Pediatrics', 4, 'MD12356'],
    
    // Hingoli District
    ['Dr. Prakash Bansod', 'dr.bansod@hingolihosp.gov.in', '9876543232', 'Cardiology', 5, 'MD12357'],
    ['Dr. Lata Gaikwad', 'dr.lata@kalamnuri.gov.in', '9876543233', 'Gynecology', 6, 'MD12358'],
    ['Dr. Sunil Jadhav', 'dr.jadhav@basmat.gov.in', '9876543234', 'Internal Medicine', 7, 'MD12359'],
    ['Dr. Vaishali Pawar', 'dr.pawar@hingolihosp.gov.in', '9876543235', 'Nephrology', 5, 'MD12360'],
    
    // Nagpur Division
    ['Dr. Ramesh Patil', 'dr.patil@nmc.edu', '9876543222', 'Blood Banking', 8, 'MD12347'],
    ['Dr. Deepak Meshram', 'dr.meshram@aiimsnagpur.edu.in', '9876543236', 'Transplant Surgery', 9, 'MD12361'],
    ['Dr. Neha Thakre', 'dr.thakre@iggmc.gov.in', '9876543237', 'Hepatology', 10, 'MD12362'],
    ['Dr. Vikas Bhoyar', 'dr.bhoyar@nmc.edu', '9876543238', 'Pulmonology', 8, 'MD12363'],
    
    // Akola District
    ['Dr. Vandana Joshi', 'dr.joshi@akolahosp.gov.in', '9876543223', 'Trauma Surgery', 11, 'MD12348'],
    ['Dr. Manisha Dongre', 'dr.dongre@akolahosp.gov.in', '9876543239', 'Ophthalmology', 11, 'MD12364'],
    ['Dr. Santosh Wankhede', 'dr.wankhede@akot.gov.in', '9876543240', 'General Medicine', 12, 'MD12365'],
    
    // Washim District
    ['Dr. Sunil Bhosale', 'dr.bhosale@washimhosp.gov.in', '9876543224', 'Internal Medicine', 13, 'MD12349'],
    ['Dr. Vikram Jadhav', 'dr.vikram@washimhosp.gov.in', '9876543241', 'Urology', 13, 'MD12366'],
    ['Dr. Rupali Deshmukh', 'dr.rupali@karanja.gov.in', '9876543242', 'Dermatology', 14, 'MD12367'],
    
    // Amravati District
    ['Dr. Madhuri Raut', 'dr.raut@amravatimedical.com', '9876543225', 'Cardiology', 15, 'MD12350'],
    ['Dr. Kavita Raut', 'dr.kavita@gmc.amravati.gov.in', '9876543243', 'Neurology', 16, 'MD12368'],
    ['Dr. Ajay Deshmukh', 'dr.ajay@amravatimedical.com', '9876543244', 'Gastroenterology', 15, 'MD12369'],
    
    // Buldhana District
    ['Dr. Prakash Wagh', 'dr.wagh@buldhanacivil.gov.in', '9876543226', 'Pediatrics', 17, 'MD12351'],
    ['Dr. Ganesh Borkar', 'dr.borkar@buldhanacivil.gov.in', '9876543245', 'Oncology', 17, 'MD12370'],
    ['Dr. Madhuri Kale', 'dr.madhuri@malkapur.gov.in', '9876543246', 'Radiology', 18, 'MD12371'],
    
    // Wardha District
    ['Dr. Kavita Gaikwad', 'dr.gaikwad@wardhahosp.gov.in', '9876543227', 'Pediatric Surgery', 19, 'MD12352'],
    ['Dr. Vandana Khandare', 'dr.vandana@wardhahosp.gov.in', '9876543247', 'Endocrinology', 19, 'MD12372'],
    ['Dr. Sanjay Meshram', 'dr.sanjay@sevagram.org', '9876543248', 'Community Medicine', 20, 'MD12373'],

    // Additional doctors (seeded for richer dashboard dropdowns)
    ['Dr. Rohan Deshmukh', 'dr.rohan@yavatmalhosp.gov.in', '9876543260', 'Dermatology', 1, 'MD12374'],
    ['Dr. Ayesha Farooqui', 'dr.ayesha@pusadhosp.com', '9876543261', 'Internal Medicine', 2, 'MD12375'],
    ['Dr. Nitin Joshi', 'dr.nitin@wanihosp.gov.in', '9876543262', 'Cardiology', 3, 'MD12376'],
    ['Dr. Prachi Korde', 'dr.prachi@darwha.gov.in', '9876543263', 'Pediatrics', 4, 'MD12377'],
    ['Dr. Tanvi Patil', 'dr.tanvi@hingolihosp.gov.in', '9876543264', 'Emergency Medicine', 5, 'MD12378'],
    ['Dr. Rahul Verma', 'dr.rahul@kalamnuri.gov.in', '9876543265', 'Orthopedics', 6, 'MD12379'],
    ['Dr. Meera Kulkarni', 'dr.meera@basmat.gov.in', '9876543266', 'Nephrology', 7, 'MD12380'],
    ['Dr. Komal Patil', 'dr.komal@nmc.edu', '9876543267', 'Blood Banking', 8, 'MD12381'],
    ['Dr. Vikram Shinde', 'dr.vikram@aiimsnagpur.edu.in', '9876543268', 'Transplant Surgery', 9, 'MD12382'],
    ['Dr. Ishaan Rao', 'dr.ishaan@iggmc.gov.in', '9876543269', 'Hepatology', 10, 'MD12383'],
    ['Dr. Tanishka Joshi', 'dr.tanishka@akolahosp.gov.in', '9876543270', 'Trauma Surgery', 11, 'MD12384'],
    ['Dr. Sushant Wankhede', 'dr.sushant@akot.gov.in', '9876543271', 'Ophthalmology', 12, 'MD12385'],
    ['Dr. Karan Bhosale', 'dr.karan@washimhosp.gov.in', '9876543272', 'Urology', 13, 'MD12386'],
    ['Dr. Riya Deshmukh', 'dr.riya@karanja.gov.in', '9876543273', 'Dermatology', 14, 'MD12387'],
    ['Dr. Sofia Raut', 'dr.sofia@amravatimedical.com', '9876543274', 'Cardiology', 15, 'MD12388']
  ];

  doctors.forEach(doctor => {
    db.run('INSERT INTO doctors (name, email, phone, specialization, hospital_id, license_number) VALUES (?, ?, ?, ?, ?, ?)', doctor);
  });

  // Insert blood donations - Maharashtra Vidarbha Region
  const donations = [
    // Yavatmal District
    [5, 1, 'A+', 1, '2026-01-15', '2026-02-19', 'active', 'Regular donation - Yavatmal'],
    [6, 2, 'B-', 2, '2026-01-20', '2026-02-24', 'active', 'First time donor - Pusad'],
    [7, 1, 'O+', 1, '2026-01-25', '2026-03-01', 'active', 'Repeat donor - Yavatmal'],
    [8, 2, 'A+', 1, '2026-02-01', '2026-03-08', 'active', 'Community drive - Pusad'],
    [9, 1, 'O+', 2, '2026-02-05', '2026-03-12', 'active', 'Regular donation - Yavatmal'],
    [10, 2, 'A+', 1, '2026-02-10', '2026-03-17', 'active', 'Walk-in donation - Pusad'],
    [11, 3, 'B+', 1, '2026-02-15', '2026-03-22', 'active', 'Scheduled donation - Wani'],
    [12, 4, 'O-', 1, '2026-02-18', '2026-03-25', 'active', 'Emergency donation - Darwha'],
    
    // Hingoli District
    [13, 5, 'AB+', 1, '2026-02-20', '2026-03-27', 'active', 'Regular donor - Hingoli'],
    [14, 6, 'A-', 2, '2026-02-22', '2026-03-29', 'active', 'First time donor - Kalamnuri'],
    [15, 7, 'O+', 1, '2026-02-25', '2026-04-01', 'active', 'Replacement donation - Basmat'],
    [16, 5, 'B+', 1, '2026-02-28', '2026-04-04', 'active', 'Community drive - Hingoli'],
    [17, 6, 'AB-', 2, '2026-03-01', '2026-04-05', 'active', 'Regular donation - Kalamnuri'],
    [18, 7, 'A-', 1, '2026-03-03', '2026-04-07', 'active', 'Scheduled donation - Basmat'],
    
    // Nagpur Division
    [19, 8, 'B-', 1, '2026-03-05', '2026-04-09', 'active', 'Blood bank donation - Nagpur NMC'],
    [20, 9, 'O+', 2, '2026-03-07', '2026-04-11', 'active', 'AIIMS donation drive - Nagpur'],
    [21, 10, 'A+', 1, '2026-03-08', '2026-04-12', 'active', 'Medical college drive - IGGMC'],
    [22, 8, 'B-', 1, '2026-03-10', '2026-04-14', 'active', 'Regular donor - Nagpur'],
    
    // Akola District
    [23, 11, 'AB+', 1, '2026-03-12', '2026-04-16', 'active', 'Emergency donation - Akola'],
    [24, 11, 'AB+', 2, '2026-03-14', '2026-04-18', 'active', 'Repeat donor - Akola'],
    [25, 12, 'B+', 1, '2026-03-15', '2026-04-19', 'active', 'Community drive - Akot'],
    
    // Washim District
    [26, 13, 'O-', 1, '2026-03-16', '2026-04-20', 'active', 'Regular donation - Washim'],
    [27, 13, 'O-', 2, '2026-03-18', '2026-04-22', 'active', 'Emergency response - Washim'],
    [28, 14, 'A-', 1, '2026-03-20', '2026-04-24', 'active', 'Scheduled donation - Karanja'],
    
    // Amravati District
    [29, 15, 'A-', 1, '2026-03-22', '2026-04-26', 'active', 'Regular donor - Amravati'],
    [30, 16, 'A-', 2, '2026-03-24', '2026-04-28', 'active', 'Medical college drive - Amravati'],
    [31, 15, 'O+', 1, '2026-03-25', '2026-04-29', 'active', 'Walk-in donation - Amravati'],
    
    // Buldhana District
    [32, 17, 'B+', 1, '2026-03-26', '2026-04-30', 'active', 'Community drive - Buldhana'],
    [33, 17, 'B+', 2, '2026-03-28', '2026-05-02', 'active', 'Regular donor - Buldhana'],
    [34, 18, 'AB+', 1, '2026-03-29', '2026-05-03', 'active', 'Scheduled donation - Malkapur'],
    
    // Wardha District
    [35, 19, 'AB-', 1, '2026-03-30', '2026-05-04', 'active', 'Regular donation - Wardha'],
    [36, 19, 'AB-', 2, '2026-04-01', '2026-05-06', 'active', 'Repeat donor - Wardha'],
    [37, 20, 'O-', 1, '2026-04-01', '2026-05-07', 'active', 'Sevagram health camp - Wardha'],

    // Recent 2026 entries (March-April 2026)
    [5, 1, 'A+', 2, '2026-03-28', '2026-05-02', 'active', 'Recent donation - Yavatmal'],
    [13, 5, 'AB+', 1, '2026-03-29', '2026-05-03', 'active', 'Recent donation - Hingoli'],
    [19, 8, 'B-', 2, '2026-03-30', '2026-05-04', 'active', 'Recent donation - Nagpur'],
    [26, 13, 'O-', 1, '2026-03-31', '2026-05-05', 'active', 'Recent donation - Washim'],
    [35, 19, 'AB-', 2, '2026-04-01', '2026-05-06', 'active', 'Recent donation - Wardha']
  ];

  donations.forEach(donation => {
    db.run('INSERT INTO blood_donations (donor_id, hospital_id, blood_type, quantity, donation_date, expiry_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', donation);
  });

  // Insert blood requests - Maharashtra Vidarbha Region
  const requests = [
    // Yavatmal District
    [5, 1, 'A+', 3, 'high', 'Surgery preparation - Yavatmal', 'pending', '2026-02-20'],
    [6, 2, 'B-', 2, 'critical', 'Emergency trauma - Pusad', 'fulfilled', '2026-02-18', '2026-02-18'],
    [7, 1, 'O+', 4, 'critical', 'Multiple trauma patients - Yavatmal', 'fulfilled', '2026-02-19', '2026-02-19'],
    [8, 2, 'A+', 1, 'medium', 'Routine procedure - Pusad', 'pending', '2026-02-22'],
    [11, 3, 'B+', 2, 'high', 'Surgical emergency - Wani', 'pending', '2026-02-25'],
    
    // Hingoli District
    [13, 5, 'AB+', 2, 'low', 'Elective surgery - Hingoli', 'pending', '2026-02-25'],
    [14, 6, 'A-', 1, 'medium', 'Cancer treatment - Kalamnuri', 'pending', '2026-02-26'],
    [15, 7, 'O+', 3, 'high', 'Emergency delivery - Basmat', 'fulfilled', '2026-02-23', '2026-02-23'],
    [16, 5, 'B+', 2, 'medium', 'Orthopedic surgery - Hingoli', 'pending', '2026-02-28'],
    
    // Nagpur Division
    [19, 8, 'B-', 3, 'high', 'Cardiac surgery - Nagpur NMC', 'fulfilled', '2026-02-21', '2026-02-21'],
    [21, 9, 'O+', 5, 'critical', 'Major trauma case - AIIMS Nagpur', 'pending', '2026-03-01'],
    [22, 10, 'A+', 2, 'medium', 'Planned surgery - IGGMC', 'pending', '2026-03-02'],
    
    // Akola District
    [23, 11, 'AB+', 1, 'low', 'Routine transfusion - Akola', 'pending', '2026-03-03'],
    [24, 11, 'AB+', 3, 'high', 'Emergency surgery - Akola', 'fulfilled', '2026-03-04', '2026-03-04'],
    [25, 12, 'B+', 2, 'medium', 'Surgical procedure - Akot', 'pending', '2026-03-05'],
    
    // Washim District
    [26, 13, 'O-', 2, 'critical', 'Emergency delivery - Washim', 'fulfilled', '2026-02-23', '2026-02-23'],
    [27, 13, 'O-', 1, 'medium', 'Planned surgery - Washim', 'pending', '2026-03-06'],
    [28, 14, 'A-', 2, 'high', 'Trauma case - Karanja', 'pending', '2026-03-07'],
    
    // Amravati District
    [29, 15, 'A-', 1, 'low', 'Elective procedure - Amravati', 'pending', '2026-03-08'],
    [30, 16, 'A-', 3, 'critical', 'Major surgery - GMC Amravati', 'pending', '2026-03-09'],
    [31, 15, 'O+', 2, 'medium', 'Routine transfusion - Amravati', 'pending', '2026-03-10'],
    
    // Buldhana District
    [32, 17, 'B+', 2, 'high', 'Emergency case - Buldhana', 'pending', '2026-03-11'],
    [33, 17, 'B+', 1, 'low', 'Planned surgery - Buldhana', 'pending', '2026-03-12'],
    [34, 18, 'AB+', 2, 'medium', 'Surgical procedure - Malkapur', 'pending', '2026-03-13'],
    
    // Wardha District
    [35, 19, 'AB-', 1, 'low', 'Routine procedure - Wardha', 'pending', '2026-03-14'],
    [36, 19, 'AB-', 3, 'critical', 'Emergency trauma - Wardha', 'fulfilled', '2026-03-15', '2026-03-15'],
    [37, 20, 'O-', 2, 'high', 'Surgical emergency - Sevagram', 'pending', '2026-03-16'],

    // Recent 2026 entries
    [5, 1, 'A+', 2, 'high', 'Recent surgery - Yavatmal', 'pending', '2026-03-28'],
    [13, 5, 'AB+', 1, 'medium', 'Recent request - Hingoli', 'pending', '2026-03-29'],
    [19, 8, 'O+', 3, 'critical', 'Recent emergency - Nagpur', 'pending', '2026-03-30'],
    [26, 13, 'O-', 2, 'high', 'Recent trauma - Washim', 'pending', '2026-03-31'],
    [35, 19, 'AB-', 1, 'medium', 'Recent procedure - Wardha', 'pending', '2026-04-01']
  ];

  requests.forEach(request => {
    db.run('INSERT INTO blood_requests (requester_id, hospital_id, blood_type, quantity, urgency, reason, status, requested_date, fulfilled_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', request);
  });

  // Insert comprehensive blood inventory - Maharashtra Vidarbha Region
  const inventory = [
    // Yavatmal District Hospitals
    ['A+', 25, '2026-04-15', 1, 'active'],
    ['B-', 12, '2026-04-20', 2, 'active'],
    ['O+', 30, '2026-04-18', 1, 'active'],
    ['A+', 18, '2026-04-22', 2, 'active'],
    ['B+', 15, '2026-04-25', 3, 'active'],
    ['O-', 8, '2026-04-28', 4, 'active'],
    
    // Hingoli District Hospitals
    ['AB+', 10, '2026-04-20', 5, 'active'],
    ['A-', 14, '2026-04-24', 6, 'active'],
    ['O+', 22, '2026-04-26', 7, 'active'],
    ['B+', 16, '2026-04-28', 5, 'active'],
    ['AB-', 6, '2026-04-30', 6, 'active'],
    ['A-', 9, '2026-05-02', 7, 'active'],
    
    // Nagpur Division Hospitals
    ['B-', 20, '2026-04-22', 8, 'active'],
    ['O+', 35, '2026-04-25', 9, 'active'],
    ['A+', 28, '2026-04-27', 10, 'active'],
    ['B-', 11, '2026-04-29', 8, 'active'],
    ['O+', 40, '2026-05-01', 9, 'active'],
    ['A+', 32, '2026-05-03', 10, 'active'],
    
    // Akola District Hospitals
    ['AB+', 12, '2026-04-26', 11, 'active'],
    ['AB+', 18, '2026-04-28', 11, 'active'],
    ['B+', 14, '2026-04-30', 12, 'active'],
    
    // Washim District Hospitals
    ['O-', 15, '2026-04-27', 13, 'active'],
    ['O-', 20, '2026-04-29', 13, 'active'],
    ['A-', 10, '2026-05-01', 14, 'active'],
    
    // Amravati District Hospitals
    ['A-', 16, '2026-04-28', 15, 'active'],
    ['A-', 22, '2026-04-30', 16, 'active'],
    ['O+', 38, '2026-05-02', 15, 'active'],
    
    // Buldhana District Hospitals
    ['B+', 19, '2026-04-29', 17, 'active'],
    ['B+', 24, '2026-05-01', 17, 'active'],
    ['AB+', 13, '2026-05-03', 18, 'active'],
    
    // Wardha District Hospitals
    ['AB-', 7, '2026-04-30', 19, 'active'],
    ['AB-', 11, '2026-05-02', 19, 'active'],
    ['O-', 17, '2026-05-04', 20, 'active'],
    
    // Additional inventory across all blood types
    ['A+', 20, '2026-05-05', 1, 'active'],
    ['A-', 8, '2026-05-06', 5, 'active'],
    ['B+', 22, '2026-05-07', 8, 'active'],
    ['B-', 9, '2026-05-08', 11, 'active'],
    ['AB+', 15, '2026-05-09', 15, 'active'],
    ['AB-', 5, '2026-05-10', 19, 'active'],
    ['O+', 45, '2026-05-11', 8, 'active'],
    ['O-', 12, '2026-05-12', 13, 'active']
  ];

  inventory.forEach(item => {
    db.run('INSERT INTO blood_inventory (blood_type, quantity, expiry_date, hospital_id, status) VALUES (?, ?, ?, ?, ?)', item);
  });

  // Insert organ donations - Maharashtra Vidarbha Region
  const organDonations = [
    // Yavatmal District
    [5, 1, 'Heart', 'completed', '2026-01-10', 'Successful heart donation - Yavatmal'],
    [7, 2, 'Kidneys', 'pending', null, 'Kidney donation scheduled - Pusad'],
    [9, 1, 'Corneas', 'completed', '2026-02-01', 'Cornea donation - Yavatmal'],
    [10, 2, 'Liver', 'completed', '2026-02-10', 'Successful liver donation - Pusad'],
    [11, 3, 'Kidneys', 'pending', null, 'Kidney evaluation - Wani'],
    
    // Hingoli District
    [13, 5, 'Heart', 'pending', null, 'Heart donation evaluation - Hingoli'],
    [14, 6, 'Corneas', 'completed', '2026-02-15', 'Cornea donation - Kalamnuri'],
    [15, 7, 'Liver', 'completed', '2026-02-20', 'Liver donation - Basmat'],
    [17, 5, 'Kidneys', 'pending', null, 'Kidney donation in process - Hingoli'],
    
    // Nagpur Division
    [19, 8, 'Heart', 'completed', '2026-01-15', 'Heart transplant - Nagpur NMC'],
    [21, 9, 'Liver', 'completed', '2026-02-05', 'Liver transplant - AIIMS Nagpur'],
    [22, 10, 'Kidneys', 'pending', null, 'Kidney evaluation - IGGMC'],
    
    // Akola District
    [24, 11, 'Liver', 'completed', '2026-02-12', 'Liver donation - Akola'],
    [25, 12, 'Kidneys', 'pending', null, 'Kidney donation scheduled - Akot'],
    
    // Washim District
    [26, 13, 'Heart', 'completed', '2026-01-20', 'Heart donation - Washim'],
    [28, 14, 'Corneas', 'completed', '2026-02-18', 'Cornea donation - Karanja'],
    
    // Amravati District
    [29, 15, 'Corneas', 'completed', '2026-02-22', 'Cornea donation - Amravati'],
    [30, 16, 'Kidneys', 'pending', null, 'Kidney evaluation - GMC Amravati'],
    [31, 15, 'Liver', 'completed', '2026-02-25', 'Liver donation - Amravati'],
    
    // Buldhana District
    [33, 17, 'Liver', 'completed', '2026-02-28', 'Liver donation - Buldhana'],
    [34, 18, 'Kidneys', 'pending', null, 'Kidney donation scheduled - Malkapur'],
    
    // Wardha District
    [35, 19, 'Heart', 'completed', '2026-03-01', 'Heart donation - Wardha'],
    [37, 20, 'Kidneys', 'pending', null, 'Kidney evaluation - Sevagram'],

    // Recent 2026 entries
    [5, 1, 'Corneas', 'pending', null, 'Recent cornea registration - Yavatmal'],
    [13, 5, 'Kidneys', 'eligible', null, 'Recent kidney evaluation - Hingoli'],
    [19, 8, 'Heart', 'pending', null, 'Recent heart registration - Nagpur'],
    [26, 13, 'Liver', 'pending', null, 'Recent liver registration - Washim'],
    [35, 19, 'Corneas', 'completed', '2026-03-30', 'Recent cornea donation - Wardha']
  ];

  organDonations.forEach(donation => {
    db.run('INSERT INTO organ_donations (donor_id, hospital_id, organ_type, status, donation_date, notes) VALUES (?, ?, ?, ?, ?, ?)', donation);
  });

  // Insert organ requests - Maharashtra Vidarbha Region
  const organRequests = [
    // Yavatmal District
    [6, 1, 'Heart', 'critical', 'Heart failure patient - Yavatmal', 'pending', '2026-02-20'],
    [8, 2, 'Kidneys', 'medium', 'Kidney disease patient - Pusad', 'pending', '2026-02-22'],
    [12, 3, 'Corneas', 'low', 'Vision restoration - Wani', 'pending', '2026-02-25'],
    
    // Hingoli District
    [14, 5, 'Liver', 'high', 'Liver cirrhosis treatment - Hingoli', 'fulfilled', '2026-02-18', '2026-02-18'],
    [16, 6, 'Kidneys', 'medium', 'Renal disease - Kalamnuri', 'pending', '2026-02-26'],
    [18, 7, 'Corneas', 'low', 'Corneal transplant - Basmat', 'pending', '2026-02-28'],
    
    // Nagpur Division
    [20, 8, 'Heart', 'critical', 'Cardiac surgery needed - Nagpur NMC', 'pending', '2026-02-27'],
    [22, 9, 'Liver', 'high', 'Hepatitis treatment - AIIMS Nagpur', 'fulfilled', '2026-02-21', '2026-02-21'],
    [23, 10, 'Kidneys', 'critical', 'Renal failure patient - IGGMC', 'pending', '2026-02-28'],
    
    // Akola District
    [23, 11, 'Liver', 'medium', 'Liver disease - Akola', 'pending', '2026-03-01'],
    [25, 12, 'Kidneys', 'high', 'Kidney transplant needed - Akot', 'pending', '2026-03-02'],
    
    // Washim District
    [27, 13, 'Heart', 'critical', 'Heart transplant urgent - Washim', 'fulfilled', '2026-02-23', '2026-02-23'],
    [28, 14, 'Corneas', 'medium', 'Vision restoration - Karanja', 'pending', '2026-03-03'],
    
    // Amravati District
    [29, 15, 'Corneas', 'low', 'Corneal transplant - Amravati', 'pending', '2026-03-04'],
    [30, 16, 'Kidneys', 'critical', 'Renal failure - GMC Amravati', 'pending', '2026-03-05'],
    [31, 15, 'Liver', 'high', 'Liver transplant needed - Amravati', 'fulfilled', '2026-03-06', '2026-03-06'],
    
    // Buldhana District
    [32, 17, 'Liver', 'medium', 'Hepatic disease - Buldhana', 'pending', '2026-03-07'],
    [34, 18, 'Kidneys', 'high', 'Kidney disease - Malkapur', 'pending', '2026-03-08'],
    
    // Wardha District
    [35, 19, 'Heart', 'critical', 'Cardiac emergency - Wardha', 'fulfilled', '2026-03-09', '2026-03-09'],
    [36, 19, 'Kidneys', 'medium', 'Renal disease - Wardha', 'pending', '2026-03-10'],
    [37, 20, 'Liver', 'high', 'Liver transplant - Sevagram', 'pending', '2026-03-11'],

    // Recent 2026 entries
    [6, 1, 'Kidneys', 'high', 'Recent kidney request - Yavatmal', 'pending', '2026-03-28'],
    [13, 5, 'Corneas', 'medium', 'Recent cornea request - Hingoli', 'pending', '2026-03-29'],
    [19, 8, 'Liver', 'critical', 'Recent liver request - Nagpur', 'pending', '2026-03-30'],
    [26, 13, 'Heart', 'critical', 'Recent heart request - Washim', 'pending', '2026-03-31'],
    [35, 19, 'Kidneys', 'high', 'Recent kidney request - Wardha', 'pending', '2026-04-01']
  ];

  organRequests.forEach(request => {
    db.run('INSERT INTO organ_requests (requester_id, hospital_id, organ_type, urgency, reason, status, requested_date, fulfilled_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', request);
  });

  // Insert doctor assistance requests (user -> admin -> doctor)
  const doctorRequests = [
    [5, 1, 'blood', 'Need consultation for repeated low hemoglobin reports', 'pending', null, null],
    [6, 2, 'organ', 'Need guidance about kidney donor eligibility in family', 'assigned', 2, '2026-03-18 10:30:00'],
    [13, 5, 'general', 'Post donation weakness, need doctor advice', 'assigned', 7, '2026-03-19 14:10:00'],
    [20, 8, 'blood', 'Requesting urgent review for cross-match issue', 'pending', null, null],
    [29, 15, 'organ', 'Want transplant follow-up consultation timeline', 'assigned', 23, '2026-03-20 11:45:00']
  ];

  doctorRequests.forEach(req => {
    db.run(
      'INSERT INTO doctor_requests (requester_id, hospital_id, topic, message, status, assigned_doctor_id, assigned_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      req
    );
  });

  console.log('✅ Comprehensive dummy data inserted successfully');
  console.log('📊 Maharashtra Vidarbha Region Data:');
  console.log('   - 20 hospitals (Yavatmal, Hingoli, Nagpur, Akola, Washim, Amravati, Buldhana, Wardha)');
  console.log('   - 40 users (4 admins + 36 donors)');
  console.log('   - 29 doctors across all hospitals');
  console.log('   - 33 blood donations');
  console.log('   - 27 blood requests');
  console.log('   - 41 blood inventory items');
  console.log('   - 23 organ donations');
  console.log('   - 21 organ requests');
  console.log('   - 5 doctor assistance requests');
};

module.exports = { insertDummyData };
