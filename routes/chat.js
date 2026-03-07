const express = require('express');
const router = express.Router();

// Simple AI chat endpoint with context about blood & organ donation
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Knowledge base for the assistant
    const knowledgeBase = {
      bloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      organs: ['Heart', 'Kidney', 'Eye'],
      eligibility: {
        blood: 'Age 18-65, weight >50kg, healthy',
        heart: 'Age 18-55, brain death certified, deceased donor only',
        kidney: 'Age 18-65 (living), up to 70 (deceased), normal kidney function',
        eye: 'All ages, retrieval within 6-8 hours of death'
      },
      faqs: {
        'blood donation': 'Blood donation is safe and takes about 10-15 minutes. You can donate every 3 months. Eat well and stay hydrated before donating.',
        'organ donation': 'Organ donation can save up to 8 lives. You can register as a living or deceased donor. Discuss with your family.',
        'eligibility': 'Eligibility varies by donation type. Generally, you should be healthy, meet age requirements, and pass medical screening.',
        'process': 'Registration → Medical evaluation → Consent → Donation → Follow-up care',
        'safety': 'All procedures follow strict medical protocols. Sterile equipment is used, and trained professionals handle everything.',
        'recovery': 'Blood donation: Rest for 24 hours. Organ donation (living): 4-6 weeks recovery with lifelong follow-up.'
      }
    };

    // Simple response logic
    const lowerMessage = message.toLowerCase();
    let reply = '';

    if (lowerMessage.includes('blood type') || lowerMessage.includes('blood group')) {
      reply = `We support all blood types: ${knowledgeBase.bloodTypes.join(', ')}. Universal donors are O- and universal recipients are AB+.`;
    } else if (lowerMessage.includes('organ') && lowerMessage.includes('available')) {
      reply = `We facilitate donation for three primary organs: Heart (deceased only), Kidney (living & deceased), and Eye/Cornea (deceased only). Each has specific eligibility criteria.`;
    } else if (lowerMessage.includes('eligib')) {
      if (lowerMessage.includes('heart')) {
        reply = `Heart Donation Eligibility: ${knowledgeBase.eligibility.heart}. Requires brain death certification and cardiac evaluation.`;
      } else if (lowerMessage.includes('kidney')) {
        reply = `Kidney Donation Eligibility: ${knowledgeBase.eligibility.kidney}. Requires GFR ≥80 ml/min and BMI 18-35.`;
      } else if (lowerMessage.includes('eye') || lowerMessage.includes('cornea')) {
        reply = `Eye Donation Eligibility: ${knowledgeBase.eligibility.eye}. Most liberal criteria - all ages accepted.`;
      } else {
        reply = `Blood Donation Eligibility: ${knowledgeBase.eligibility.blood}. For organ donation, requirements vary by organ type.`;
      }
    } else if (lowerMessage.includes('how') && (lowerMessage.includes('donate') || lowerMessage.includes('register'))) {
      reply = 'To register: 1) Create an account, 2) Complete your profile with medical information, 3) Read and accept the SOP for your chosen donation type, 4) Submit the registration form. Our team will contact you for medical evaluation.';
    } else if (lowerMessage.includes('safe') || lowerMessage.includes('risk')) {
      reply = knowledgeBase.faqs.safety + ' All donations follow Standard Operating Procedures (SOP) with complete risk disclosure.';
    } else if (lowerMessage.includes('recover') || lowerMessage.includes('after')) {
      reply = knowledgeBase.faqs.recovery;
    } else if (lowerMessage.includes('sop') || lowerMessage.includes('procedure')) {
      reply = 'We have detailed Standard Operating Procedures (SOP) for each organ: Heart, Kidney, and Eye donation. These include eligibility criteria, evaluation process, surgical procedure, and post-donation care. You must read and accept the relevant SOP before registration.';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('emergency')) {
      reply = 'You can contact us through your dashboard. For emergencies, use the emergency contact feature. Hospital staff are available 24/7 for urgent requests.';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      reply = 'Hello! I can help you with information about blood and organ donation, eligibility criteria, registration process, and safety procedures. What would you like to know?';
    } else if (lowerMessage.includes('thank')) {
      reply = 'You\'re welcome! Feel free to ask if you have more questions about blood or organ donation.';
    } else {
      // Default response with suggestions
      reply = 'I can help you with:\n• Blood donation eligibility and process\n• Organ donation (Heart, Kidney, Eye) information\n• Registration and SOP requirements\n• Safety and recovery information\n• Medical evaluation process\n\nWhat would you like to know more about?';
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router;
