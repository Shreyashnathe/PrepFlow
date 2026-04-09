import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { Trophy, Clock, Target, Home } from 'lucide-react';
import './ResultDashboard.css';

const ResultDashboard = () => {
  const navigate = useNavigate();
  const { attemptId } = useAppContext();
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!attemptId) {
      navigate('/');
      return;
    }
    
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/api/v1/attempts/${attemptId}/report`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchReport();
  }, [attemptId, navigate]);

  if (!report) {
    return (
      <div className="sim-loading-screen">
        <p className="text-subtle">Compiling Analytics Data...</p>
      </div>
    );
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const totalScore = report.totalScore || 0;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  const roundScoresArray = report.roundScores ? Object.entries(report.roundScores) : [];

  return (
    <div className="page-wrapper dashboard-wrapper animate-fade-in">
      
      {/* Top Navigation */}
      <div className="dash-nav">
        <h1 className="text-header gradient-text">Simulation Telemetry</h1>
        <button className="btn-secondary" onClick={() => navigate('/home')}>
          <Home size={16} /> Return Home
        </button>
      </div>

      <div className="dash-grid">
        
        {/* Main Score Widget */}
        <div className="glass-panel main-score-widget fade-up" style={{animationDelay: '0.1s'}}>
          <div className="score-svg-wrapper">
            <svg 
              className="progress-svg"
              width="180" 
              height="180" 
              viewBox="0 0 180 180"
            >
              <circle
                className="progress-bg"
                cx="90" cy="90" r={radius}
                strokeWidth="12"
              />
              <circle
                className="progress-bar"
                cx="90" cy="90" r={radius}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
              />
            </svg>
            <div className="score-text-inner">
              <span className="score-big">{totalScore.toFixed(0)}</span>
              <span className="score-small">%</span>
            </div>
          </div>
          
          <div className="score-info">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pipeline Status: <span style={{ color: totalScore > 60 ? 'var(--success)' : 'var(--warning)' }}>{report.readinessLevel || 'UNKNOWN'}</span></h2>
            <p className="text-subtle">
              Based on the standard cumulative average of {roundScoresArray.length} technical assignments.
            </p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="global-stats-container fade-up" style={{animationDelay: '0.2s'}}>
          <div className="glass-panel stat-card">
            <div className="stat-icon"><Trophy size={20} color="var(--primary)" /></div>
            <div>
              <p className="text-subtle">Report Assessment Focus</p>
              <p className="stat-val" style={{fontSize: '1rem', marginTop: '0.5rem', fontWeight: 500}}>{report.overallFeedback || "Completion metric recorded."}</p>
            </div>
          </div>
        </div>

        {/* Round Breakdown Table */}
        <div className="glass-panel table-widget fade-up" style={{animationDelay: '0.3s'}}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Modular Breakdown</h2>
          <div className="table-responsive">
            <table className="dark-table">
              <thead>
                <tr>
                  <th>Assessment Module</th>
                  <th>Score Precision</th>
                </tr>
              </thead>
              <tbody>
                {roundScoresArray.map(([moduleName, score], idx) => (
                  <tr key={idx}>
                    <td><span className="round-badge">{moduleName.replace('_', ' ')}</span></td>
                    <td>
                      <div className="mini-progress-wrapper">
                        <div className="mini-progress-fill" style={{ width: `${score}%`, background: score > 70 ? 'var(--success)' : 'var(--warning)' }} />
                      </div>
                      <span style={{fontSize: '0.8rem', marginLeft: '0.5rem'}}>{score.toFixed(0)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultDashboard;
