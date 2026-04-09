import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './RoundStyles.css';

const AptitudeRound = ({ questions, onSubmit, roundType }) => {
  const [answers, setAnswers] = useState({});
  const [activeIdx, setActiveIdx] = useState(0);

  const handleSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleNext = () => {
    if (activeIdx < questions.length - 1) {
      setActiveIdx(prev => prev + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) setActiveIdx(prev => prev - 1);
  };

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[activeIdx];
  const optionsArray = JSON.parse(currentQ.options || "[]");

  return (
    <div className="round-container animate-fade-in">
      <div className="round-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 className="text-header" style={{ fontSize: '1.8rem' }}>
            {roundType === 'TECHNICAL_INTERVIEW' ? 'Technical Concepts' : 'Aptitude & Logic'}
          </h2>
          <p className="text-subtle">
            Select the most logical answer below. Your progress dynamically syncs with the engine.
          </p>
        </div>
        <div className="text-subtle" style={{ fontWeight: 600 }}>
          Question {activeIdx + 1} of {questions.length}
        </div>
      </div>

      <div className="question-list">
        <div className="glass-panel q-card animate-fade-in" key={currentQ.id}>
          <h3 className="q-text">
            <span className="q-num">Q{activeIdx + 1}.</span> {currentQ.questionText}
          </h3>
          
          <div className="options-grid">
            {optionsArray.length > 0 ? (
              optionsArray.map((opt, i) => (
                <div 
                  key={i} 
                  className={`option-box ${answers[currentQ.id] === opt ? 'selected' : ''}`}
                  onClick={() => handleSelect(currentQ.id, opt)}
                >
                  <div className={`radio-indicator ${answers[currentQ.id] === opt ? 'selected' : ''}`} />
                  <span className="option-text">{opt}</span>
                </div>
              ))
            ) : (
              <textarea 
                className="input-base text-area-large"
                placeholder="Provide your exact technical reasoning here..."
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleSelect(currentQ.id, e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="round-footer" style={{ justifyContent: 'space-between' }}>
        <button 
          className="btn-secondary" 
          onClick={handlePrev} 
          style={{ visibility: activeIdx === 0 ? 'hidden' : 'visible' }}
        >
          <ChevronLeft size={18} /> Previous
        </button>
        <button className="btn-primary" onClick={handleNext}>
          {activeIdx < questions.length - 1 ? 'Next Question' : 'Submit Module'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default AptitudeRound;
