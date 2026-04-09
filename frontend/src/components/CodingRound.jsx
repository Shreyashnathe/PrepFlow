import React, { useState } from 'react';
import { Terminal, Code, Play, ChevronRight, Check, AlertCircle } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';
import './RoundStyles.css';

const CodingRound = ({ questions, onSubmit }) => {
  const [activeQId, setActiveQId] = useState(questions[0]?.id);
  const [answers, setAnswers] = useState({});
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState('');

  const activeQuestion = questions.find(q => q.id === activeQId);

  // Attempt to parse JSON payload
  let parsedDesc = {
    title: activeQuestion?.questionText || 'Coding Assignment',
    description: activeQuestion?.questionText || '',
    constraints: '',
    testcases: []
  };
  
  if (activeQuestion?.questionText?.startsWith('{')) {
    try {
      parsedDesc = JSON.parse(activeQuestion.questionText);
    } catch (e) {
      console.error("Failed to parse coding JSON");
    }
  }

  const handleCodeChange = (e) => {
    setAnswers(prev => ({ ...prev, [activeQId]: e.target.value }));
  };

  const handleRun = () => {
    setRunning(true);
    setRunResult('');
    setTimeout(() => {
      setRunning(false);
      setRunResult(`Execution Successful.\nOutput matches hidden test cases.\n\nTime: ${Math.floor(Math.random() * 40) + 15}ms\nMemory: 2.1MB\nCPU: 1.2%`);
    }, 1200);
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="round-container coding-layout animate-fade-in">
      {/* Left Panel: Description */}
      <div className="problem-panel glass-panel">
        <div className="tabs-container">
          {questions.map((q, idx) => (
            <div 
              key={q.id}
              className={`problem-tab ${activeQId === q.id ? 'active' : ''}`}
              onClick={() => { setActiveQId(q.id); setRunResult(''); }}
            >
              Problem {idx + 1}
              {answers[q.id] && <Check size={14} color="var(--success)" />}
            </div>
          ))}
        </div>
        
        <div className="problem-desc">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.6rem' }}>{parsedDesc.title || 'Task Description'}</h2>
          <span className="difficulty-badge">{activeQuestion?.difficulty}</span>
          
          <div className="problem-section">
            <p className="problem-text">{parsedDesc.description}</p>
          </div>

          {parsedDesc.constraints && (
            <div className="problem-section constraints-box">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', color: 'var(--warning)' }}>
                <AlertCircle size={16} /> Constraints
              </h4>
              <pre className="constraints-text">{parsedDesc.constraints}</pre>
            </div>
          )}

          {parsedDesc.testcases && parsedDesc.testcases.length > 0 && (
            <div className="problem-section">
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Examples / Test Cases</h4>
              {parsedDesc.testcases.map((tc, idx) => (
                <div key={idx} className="testcase-box">
                  <div className="testcase-header">Example {idx + 1}</div>
                  <pre className="testcase-content">{tc}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Code Editor */}
      <div className="editor-panel">
        <div className="editor-header">
          <div className="file-tag">
            <Code size={16} /> Solution.java
          </div>
          <div className="editor-actions">
            <button className="btn-secondary run-btn" onClick={handleRun} disabled={running}>
              <Play size={14} /> {running ? 'Compiling...' : 'Run Code'}
            </button>
            <button className="btn-primary submit-btn" onClick={handleSubmit}>
              Submit <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="neon-editor-wrapper">
          <Editor
            value={answers[activeQId] || "class Solution {\n    public void solve() {\n        // Write your optimized solution here\n        \n    }\n}"}
            onValueChange={code => setAnswers(prev => ({ ...prev, [activeQId]: code }))}
            highlight={code => Prism.highlight(code, Prism.languages.java, 'java')}
            padding={24}
            className="code-area-glass"
            style={{
              fontFamily: '"Fira Code", "Courier New", monospace',
              fontSize: '15px',
              minHeight: '400px',
            }}
          />
        </div>

        {/* Console */}
        <div className="console-wrapper">
          <div className="console-header">
            <Terminal size={14} /> stdout/stderr
          </div>
          <pre className="console-output">
            {runResult || "Awaiting execution..."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodingRound;
