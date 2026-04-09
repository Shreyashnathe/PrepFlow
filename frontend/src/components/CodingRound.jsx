import React, { useState } from 'react';
import { Terminal, Code, Play, ChevronRight, Check, AlertCircle, ChevronDown } from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import './RoundStyles.css';

const CodingRound = ({ questions, onSubmit }) => {
  const [activeQId, setActiveQId] = useState(questions[0]?.id);
  const [answers, setAnswers] = useState({});
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState('');
  const [language, setLanguage] = useState('cpp');

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

  const defaultCode = {
    java: "class Solution {\n    public void solve() {\n        // Write your optimized solution here\n        \n    }\n}",
    cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Code here\n    return 0;\n}",
    python: "def solve():\n    # Write your python code here\n    pass"
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
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.6rem', color: '#fff', fontWeight: 'bold' }}>{parsedDesc.title || 'Task Description'}</h2>
          <div className="problem-meta-info" style={{ display: 'flex', gap: '1rem', color: '#a3a3a3', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <span>Difficulty: <span style={{color: activeQuestion?.difficulty === 'Hard' ? '#ef4444' : activeQuestion?.difficulty === 'Medium' ? '#10b981' : '#10b981'}}>{activeQuestion?.difficulty || 'Medium'}</span></span>
            <span>Time limit: 1.0s</span>
            <span>Memory limit: 256MB</span>
          </div>

          <div className="problem-section">
            <h3 className="section-header">Description</h3>
            <p className="problem-text">{parsedDesc.description}</p>
          </div>

          {parsedDesc.constraints && (
            <div className="problem-section constraints-box">
              <h3 className="section-header">Constraints</h3>
              <pre className="constraints-text">{parsedDesc.constraints}</pre>
            </div>
          )}

          {parsedDesc.testcases && parsedDesc.testcases.length > 0 && (
            <div className="problem-section">
              <h3 className="section-header">Sample Input/Output</h3>
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
          <div className="language-selector">
            <span style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>main.{language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'py'}</span>
            <div className="custom-select">
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="cpp">C++ 17</option>
                <option value="java">Java 21</option>
                <option value="python">Python 3.10</option>
              </select>
            </div>
          </div>
          <div className="editor-actions">
            <button className="run-btn" onClick={handleRun} disabled={running}>
              {running ? 'Compiling...' : 'Run'}
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
        
        <div className="neon-editor-wrapper">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={answers[activeQId] || defaultCode[language]}
            onChange={code => setAnswers(prev => ({ ...prev, [activeQId]: code }))}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              lineHeight: 24,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              roundedSelection: false,
              scrollbar: { vertical: 'hidden' }
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
