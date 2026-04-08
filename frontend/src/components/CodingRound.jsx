import React, { useState } from 'react';
import { Terminal, Code, Play, ChevronRight, Check } from 'lucide-react';

const CodingRound = ({ questions, onSubmit }) => {
  const [activeQId, setActiveQId] = useState(questions[0]?.id);
  const [answers, setAnswers] = useState({});
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState('');

  const activeQuestion = questions.find(q => q.id === activeQId);

  const handleCodeChange = (e) => {
    setAnswers(prev => ({ ...prev, [activeQId]: e.target.value }));
  };

  const handleRun = () => {
    setRunning(true);
    setRunResult('');
    // Mock run delay
    setTimeout(() => {
      setRunning(false);
      setRunResult(`Execution Successful.\nOutput matches test cases.\n\nTime: 45ms\nMemory: 2.1MB`);
    }, 1500);
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Left Panel: Description */}
      <div style={styles.problemPanel}>
        <div style={styles.tabsContainer}>
          {questions.map((q, idx) => (
            <div 
              key={q.id}
              style={{
                ...styles.tab,
                ...(activeQId === q.id ? styles.tabActive : {})
              }}
              onClick={() => { setActiveQId(q.id); setRunResult(''); }}
            >
              Problem {idx + 1}
              {answers[q.id] && <Check size={14} color="var(--success)" />}
            </div>
          ))}
        </div>
        
        <div style={styles.problemDesc}>
          <h2 style={{ marginBottom: '1rem' }}>Problem Description</h2>
          <span style={styles.difficultyBadge}>{activeQuestion?.difficulty}</span>
          <p style={{ marginTop: '1.5rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
            {activeQuestion?.questionText}
          </p>
        </div>
      </div>

      {/* Right Panel: Code Editor */}
      <div style={styles.editorPanel}>
        <div style={styles.editorHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Code size={18} />
            <span style={{ fontSize: '0.9rem' }}>Main.java</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={styles.runBtn} onClick={handleRun} disabled={running}>
              <Play size={14} /> {running ? 'Running...' : 'Run Code'}
            </button>
            <button className="btn-primary" style={styles.submitBtn} onClick={handleSubmit}>
              Submit <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <textarea 
          style={styles.codeArea} 
          spellCheck="false"
          value={answers[activeQId] || "public class Main {\n    public static void main(String[] args) {\n        // write your code here\n        \n    }\n}"}
          onChange={handleCodeChange}
        />

        {/* Console */}
        <div style={styles.consoleWrapper}>
          <div style={styles.consoleHeader}>
            <Terminal size={14} /> Console
          </div>
          <pre style={styles.consoleOutput}>
            {runResult || "Ready."}
          </pre>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    gap: '1rem',
    paddingBottom: '1rem',
  },
  problemPanel: {
    flex: '1',
    background: 'var(--bg-card)',
    borderRadius: 'var(--border-radius)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabsContainer: {
    display: 'flex',
    background: 'var(--bg-dark)',
    borderBottom: '1px solid var(--bg-card-hover)',
  },
  tab: {
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-muted)',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: 'var(--primary)',
    borderBottomColor: 'var(--primary)',
    background: 'var(--bg-card)',
  },
  problemDesc: {
    padding: '2rem',
    overflowY: 'auto',
  },
  difficultyBadge: {
    background: 'rgba(245, 158, 11, 0.2)',
    color: 'var(--warning)',
    padding: '0.2rem 0.8rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  editorPanel: {
    flex: '1.5',
    display: 'flex',
    flexDirection: 'column',
    background: '#1e1e1e', // standard dark editor color
    borderRadius: 'var(--border-radius)',
    overflow: 'hidden',
  },
  editorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 1.5rem',
    background: '#252526',
    borderBottom: '1px solid #3c3c3c',
  },
  codeArea: {
    flex: '1',
    background: '#1e1e1e',
    color: '#d4d4d4',
    border: 'none',
    padding: '1.5rem',
    fontFamily: '"Fira Code", monospace',
    fontSize: '1rem',
    resize: 'none',
    outline: 'none',
    lineHeight: '1.5',
  },
  consoleWrapper: {
    height: '200px',
    background: '#111',
    borderTop: '1px solid #3c3c3c',
    display: 'flex',
    flexDirection: 'column',
  },
  consoleHeader: {
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#1a1a1a',
  },
  consoleOutput: {
    padding: '1rem',
    color: '#10b981',
    fontFamily: 'monospace',
    overflowY: 'auto',
    margin: 0,
  },
  runBtn: {
    background: '#3c3c3c',
    color: '#fff',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
  submitBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  }
};

export default CodingRound;
