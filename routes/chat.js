const express = require('express');
const router = express.Router();
const db = require('../config/database').db;

// Advanced internal AI assistant with database integration
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const msg = message.toLowerCase();
    const stats = await getStats();
    
    let reply = '';

    // SOP queries - Kidney
    if (msg.match(/kidney.*(sop|procedure|guideline|standard)/i) || msg.match(/(sop|procedure|guideline).*kidney/i)) {
      reply = `🫘 Kidney Donation SOP:\n\n✅ Eligibility:\n• Living: 18-65 years, GFR ≥80 ml/min\n• Deceased: Up to 70 years\n• BMI: 18-35, BP <140/90\n• No diabetes, kidney disease, or cancer\n\n📋 3-Phase Evaluation:\n1. Medical: Blood tests, imaging, kidney function\n2. Surgical: CT angiography, surgical risk assessment\n3. Psychosocial: Mental health, informed consent\n\n⚕️ Procedure:\n• Laparoscopic nephrectomy (3-4 hours)\n• 3-5 day hospital stay\n• 4-6 week recovery\n• Lifelong annual follow-up required\n\n⚠️ Risks: Bleeding, infection, hernia, chronic kidney disease (rare)\n\nWant more details on any specific aspect?`;
    }
    // SOP queries - Heart
    else if (msg.match(/heart.*(sop|procedure|guideline|standard)/i) || msg.match(/(sop|procedure|guideline).*heart/i)) {
      reply = `❤️ Heart Donation SOP:\n\n✅ Eligibility:\n• Age: 18-55 years\n• Brain death certified (mandatory)\n• Deceased donor only\n• No cardiac disease or trauma\n• Negative infectious disease screening\n\n📋 Evaluation:\n• Brain death certification by 2 doctors\n• Echocardiography & cardiac catheterization\n• Blood type matching\n• Tissue typing & crossmatching\n\n⚕️ Retrieval Procedure:\n• Cardioplegic arrest\n• Cold preservation (4-6 hours max)\n• Sterile surgical retrieval\n• Immediate transport to recipient\n\n⏱️ Time Critical: Heart must be transplanted within 4-6 hours\n\nNeed information about the donation process?`;
    }
    // SOP queries - Eye/Cornea
    else if (msg.match(/(eye|cornea).*(sop|procedure|guideline|standard)/i) || msg.match(/(sop|procedure|guideline).*(eye|cornea)/i)) {
      reply = `👁️ Eye (Cornea) Donation SOP:\n\n✅ Eligibility:\n• All ages accepted (most liberal criteria)\n• Retrieval within 6-8 hours of death\n• No HIV, Hepatitis B/C, Rabies, Septicemia\n• Previous eye surgery not a contraindication\n\n📋 Evaluation:\n• Medical history review\n• Infectious disease screening\n• Corneal examination\n• Consent verification\n\n⚕️ Retrieval Procedure:\n• Enucleation (whole eye) or in-situ excision\n• Sterile technique\n• Preservation in McCarey-Kaufman medium\n• Storage at 4°C (up to 14 days)\n\n🎯 Success Rate: 90%+ for corneal transplants\n• Can restore sight to 2 people per donor\n\nWant to know about the transplant process?`;
    }
    // General SOP query
    else if (msg.match(/\b(sop|standard operating|procedure|guideline)\b/i)) {
      reply = `📋 Standard Operating Procedures (SOP):\n\nWe have detailed SOPs for:\n\n❤️ Heart Donation - Brain death, cardiac evaluation\n🫘 Kidney Donation - Living/deceased, 3-phase evaluation\n👁️ Eye Donation - Cornea retrieval, preservation\n\nWhich organ's SOP would you like to know about?\n\nYou can ask:\n• "kidney sop"\n• "heart donation procedure"\n• "eye donation guidelines"`;
    }
    // Blood inventory
    else if (msg.match(/\b(available|stock|inventory)\b.*\b(blood|units)\b/i) || msg.match(/\b(blood|units)\b.*\b(available|stock|inventory)\b/i)) {
      reply = `🩸 Current Blood Inventory:\n${formatInventory(stats.inventory)}\n\nTotal: ${stats.totalInventory} units available`;
    }
    // Specific blood type
    else if (msg.match(/(a\+|a-|b\+|b-|ab\+|ab-|o\+|o-)/i)) {
      const type = msg.match(/(a\+|a-|b\+|b-|ab\+|ab-|o\+|o-)/i)[0].toUpperCase();
      if (msg.match(/\b(donate to|compatible|receive)\b/i)) {
        reply = getCompatibility(type);
      } else {
        const stock = stats.inventory.find(i => i.blood_type === type);
        reply = stock ? `${type} Blood: ${stock.quantity} units available` : `${type} Blood: Currently out of stock`;
      }
    }
    // Donor statistics
    else if (msg.match(/\b(how many|total|count)\b.*\bdonor/i) || msg.match(/\bdonor.*(statistics|stats|count)\b/i)) {
      reply = `📊 Donor Statistics:\n\n👥 Total Donors: ${stats.totalDonors}\n✅ Active Donors: ${stats.activeDonors}\n🫀 Organ Donors: ${stats.organDonors}\n\nOrgan-wise:\n• ❤️ Heart: ${stats.heartDonors}\n• 🫘 Kidney: ${stats.kidneyDonors}\n• 👁️ Eye: ${stats.eyeDonors}`;
    }
    // Hospital info
    else if (msg.match(/\bhospital/i)) {
      if (msg.match(/\b(list|show|all)\b/i)) {
        reply = `🏥 Registered Hospitals (${stats.totalHospitals}):\n\n${stats.hospitals.map(h => `• ${h.name}\n  📞 ${h.phone}`).join('\n\n')}`;
      } else {
        reply = `We have ${stats.totalHospitals} registered hospitals in our network. Type "list hospitals" to see all.`;
      }
    }
    // Eligibility
    else if (msg.match(/\b(eligib|qualify|can i donate|requirements)\b/i)) {
      if (msg.match(/\bheart\b/i)) {
        reply = `❤️ Heart Donation Eligibility:\n\n✅ Requirements:\n• Age: 18-55 years\n• Brain death certified\n• Deceased donor only\n• No cardiac disease\n• Negative infection screening\n\n❌ Exclusions:\n• Active infection or cancer\n• Severe cardiac trauma\n• Prolonged cardiac arrest`;
      } else if (msg.match(/\bkidney\b/i)) {
        reply = `🫘 Kidney Donation Eligibility:\n\n✅ Living Donor:\n• Age: 18-65 years\n• GFR ≥80 ml/min\n• BMI: 18-35\n• BP <140/90\n• No diabetes or kidney disease\n\n✅ Deceased Donor:\n• Up to 70 years\n• Normal kidney function\n• No systemic infection`;
      } else if (msg.match(/\b(eye|cornea)\b/i)) {
        reply = `👁️ Eye Donation Eligibility:\n\n✅ Most Liberal Criteria:\n• All ages accepted\n• Retrieval within 6-8 hours\n• Previous eye surgery OK\n\n❌ Only Exclusions:\n• HIV, Hepatitis B/C\n• Rabies, Septicemia\n• Unknown cause of death`;
      } else {
        reply = `🩸 Blood Donation Eligibility:\n\n✅ Requirements:\n• Age: 18-65 years\n• Weight: >50 kg\n• Hemoglobin: >12.5 g/dL\n• Good health\n\n⏱️ Frequency: Every 3 months\n\nFor organ donation eligibility, ask about specific organs (heart, kidney, eye).`;
      }
    }
    // Risks
    else if (msg.match(/\b(risk|danger|complication|side effect)\b/i)) {
      if (msg.match(/\bkidney\b/i)) {
        reply = `⚠️ Kidney Donation Risks:\n\n🔴 Surgical (Short-term):\n• Bleeding, infection (2-3%)\n• Blood clots (1%)\n• Hernia at incision site\n\n🟡 Long-term:\n• Chronic kidney disease (rare, <1%)\n• High blood pressure (slight increase)\n• Protein in urine\n\n✅ Overall: Very safe with proper screening\n• 99%+ donors live normal, healthy lives\n• Lifelong monitoring ensures safety`;
      } else if (msg.match(/\bheart\b/i)) {
        reply = `Heart donation is from deceased donors only (brain death), so there are no risks to the donor. The focus is on proper retrieval and preservation for the recipient.`;
      } else if (msg.match(/\b(eye|cornea)\b/i)) {
        reply = `Eye donation is from deceased donors, so there are no risks to the donor. The procedure is simple, doesn't disfigure the face, and can restore sight to 2 people.`;
      } else {
        reply = `🩸 Blood Donation Risks:\n\n✅ Very Safe:\n• Sterile, single-use equipment\n• Trained professionals\n• Minimal discomfort\n\n🟡 Minor Side Effects:\n• Temporary dizziness\n• Bruising at needle site\n• Fatigue (rare)\n\nFor organ donation risks, specify the organ (kidney, heart, eye).`;
      }
    }
    // Recovery
    else if (msg.match(/\b(recover|healing|after|post)/i)) {
      if (msg.match(/\bkidney\b/i)) {
        reply = `🫘 Kidney Donation Recovery:\n\n⏱️ Timeline:\n• Hospital: 3-5 days\n• Return to work: 4-6 weeks\n• Full recovery: 2-3 months\n\n📋 Follow-up:\n• Annual checkups (lifelong)\n• Kidney function monitoring\n• Blood pressure checks\n• Urine protein tests\n\n✅ Long-term: Normal, healthy life with one kidney`;
      } else if (msg.match(/\bblood\b/i)) {
        reply = `🩸 Blood Donation Recovery:\n\n⏱️ Timeline:\n• Rest: 15-20 minutes post-donation\n• Normal activities: 24 hours\n• Next donation: 3 months\n\n💧 Tips:\n• Drink plenty of fluids\n• Eat iron-rich foods\n• Avoid heavy lifting for 24 hours`;
      } else {
        reply = `Recovery times:\n• 🩸 Blood: 24 hours\n• 🫘 Kidney (living): 4-6 weeks\n• ❤️ Heart: Deceased donor\n• 👁️ Eye: Deceased donor\n\nWhich would you like details about?`;
      }
    }
    // Process/How to
    else if (msg.match(/\b(how to|process|steps|register)\b/i)) {
      if (msg.match(/\b(organ|kidney|heart|eye)\b/i)) {
        reply = `🫀 Organ Donation Process:\n\n1️⃣ Registration\n• Create account\n• Complete medical profile\n\n2️⃣ SOP Review\n• Read organ-specific SOP\n• Accept terms & conditions\n\n3️⃣ Medical Evaluation\n• Health screening\n• Lab tests & imaging\n• Psychological assessment\n\n4️⃣ Consent\n• Sign consent forms\n• Emergency contact details\n\n5️⃣ Procedure\n• Surgical donation\n• Post-op monitoring\n\n6️⃣ Follow-up\n• Regular checkups\n• Lifelong monitoring (living donors)`;
      } else {
        reply = `🩸 Blood Donation Process:\n\n1️⃣ Register & Login\n2️⃣ Check eligibility\n3️⃣ Schedule donation\n4️⃣ Health screening\n5️⃣ Donate blood (10-15 min)\n6️⃣ Rest & refreshments\n7️⃣ Track your donation\n\nFor organ donation process, ask "organ donation process"`;
      }
    }
    // Greetings
    else if (msg.match(/^(hi|hello|hey|greetings)/i)) {
      reply = `Hello! 👋 I'm your Blood & Organ Donation assistant.\n\n📊 Quick Stats:\n• ${stats.totalInventory} units of blood available\n• ${stats.totalDonors} registered donors\n• ${stats.totalHospitals} partner hospitals\n\nI can help with:\n• 📋 SOPs (kidney, heart, eye)\n• 🩸 Blood inventory & compatibility\n• 🫀 Organ donation info\n• ✅ Eligibility & requirements\n• ⚕️ Procedures & recovery\n\nWhat would you like to know?`;
    }
    // Thanks
    else if (msg.match(/\b(thank|thanks|appreciate)\b/i)) {
      reply = `You're welcome! 😊 Feel free to ask if you have more questions about blood or organ donation. Every donor saves lives! 🫀`;
    }
    // Default
    else {
      reply = `I can help you with:\n\n📋 SOPs & Guidelines:\n• "kidney sop" - Kidney donation procedure\n• "heart sop" - Heart donation guidelines\n• "eye sop" - Cornea donation process\n\n🩸 Blood Donation:\n• "blood inventory" - Current stock\n• "O+ compatible" - Blood compatibility\n• "eligibility" - Who can donate\n\n🫀 Organ Donation:\n• "kidney eligibility" - Requirements\n• "kidney risks" - Safety information\n• "kidney recovery" - Post-donation\n\n📊 Statistics:\n• "donor stats" - Current numbers\n• "list hospitals" - Partner hospitals\n\nTry asking about any of these topics!`;
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get real-time statistics from database
function getStats() {
  return new Promise((resolve, reject) => {
    const stats = {};
    
    db.get('SELECT COUNT(*) as count FROM users WHERE role = "donor"', (err, row) => {
      stats.totalDonors = row?.count || 0;
      
      db.get('SELECT COUNT(*) as count FROM users WHERE role = "donor" AND status = 1', (err, row) => {
        stats.activeDonors = row?.count || 0;
        
        db.get('SELECT COUNT(*) as count FROM users WHERE organ_donor = 1', (err, row) => {
          stats.organDonors = row?.count || 0;
          
          db.get('SELECT COUNT(*) as count FROM users WHERE organs_to_donate LIKE "%Heart%"', (err, row) => {
            stats.heartDonors = row?.count || 0;
            
            db.get('SELECT COUNT(*) as count FROM users WHERE organs_to_donate LIKE "%Kidney%"', (err, row) => {
              stats.kidneyDonors = row?.count || 0;
              
              db.get('SELECT COUNT(*) as count FROM users WHERE organs_to_donate LIKE "%Eye%"', (err, row) => {
                stats.eyeDonors = row?.count || 0;
                
                db.get('SELECT COUNT(*) as count FROM hospitals', (err, row) => {
                  stats.totalHospitals = row?.count || 0;
                  
                  db.all('SELECT name, phone FROM hospitals LIMIT 5', (err, rows) => {
                    stats.hospitals = rows || [];
                    
                    db.get('SELECT COUNT(*) as count FROM blood_donations', (err, row) => {
                      stats.totalDonations = row?.count || 0;
                      
                      db.get('SELECT COUNT(*) as count FROM blood_requests WHERE status = "pending"', (err, row) => {
                        stats.pendingRequests = row?.count || 0;
                        
                        db.get('SELECT COUNT(*) as count FROM blood_requests WHERE status = "fulfilled"', (err, row) => {
                          stats.fulfilledRequests = row?.count || 0;
                          
                          db.all('SELECT blood_type, SUM(quantity) as quantity FROM blood_inventory GROUP BY blood_type', (err, rows) => {
                            stats.inventory = rows || [];
                            stats.totalInventory = rows?.reduce((sum, r) => sum + r.quantity, 0) || 0;
                            resolve(stats);
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function formatInventory(inventory) {
  if (!inventory.length) return 'No blood currently in inventory';
  return inventory.map(i => `• ${i.blood_type}: ${i.quantity} units`).join('\n');
}

function getCompatibility(bloodType) {
  const compatibility = {
    'O-': { canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-'] },
    'O+': { canDonateTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O-', 'O+'] },
    'A-': { canDonateTo: ['A-', 'A+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'A-'] },
    'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+'] },
    'B-': { canDonateTo: ['B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'B-'] },
    'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'B-', 'B+'] },
    'AB-': { canDonateTo: ['AB-', 'AB+'], canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'] },
    'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] }
  };
  
  const info = compatibility[bloodType];
  return `${bloodType} Blood Compatibility:\n\nCan donate to: ${info.canDonateTo.join(', ')}\nCan receive from: ${info.canReceiveFrom.join(', ')}`;
}

module.exports = router;
