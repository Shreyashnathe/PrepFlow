import React, { useState } from 'react';
import { Camera, Mic, ChevronRight } from 'lucide-react';
import './RoundStyles.css';

const HRRound = ({ questions, onSubmit }) => {
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const activeQuestion = questions[activeQIdx];

  const handleNext = () => {
    if (activeQIdx < questions.length - 1) {
      setActiveQIdx(curr => curr + 1);
    } else {
      onSubmit(answers);
    }
  };

  return (
    <div className="round-container hr-layout animate-fade-in">
      <div className="video-section">
        <div className="simulated-interviewer">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Interviewer" 
            className="interviewer-img"
          />
          <div className="person-tag">Recruiter Link</div>
        </div>
        
        <div className="simulated-user">
          <div className="camera-placeholder">
            <Camera size={32} color="var(--text-muted)" />
            <span>Camera Active Link</span>
          </div>
        </div>
      </div>

      <div className="glass-panel q-panel">
        <div className="behavioral-badge">Behavioral Interview</div>
        <h2 className="behavioral-q-text">"{activeQuestion?.questionText}"</h2>
        
        <div className="input-area">
          <Mic size={20} color="var(--primary)" style={{ marginTop: '14px' }} />
          <textarea 
            className="input-base hr-textarea"
            placeholder="Type your structured answer here (Try to use the STAR method)..."
            value={answers[activeQuestion?.id] || ''}
            onChange={(e) => setAnswers(prev => ({...prev, [activeQuestion?.id]: e.target.value}))}
          />
        </div>

        <div className="hr-footer">
          <span className="text-subtle">Question {activeQIdx + 1} of {questions.length}</span>
          <button className="btn-primary" onClick={handleNext}>
            {activeQIdx < questions.length - 1 ? 'Next Question' : 'Finish Interview'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRRound;
