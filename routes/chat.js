const express = require('express');
const router = express.Router();
const db = require('../config/database').db;

// ─── Intent matching ──────────────────────────────────────────────────────────
// Each intent: { test: fn(msg) => bool, reply: fn(stats) => string }
// Order matters – first match wins.

const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

const COMPATIBILITY = {
  'O-':  { to: ['O-','O+','A-','A+','B-','B+','AB-','AB+'], from: ['O-'] },
  'O+':  { to: ['O+','A+','B+','AB+'],                       from: ['O-','O+'] },
  'A-':  { to: ['A-','A+','AB-','AB+'],                      from: ['O-','A-'] },
  'A+':  { to: ['A+','AB+'],                                  from: ['O-','O+','A-','A+'] },
  'B-':  { to: ['B-','B+','AB-','AB+'],                      from: ['O-','B-'] },
  'B+':  { to: ['B+','AB+'],                                  from: ['O-','O+','B-','B+'] },
  'AB-': { to: ['AB-','AB+'],                                 from: ['O-','A-','B-','AB-'] },
  'AB+': { to: ['AB+'],                                       from: ['O-','O+','A-','A+','B-','B+','AB-','AB+'] },
};

function has(...words) {
  return (msg) => words.every(w => msg.includes(w));
}
function any(...words) {
  return (msg) => words.some(w => msg.includes(w));
}
function startsWith(...words) {
  return (msg) => words.some(w => msg.startsWith(w));
}

// Detect blood type in message (handles "a+", "ab-", "o+" etc.)
function detectBloodType(msg) {
  // Try longest match first (ab before a/b)
  const patterns = [
    { re: /\bab[+-]/i, norm: m => m.slice(0,2).toUpperCase() + m[2] },
    { re: /\b[aob][+-]/i, norm: m => m[0].toUpperCase() + m[1] },
  ];
  for (const { re, norm } of patterns) {
    const m = msg.match(re);
    if (m) return norm(m[0]);
  }
  return null;
}

const INTENTS = [
  // ── Greetings ──
  {
    test: startsWith('hi','hello','hey','greet'),
    reply: s => `Hello! 👋 I'm your Blood & Organ Donation assistant.\n\n📊 Live Stats:\n• 🩸 ${s.totalInventory} blood units available\n• 👥 ${s.totalDonors} registered donors\n• 🏥 ${s.totalHospitals} partner hospitals\n• 🫀 ${s.organDonors} organ donors\n\nType "help" to see all commands.`,
  },

  // ── Thanks ──
  {
    test: any('thank','thanks','appreciate'),
    reply: () => `You're welcome! 😊 Every donor saves lives! 🫀`,
  },

  // ── SOPs ──
  {
    test: (msg) => msg.includes('kidney') && any('sop','procedure','guideline','standard','protocol')(msg),
    reply: () => `🫘 Kidney Donation SOP:\n\n✅ Eligibility:\n• Living: 18-65 yrs, GFR ≥80 ml/min\n• Deceased: Up to 70 yrs\n• BMI: 18-35, BP <140/90\n• No diabetes, kidney disease, or cancer\n\n📋 3-Phase Evaluation:\n1. Medical: Blood tests, imaging, kidney function\n2. Surgical: CT angiography, surgical risk\n3. Psychosocial: Mental health, informed consent\n\n⚕️ Procedure:\n• Laparoscopic nephrectomy (3-4 hrs)\n• 3-5 day hospital stay\n• 4-6 week recovery\n• Lifelong annual follow-up\n\n⚠️ Risks: Bleeding, infection, hernia (rare)`,
  },
  {
    test: (msg) => msg.includes('heart') && any('sop','procedure','guideline','standard','protocol')(msg),
    reply: () => `❤️ Heart Donation SOP:\n\n✅ Eligibility:\n• Age: 18-55 yrs\n• Brain death certified (mandatory)\n• Deceased donor only\n• No cardiac disease or trauma\n\n📋 Evaluation:\n• Brain death certification by 2 doctors\n• Echocardiography & cardiac catheterization\n• Blood type & tissue matching\n\n⚕️ Retrieval:\n• Cardioplegic arrest\n• Cold preservation (max 4-6 hrs)\n• Sterile surgical retrieval\n\n⏱️ Must be transplanted within 4-6 hours`,
  },
  {
    test: (msg) => any('eye','cornea')(msg) && any('sop','procedure','guideline','standard','protocol')(msg),
    reply: () => `👁️ Eye (Cornea) Donation SOP:\n\n✅ Eligibility:\n• All ages accepted\n• Retrieval within 6-8 hrs of death\n• No HIV, Hepatitis B/C, Rabies, Septicemia\n• Previous eye surgery OK\n\n📋 Evaluation:\n• Medical history & infectious disease screening\n• Corneal examination\n• Consent verification\n\n⚕️ Retrieval:\n• Enucleation or in-situ excision\n• Preservation in McCarey-Kaufman medium\n• Storage at 4°C (up to 14 days)\n\n🎯 90%+ success rate — restores sight to 2 people`,
  },
  {
    test: any('sop','standard operating','guideline','protocol'),
    reply: () => `📋 Available SOPs:\n\n❤️ "heart sop" — Heart donation procedure\n🫘 "kidney sop" — Kidney donation procedure\n👁️ "eye sop" — Cornea donation procedure\n\nWhich would you like?`,
  },

  // ── Blood Inventory ──
  {
    test: (msg) => (any('inventory','stock','available','units')(msg) && any('blood')(msg)) || msg === 'blood inventory',
    reply: s => `🩸 Current Blood Inventory:\n\n${s.inventory.map(i => `• ${i.blood_type}: ${i.quantity} units`).join('\n')}\n\n📦 Total: ${s.totalInventory} units`,
  },

  // ── Blood type specific (compatibility + stock) ──
  {
    test: (msg) => detectBloodType(msg) !== null,
    reply: (s, msg) => {
      const type = detectBloodType(msg);
      const c = COMPATIBILITY[type];
      if (!c) return `Unknown blood type: ${type}`;
      const stock = s.inventory.find(i => i.blood_type === type);
      const stockLine = stock ? `📦 Stock: ${stock.quantity} units available` : `📦 Stock: Currently out of stock`;
      return `${type} Blood Type\n\n${stockLine}\n\n➡️ Can donate to: ${c.to.join(', ')}\n⬅️ Can receive from: ${c.from.join(', ')}`;
    },
  },

  // ── Donor stats ──
  {
    test: (msg) => (any('donor','donors')(msg) && any('stat','stats','count','total','how many')(msg)) || msg === 'donor stats',
    reply: s => `📊 Donor Statistics:\n\n👥 Total Donors: ${s.totalDonors}\n✅ Active Donors: ${s.activeDonors}\n🫀 Organ Donors: ${s.organDonors}\n\nOrgan-wise registrations:\n• ❤️ Heart: ${s.heartDonors}\n• 🫘 Kidney: ${s.kidneyDonors}\n• 👁️ Cornea: ${s.corneaDonors}`,
  },

  // ── Organ donation stats ──
  {
    test: (msg) => any('organ donation','organ donations')(msg) && any('stat','stats','count','total','how many','list')(msg),
    reply: s => `🫀 Organ Donation Stats:\n\n📋 Total Registered: ${s.totalOrganDonations}\n✅ Completed: ${s.completedOrganDonations}\n⏳ Pending: ${s.pendingOrganDonations}\n\nBy organ:\n• ❤️ Heart: ${s.heartDonations}\n• 🫘 Kidney: ${s.kidneyDonations}\n• 👁️ Cornea: ${s.corneaDonations}\n• 🫁 Liver: ${s.liverDonations}`,
  },

  // ── Organ request stats ──
  {
    test: (msg) => any('organ request','organ requests')(msg) && any('stat','stats','count','total','how many','list')(msg),
    reply: s => `📋 Organ Request Stats:\n\n📨 Total Requests: ${s.totalOrganRequests}\n✅ Fulfilled: ${s.fulfilledOrganRequests}\n⏳ Pending: ${s.pendingOrganRequests}\n🚨 Critical: ${s.criticalOrganRequests}`,
  },

  // ── Blood donation stats ──
  {
    test: (msg) => any('blood donation','blood donations')(msg) && any('stat','stats','count','total','how many')(msg),
    reply: s => `🩸 Blood Donation Stats:\n\n📋 Total Donations: ${s.totalDonations}\n✅ Active: ${s.activeDonations}\n⏰ Expired: ${s.expiredDonations}\n✔️ Used: ${s.usedDonations}`,
  },

  // ── Blood request stats ──
  {
    test: (msg) => any('blood request','blood requests')(msg) && any('stat','stats','count','total','how many')(msg),
    reply: s => `📋 Blood Request Stats:\n\n📨 Total Requests: ${s.totalBloodRequests}\n✅ Fulfilled: ${s.fulfilledRequests}\n⏳ Pending: ${s.pendingRequests}\n🚨 Critical: ${s.criticalRequests}`,
  },

  // ── Hospitals ──
  {
    test: (msg) => msg.includes('hospital') && any('list','show','all','how many','count','total')(msg),
    reply: s => `🏥 Registered Hospitals (${s.totalHospitals}):\n\n${s.hospitals.map(h => `• ${h.name}\n  📞 ${h.phone}`).join('\n\n')}`,
  },
  {
    test: (msg) => msg.includes('hospital'),
    reply: s => `🏥 We have ${s.totalHospitals} registered hospitals.\n\nType "list hospitals" to see all.`,
  },

  // ── Doctors ──
  {
    test: (msg) => msg.includes('doctor') && any('list','show','all','how many','count','total')(msg),
    reply: s => `👨‍⚕️ Doctors:\n\n• Total registered: ${s.totalDoctors}\n• Available now: ${s.availableDoctors}\n\nSpecializations include: Cardiology, Nephrology, Ophthalmology, Transplant Surgery, Hematology and more.\n\nType "list hospitals" to find hospitals with doctors.`,
  },

  // ── Eligibility ──
  {
    test: (msg) => msg.includes('heart') && any('eligib','qualify','requirement','who can')(msg),
    reply: () => `❤️ Heart Donation Eligibility:\n\n✅ Requirements:\n• Age: 18-55 yrs\n• Brain death certified\n• Deceased donor only\n• No cardiac disease\n• Negative infection screening\n\n❌ Exclusions:\n• Active infection or cancer\n• Severe cardiac trauma\n• Prolonged cardiac arrest`,
  },
  {
    test: (msg) => msg.includes('kidney') && any('eligib','qualify','requirement','who can')(msg),
    reply: () => `🫘 Kidney Donation Eligibility:\n\n✅ Living Donor:\n• Age: 18-65 yrs, GFR ≥80 ml/min\n• BMI: 18-35, BP <140/90\n• No diabetes or kidney disease\n\n✅ Deceased Donor:\n• Up to 70 yrs\n• Normal kidney function\n• No systemic infection`,
  },
  {
    test: (msg) => any('eye','cornea')(msg) && any('eligib','qualify','requirement','who can')(msg),
    reply: () => `👁️ Eye Donation Eligibility:\n\n✅ Most Liberal Criteria:\n• All ages accepted\n• Retrieval within 6-8 hrs\n• Previous eye surgery OK\n\n❌ Only Exclusions:\n• HIV, Hepatitis B/C\n• Rabies, Septicemia\n• Unknown cause of death`,
  },
  {
    test: (msg) => any('eligib','qualify','can i donate','requirement','who can donate')(msg),
    reply: () => `🩸 Blood Donation Eligibility:\n\n✅ Requirements:\n• Age: 18-65 yrs\n• Weight: >50 kg\n• Hemoglobin: >12.5 g/dL\n• Good general health\n\n⏱️ Frequency: Every 3 months\n\nFor organ eligibility ask:\n• "heart eligibility"\n• "kidney eligibility"\n• "eye eligibility"`,
  },

  // ── Risks ──
  {
    test: (msg) => msg.includes('kidney') && any('risk','danger','complication','side effect','safe')(msg),
    reply: () => `⚠️ Kidney Donation Risks:\n\n🔴 Short-term:\n• Bleeding, infection (2-3%)\n• Blood clots (1%)\n• Hernia at incision site\n\n🟡 Long-term:\n• Chronic kidney disease (rare, <1%)\n• Slight BP increase\n• Protein in urine\n\n✅ 99%+ donors live normal healthy lives`,
  },
  {
    test: (msg) => msg.includes('heart') && any('risk','danger','complication','safe')(msg),
    reply: () => `❤️ Heart donation is deceased-donor only (brain death). No risks to the donor — focus is on proper retrieval & preservation for the recipient.`,
  },
  {
    test: (msg) => any('eye','cornea')(msg) && any('risk','danger','complication','safe')(msg),
    reply: () => `👁️ Eye donation is from deceased donors. No risks to the donor. The procedure doesn't disfigure the face and can restore sight to 2 people.`,
  },
  {
    test: any('risk','danger','complication','side effect'),
    reply: () => `🩸 Blood Donation Risks:\n\n✅ Very safe — sterile single-use equipment\n\n🟡 Minor side effects:\n• Temporary dizziness\n• Bruising at needle site\n• Fatigue (rare)\n\nFor organ risks ask:\n• "kidney risks"\n• "heart risks"\n• "eye risks"`,
  },

  // ── Recovery ──
  {
    test: (msg) => msg.includes('kidney') && any('recover','recovery','healing','after','post','timeline')(msg),
    reply: () => `🫘 Kidney Donation Recovery:\n\n⏱️ Timeline:\n• Hospital stay: 3-5 days\n• Return to work: 4-6 weeks\n• Full recovery: 2-3 months\n\n📋 Lifelong follow-up:\n• Annual kidney function tests\n• Blood pressure monitoring\n• Urine protein checks`,
  },
  {
    test: (msg) => msg.includes('blood') && any('recover','recovery','after','post','timeline')(msg),
    reply: () => `🩸 Blood Donation Recovery:\n\n⏱️ Timeline:\n• Rest: 15-20 min post-donation\n• Normal activities: 24 hrs\n• Next donation: 3 months\n\n💧 Tips:\n• Drink plenty of fluids\n• Eat iron-rich foods\n• Avoid heavy lifting for 24 hrs`,
  },
  {
    test: any('recover','recovery','healing','after donation','post donation'),
    reply: () => `Recovery times:\n• 🩸 Blood: 24 hours\n• 🫘 Kidney (living): 4-6 weeks\n• ❤️ Heart: Deceased donor\n• 👁️ Eye: Deceased donor\n\nAsk "kidney recovery" or "blood recovery" for details.`,
  },

  // ── Process / How to ──
  {
    test: (msg) => any('organ','kidney','heart','eye','cornea')(msg) && any('process','steps','how to','register','procedure','donate')(msg),
    reply: () => `🫀 Organ Donation Process:\n\n1️⃣ Register & create account\n2️⃣ Complete medical profile\n3️⃣ Read organ-specific SOP\n4️⃣ Accept SOP & consent\n5️⃣ Medical evaluation (lab tests, imaging)\n6️⃣ Psychological assessment\n7️⃣ Sign consent forms\n8️⃣ Surgical procedure\n9️⃣ Post-op monitoring\n🔟 Lifelong follow-up (living donors)`,
  },
  {
    test: any('process','steps','how to donate blood','blood donation process'),
    reply: () => `🩸 Blood Donation Process:\n\n1️⃣ Register & login\n2️⃣ Check eligibility\n3️⃣ Visit partner hospital\n4️⃣ Health screening\n5️⃣ Donate blood (10-15 min)\n6️⃣ Rest & refreshments\n7️⃣ Track donation in dashboard`,
  },

  // ── Project / System info ──
  {
    test: any('about','what is this','project','system','app','platform'),
    reply: s => `🏥 Blood & Organ Donation Management System\n\n📊 Live Stats:\n• 👥 ${s.totalDonors} donors registered\n• 🏥 ${s.totalHospitals} partner hospitals\n• 👨‍⚕️ ${s.totalDoctors} doctors\n• 🩸 ${s.totalInventory} blood units in stock\n• 🫀 ${s.totalOrganDonations} organ donations\n• 📋 ${s.totalBloodRequests} blood requests\n\n🔧 Tech: MERN Stack + SQLite\n🔐 Features: JWT auth, role-based access (Admin/Donor)\n🫀 Organs: Heart, Kidney, Eye (Cornea)\n🩸 Blood types: A+, A-, B+, B-, AB+, AB-, O+, O-`,
  },

  // ── Pending requests ──
  {
    test: (msg) => any('pending')(msg) && any('request','requests')(msg),
    reply: s => `⏳ Pending Requests:\n\n🩸 Blood: ${s.pendingRequests} pending\n🫀 Organ: ${s.pendingOrganRequests} pending\n🚨 Critical blood: ${s.criticalRequests}\n🚨 Critical organ: ${s.criticalOrganRequests}`,
  },

  // ── Overall stats / dashboard ──
  {
    test: any('stats','statistics','dashboard','overview','summary','numbers'),
    reply: s => `📊 System Overview:\n\n👥 Donors: ${s.totalDonors} (${s.organDonors} organ donors)\n🏥 Hospitals: ${s.totalHospitals}\n👨‍⚕️ Doctors: ${s.totalDoctors}\n\n🩸 Blood:\n• Inventory: ${s.totalInventory} units\n• Donations: ${s.totalDonations}\n• Requests: ${s.totalBloodRequests} (${s.pendingRequests} pending)\n\n🫀 Organs:\n• Donations: ${s.totalOrganDonations} (${s.pendingOrganDonations} pending)\n• Requests: ${s.totalOrganRequests} (${s.pendingOrganRequests} pending)`,
  },
];

// ─── Route ────────────────────────────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const msg = message.toLowerCase().trim();
    const stats = await getStats();

    let reply = '';

    for (const intent of INTENTS) {
      if (intent.test(msg)) {
        reply = intent.reply(stats, msg);
        break;
      }
    }

    if (!reply) {
      reply = `I didn't understand that. Here's what I can help with:\n\n📋 SOPs: "kidney sop", "heart sop", "eye sop"\n🩸 Blood: "blood inventory", "A+ compatibility", "blood eligibility", "blood risks", "blood recovery"\n🫀 Organ: "kidney eligibility", "kidney risks", "kidney recovery", "organ donation process"\n📊 Stats: "donor stats", "blood donation stats", "organ donation stats", "blood request stats", "organ request stats", "pending requests"\n🏥 Info: "list hospitals", "doctor count", "about this system"\n\nOr type "help" for the full command list.`;
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// ─── Stats ────────────────────────────────────────────────────────────────────
function dbGet(query, params = []) {
  return new Promise((resolve) => db.get(query, params, (err, row) => resolve(row || {})));
}
function dbAll(query, params = []) {
  return new Promise((resolve) => db.all(query, params, (err, rows) => resolve(rows || [])));
}

async function getStats() {
  const [
    donors, activeDonors, organDonors, heartDonors, kidneyDonors, corneaDonors,
    hospitals, allHospitals, doctors, availableDoctors,
    totalDonations, activeDonations, expiredDonations, usedDonations,
    totalBloodRequests, pendingRequests, fulfilledRequests, criticalRequests,
    totalOrganDonations, completedOrganDonations, pendingOrganDonations,
    heartDonations, kidneyDonations, corneaDonations, liverDonations,
    totalOrganRequests, fulfilledOrganRequests, pendingOrganRequests, criticalOrganRequests,
    inventory,
  ] = await Promise.all([
    dbGet('SELECT COUNT(*) as c FROM users WHERE role="donor"'),
    dbGet('SELECT COUNT(*) as c FROM users WHERE role="donor" AND status="active"'),
    dbGet('SELECT COUNT(*) as c FROM users WHERE organ_donor=1'),
    dbGet('SELECT COUNT(*) as c FROM users WHERE organs_to_donate LIKE "%Heart%"'),
    dbGet('SELECT COUNT(*) as c FROM users WHERE organs_to_donate LIKE "%Kidney%"'),
    dbGet('SELECT COUNT(*) as c FROM users WHERE organs_to_donate LIKE "%Cornea%"'),
    dbGet('SELECT COUNT(*) as c FROM hospitals'),
    dbAll('SELECT name, phone FROM hospitals ORDER BY name'),
    dbGet('SELECT COUNT(*) as c FROM doctors'),
    dbGet('SELECT COUNT(*) as c FROM doctors WHERE availability_status="available"'),
    dbGet('SELECT COUNT(*) as c FROM blood_donations'),
    dbGet('SELECT COUNT(*) as c FROM blood_donations WHERE status="active"'),
    dbGet('SELECT COUNT(*) as c FROM blood_donations WHERE status="expired"'),
    dbGet('SELECT COUNT(*) as c FROM blood_donations WHERE status="used"'),
    dbGet('SELECT COUNT(*) as c FROM blood_requests'),
    dbGet('SELECT COUNT(*) as c FROM blood_requests WHERE status="pending"'),
    dbGet('SELECT COUNT(*) as c FROM blood_requests WHERE status="fulfilled"'),
    dbGet('SELECT COUNT(*) as c FROM blood_requests WHERE urgency="critical" AND status="pending"'),
    dbGet('SELECT COUNT(*) as c FROM organ_donations'),
    dbGet('SELECT COUNT(*) as c FROM organ_donations WHERE status="completed"'),
    dbGet('SELECT COUNT(*) as c FROM organ_donations WHERE status="pending"'),
    dbGet('SELECT COUNT(*) as c FROM organ_donations WHERE organ_type="Heart"'),
    dbGet('SELECT COUNT(*) as c FROM organ_donations WHERE organ_type IN ("Kidney","Kidneys")'),
    dbGet('SELECT COUNT(*) as c FROM organ_donations WHERE organ_type IN ("Corneas","Cornea","Eye")'),
    dbGet('SELECT COUNT(*) as c FROM organ_donations WHERE organ_type="Liver"'),
    dbGet('SELECT COUNT(*) as c FROM organ_requests'),
    dbGet('SELECT COUNT(*) as c FROM organ_requests WHERE status="fulfilled"'),
    dbGet('SELECT COUNT(*) as c FROM organ_requests WHERE status="pending"'),
    dbGet('SELECT COUNT(*) as c FROM organ_requests WHERE urgency="critical" AND status="pending"'),
    dbAll('SELECT blood_type, SUM(quantity) as quantity FROM blood_inventory WHERE status="active" GROUP BY blood_type ORDER BY blood_type'),
  ]);

  return {
    totalDonors: donors.c || 0,
    activeDonors: activeDonors.c || 0,
    organDonors: organDonors.c || 0,
    heartDonors: heartDonors.c || 0,
    kidneyDonors: kidneyDonors.c || 0,
    corneaDonors: corneaDonors.c || 0,
    totalHospitals: hospitals.c || 0,
    hospitals: allHospitals,
    totalDoctors: doctors.c || 0,
    availableDoctors: availableDoctors.c || 0,
    totalDonations: totalDonations.c || 0,
    activeDonations: activeDonations.c || 0,
    expiredDonations: expiredDonations.c || 0,
    usedDonations: usedDonations.c || 0,
    totalBloodRequests: totalBloodRequests.c || 0,
    pendingRequests: pendingRequests.c || 0,
    fulfilledRequests: fulfilledRequests.c || 0,
    criticalRequests: criticalRequests.c || 0,
    totalOrganDonations: totalOrganDonations.c || 0,
    completedOrganDonations: completedOrganDonations.c || 0,
    pendingOrganDonations: pendingOrganDonations.c || 0,
    heartDonations: heartDonations.c || 0,
    kidneyDonations: kidneyDonations.c || 0,
    corneaDonations: corneaDonations.c || 0,
    liverDonations: liverDonations.c || 0,
    totalOrganRequests: totalOrganRequests.c || 0,
    fulfilledOrganRequests: fulfilledOrganRequests.c || 0,
    pendingOrganRequests: pendingOrganRequests.c || 0,
    criticalOrganRequests: criticalOrganRequests.c || 0,
    inventory,
    totalInventory: inventory.reduce((s, r) => s + (r.quantity || 0), 0),
  };
}

module.exports = router;
