import React, { useState } from 'react';
import './SOPModal.css';

const SOPModal = ({ organType, onAccept, onDecline }) => {
  const [hasRead, setHasRead] = useState(false);

  const sopContent = {
    heart: {
      title: 'Heart Donation SOP',
      content: `
        <h3>Eligibility Criteria</h3>
        <ul>
          <li>Brain death certification required</li>
          <li>Age: 0-65 years</li>
          <li>No history of cardiac disease</li>
          <li>Negative for HIV, Hepatitis B/C</li>
        </ul>
        <h3>Procedure</h3>
        <ul>
          <li>Cardiac evaluation and testing</li>
          <li>Surgical retrieval within 4-6 hours</li>
          <li>Cold preservation during transport</li>
        </ul>
        <h3>Risks</h3>
        <p>This is a deceased donor program. Family consent required.</p>
      `
    },
    kidney: {
      title: 'Kidney Donation SOP',
      content: `
        <h3>Eligibility Criteria</h3>
        <ul>
          <li>Age: 18-65 years (living), 0-75 years (deceased)</li>
          <li>Normal kidney function (GFR >80)</li>
          <li>No diabetes, hypertension, or kidney disease</li>
          <li>BMI: 18-35</li>
        </ul>
        <h3>Evaluation Process (3 Phases)</h3>
        <ul>
          <li>Phase 1: Blood tests, imaging</li>
          <li>Phase 2: Psychological evaluation</li>
          <li>Phase 3: Final medical clearance</li>
        </ul>
        <h3>Surgical Risks</h3>
        <ul>
          <li>Bleeding, infection (1-2%)</li>
          <li>Blood clots (0.5%)</li>
          <li>Hernia (1-2%)</li>
          <li>Recovery: 4-6 weeks</li>
        </ul>
        <h3>Post-Donation Care</h3>
        <p>Lifelong follow-up required. Annual kidney function tests.</p>
      `
    },
    eye: {
      title: 'Eye (Cornea) Donation SOP',
      content: `
        <h3>Eligibility Criteria</h3>
        <ul>
          <li>All ages eligible</li>
          <li>Retrieval within 6-8 hours of death</li>
          <li>No eye infections or diseases</li>
          <li>Previous eye surgery not a contraindication</li>
        </ul>
        <h3>Procedure</h3>
        <ul>
          <li>Cornea retrieval (30-45 minutes)</li>
          <li>Preservation in storage medium</li>
          <li>Viable for 14 days</li>
        </ul>
        <h3>Impact</h3>
        <p>One donor can restore sight to two people.</p>
      `
    }
  };

  const sop = sopContent[organType] || sopContent.kidney;

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) setHasRead(true);
  };

  return (
    <div className="sop-modal-overlay">
      <div className="sop-modal">
        <h2>{sop.title}</h2>
        <div className="sop-content" onScroll={handleScroll}>
          <div dangerouslySetInnerHTML={{ __html: sop.content }} />
          <p className="scroll-instruction">
            {!hasRead && '⬇️ Please scroll to the bottom to continue'}
          </p>
        </div>
        <div className="sop-actions">
          <button 
            className="btn-accept" 
            onClick={onAccept}
            disabled={!hasRead}
          >
            I Accept
          </button>
          <button className="btn-decline" onClick={onDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOPModal;
