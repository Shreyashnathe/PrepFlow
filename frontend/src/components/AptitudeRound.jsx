import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const AptitudeRound = ({ questions, onSubmit, roundType }) => {
  const [answers, setAnswers] = useState({});

  const handleSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{roundType === 'TECHNICAL_INTERVIEW' ? 'Technical Concepts' : 'Aptitude & Logic'}</h2>
        <p style={{color: 'var(--text-muted)'}}>Answer all questions below. Your progress is saved automatically.</p>
      </div>

      <div style={styles.questionList}>
        {questions.map((q, idx) => {
          const optionsArray = JSON.parse(q.options || "[]");
          return (
            <div key={q.id} className="glass-panel" style={styles.qCard}>
              <h3 style={styles.qText}>
                <span style={styles.qNum}>Q{idx + 1}.</span> {q.questionText}
              </h3>
              
              <div style={styles.optionsGrid}>
                {optionsArray.length > 0 ? (
                  optionsArray.map((opt, i) => (
                    <div 
                      key={i} 
                      style={{
                        ...styles.option,
                        ...(answers[q.id] === opt ? styles.optionSelected : {})
                      }}
                      onClick={() => handleSelect(q.id, opt)}
                    >
                      <div style={{
                        ...styles.radio,
                        ...(answers[q.id] === opt ? styles.radioSelected : {})
                      }} />
                      {opt}
                    </div>
                  ))
                ) : (
                  // For technical questions that might be text-input instead of multiple choice
                  <textarea 
                    style={styles.textArea}
                    placeholder="Type your answer here..."
                    value={answers[q.id] || ''}
                    onChange={(e) => handleSelect(q.id, e.target.value)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.footer}>
        <button className="btn-primary" style={styles.submitBtn} onClick={handleSubmit}>
          Submit Round <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    padding: '0 1rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  questionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  qCard: {
    padding: '2rem',
  },
  qText: {
    fontSize: '1.2rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
    lineHeight: '1.5',
  },
  qNum: {
    color: 'var(--primary)',
    marginRight: '0.5rem',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'var(--bg-dark)',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'var(--transition)',
  },
  optionSelected: {
    borderColor: 'var(--primary)',
    background: 'rgba(59, 130, 246, 0.1)',
  },
  radio: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: 'var(--primary)',
    background: 'var(--primary)',
    boxShadow: 'inset 0 0 0 4px var(--bg-dark)',
  },
  textArea: {
    width: '100%',
    height: '100px',
    background: 'var(--bg-dark)',
    border: '1px solid var(--bg-card-hover)',
    color: 'var(--text-main)',
    padding: '1rem',
    borderRadius: '8px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  footer: {
    marginTop: '3rem',
    padding: '2rem 0',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }
};

export default AptitudeRound;
