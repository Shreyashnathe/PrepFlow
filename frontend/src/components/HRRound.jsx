import React, { useState } from 'react';
import { Camera, Mic, ChevronRight } from 'lucide-react';

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
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.videoSection}>
        <div style={styles.simulatedInterviewer}>
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Interviewer" 
            style={styles.interviewerImg}
          />
          <div style={styles.personTag}>HR Manager</div>
        </div>
        
        <div style={styles.simulatedUser}>
          <div style={styles.cameraPlaceholder}>
            <Camera size={32} color="var(--text-muted)" />
            <span>Camera Active</span>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={styles.qPanel}>
        <div style={styles.badge}>Behavioral Interview</div>
        <h2 style={styles.qText}>"{activeQuestion?.questionText}"</h2>
        
        <div style={styles.inputArea}>
          <Mic size={20} color="var(--primary)" style={{ marginTop: '10px' }} />
          <textarea 
            style={styles.textArea}
            placeholder="Type your structured answer here (Try to use STAR method)..."
            value={answers[activeQuestion?.id] || ''}
            onChange={(e) => setAnswers(prev => ({...prev, [activeQuestion?.id]: e.target.value}))}
          />
        </div>

        <div style={styles.footer}>
          <span>Question {activeQIdx + 1} of {questions.length}</span>
          <button className="btn-primary" style={styles.submitBtn} onClick={handleNext}>
            {activeQIdx < questions.length - 1 ? 'Next Question' : 'Finish Interview'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '0 1rem',
    gap: '2rem',
  },
  videoSection: {
    display: 'flex',
    gap: '2rem',
    height: '40%',
  },
  simulatedInterviewer: {
    flex: '2',
    background: '#000',
    borderRadius: 'var(--border-radius)',
    overflow: 'hidden',
    position: 'relative',
  },
  interviewerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: '0.8',
  },
  personTag: {
    position: 'absolute',
    bottom: '1rem',
    left: '1rem',
    background: 'rgba(0,0,0,0.6)',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  simulatedUser: {
    flex: '1',
    background: '#1a1a1a',
    borderRadius: 'var(--border-radius)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    border: '1px solid #333',
  },
  cameraPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  qPanel: {
    padding: '2.5rem',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  badge: {
    background: 'rgba(139, 92, 246, 0.2)',
    color: 'var(--accent)',
    padding: '0.3rem 1rem',
    borderRadius: '20px',
    display: 'inline-block',
    width: 'max-content',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  qText: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '2rem',
    color: '#fff',
  },
  inputArea: {
    display: 'flex',
    gap: '1rem',
    flex: '1',
  },
  textArea: {
    flex: '1',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--bg-card-hover)',
    color: 'var(--text-main)',
    padding: '1.2rem',
    borderRadius: 'var(--border-radius)',
    fontFamily: 'inherit',
    fontSize: '1.1rem',
    resize: 'none',
    outline: 'none',
    transition: 'var(--transition)',
    lineHeight: '1.5',
  },
  footer: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'var(--text-muted)',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }
};

export default HRRound;
