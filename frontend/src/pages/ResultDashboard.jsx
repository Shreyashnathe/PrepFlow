import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReport } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Award, Briefcase, ChevronLeft, Target, AlertTriangle } from 'lucide-react';

const ResultDashboard = () => {
  const navigate = useNavigate();
  const { attemptId, selectedCompany, selectedRole } = useAppContext();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) {
      navigate('/');
      return;
    }
    loadReport();
  }, [attemptId]);

  const loadReport = async () => {
    try {
      const res = await fetchReport(attemptId);
      setReport(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Generating Comprehensive Report...</div>;
  if (!report) return <div style={styles.loading}>Error loading report.</div>;

  const getReadinessColor = (level) => {
    if (level === 'READY') return 'var(--success)';
    if (level === 'ALMOST READY') return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel animate-fade-in" style={styles.dashboard}>
        
        <div style={styles.header}>
          <div>
            <h1 className="gradient-text" style={styles.title}>Candidate Execution Report</h1>
            <p style={styles.subtitle}>
              <Briefcase size={16} /> {selectedCompany?.name} - {selectedRole?.name} Pipeline
            </p>
          </div>
          <div style={{...styles.readinessBadge, borderColor: getReadinessColor(report.readinessLevel)}}>
            <Target size={20} color={getReadinessColor(report.readinessLevel)} />
            <span style={{color: getReadinessColor(report.readinessLevel), fontWeight: 'bold'}}>
              {report.readinessLevel}
            </span>
          </div>
        </div>

        <div style={styles.scoreOverview}>
          <div style={styles.scoreCard}>
            <div style={styles.scoreRingWrapper}>
              <svg viewBox="0 0 160 160" width="160" height="160">
                {/* Background track */}
                <circle cx="80" cy="80" r="70" fill="none" stroke="var(--bg-card-hover)" strokeWidth="12" />
                {/* Score Fill */}
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  fill="none" 
                  stroke="var(--primary)" 
                  strokeWidth="12" 
                  strokeDasharray="439.8" 
                  strokeDashoffset={439.8 - (439.8 * (Math.round(report.totalScore) / 100))}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div style={styles.mainScoreText}>{Math.round(report.totalScore)}%</div>
            </div>
            <p style={{marginTop: '1.5rem', color: 'var(--text-muted)'}}>Overall Assessment Score</p>
          </div>

          <div style={styles.roundsMatrix}>
            <h3 style={{marginBottom: '1rem', borderBottom: '1px solid var(--bg-card-hover)', paddingBottom: '0.5rem'}}>
              Round Breakdown
            </h3>
            <div style={styles.matrixGrid}>
              {Object.entries(report.roundScores).map(([roundName, score]) => (
                <div key={roundName} style={styles.matrixItem}>
                  <span style={styles.roundName}>{roundName.replace('_', ' ')}</span>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill, 
                        width: `${score}%`, 
                        background: score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)'
                      }} 
                    />
                  </div>
                  <span style={styles.scoreText}>{Math.round(score)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.feedbackSection}>
          <div style={styles.feedbackHeader}>
            <AlertTriangle size={20} color="var(--accent)" />
            <h3>Actionable Feedback</h3>
          </div>
          <p style={styles.feedbackText}>{report.overallFeedback}</p>
        </div>

        <div style={styles.actions}>
          <button className="btn-primary" style={styles.homeBtn} onClick={() => navigate('/')}>
            <ChevronLeft size={18} /> Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '3rem 1rem',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem',
    color: 'var(--primary)',
  },
  dashboard: {
    padding: '3rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-muted)',
    fontSize: '1.2rem',
  },
  readinessBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.8rem 1.5rem',
    border: '2px solid',
    borderRadius: '30px',
    background: 'rgba(0,0,0,0.3)',
  },
  scoreOverview: {
    display: 'flex',
    gap: '3rem',
    marginBottom: '3rem',
  },
  scoreCard: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'var(--bg-dark)',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--bg-card-hover)',
  },
  scoreRingWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainScoreText: {
    position: 'absolute',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  roundsMatrix: {
    flex: '2',
    background: 'var(--bg-dark)',
    padding: '2rem',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--bg-card-hover)',
  },
  matrixGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  matrixItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  roundName: {
    flex: '1',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-muted)',
  },
  progressBar: {
    flex: '3',
    height: '12px',
    background: 'var(--bg-card-hover)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 1s ease-out',
  },
  scoreText: {
    width: '40px',
    textAlign: 'right',
    fontWeight: '600',
  },
  feedbackSection: {
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    padding: '2rem',
    borderRadius: 'var(--border-radius)',
    marginBottom: '3rem',
  },
  feedbackHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '1rem',
    color: 'var(--accent)',
  },
  feedbackText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#e2e8f0',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
  },
  homeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'var(--bg-card-hover)',
    padding: '1rem 2rem',
  }
};

export default ResultDashboard;
