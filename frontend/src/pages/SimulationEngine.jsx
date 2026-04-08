import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSimulationFlow, fetchQuestionsForRound, submitRound } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Clock, CheckCircle } from 'lucide-react';
import AptitudeRound from '../components/AptitudeRound';
import CodingRound from '../components/CodingRound';
import HRRound from '../components/HRRound';

const SimulationEngine = () => {
  const navigate = useNavigate();
  const { selectedRole, attemptId, simulationFlow, setSimulationFlow } = useAppContext();
  
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes default

  useEffect(() => {
    if (!selectedRole || !attemptId) {
      navigate('/');
      return;
    }
    loadFlow();
  }, []);

  const loadFlow = async () => {
    try {
      const res = await fetchSimulationFlow(selectedRole.id);
      setSimulationFlow(res.data);
      if (res.data.length > 0) {
        await loadQuestions(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadQuestions = async (roundId) => {
    setLoading(true);
    try {
      const res = await fetchQuestionsForRound(roundId);
      setQuestions(res.data);
      // reset timer based on round type if needed (e.g., coding gets 45 mins)
      setTimeLeft(1800);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleRoundSubmit = async (answers) => {
    const currentRound = simulationFlow[currentRoundIndex];
    try {
      await submitRound(attemptId, currentRound.id, answers);
      
      if (currentRoundIndex < simulationFlow.length - 1) {
        // Move to next round
        const nextIndex = currentRoundIndex + 1;
        setCurrentRoundIndex(nextIndex);
        await loadQuestions(simulationFlow[nextIndex].id);
      } else {
        // Finished all rounds
        navigate('/result');
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit round");
    }
  };

  if (!simulationFlow.length || loading) {
    return <div style={styles.loading}>Loading Engine...</div>;
  }

  const currentRound = simulationFlow[currentRoundIndex];

  return (
    <div style={styles.container}>
      {/* Top Navigation Wrapper */}
      <div className="glass-panel" style={styles.header}>
        <div style={styles.stepper}>
          {simulationFlow.map((round, idx) => (
            <div 
              key={round.id} 
              style={{
                ...styles.stepIndicator,
                color: idx === currentRoundIndex ? 'var(--primary)' : idx < currentRoundIndex ? 'var(--success)' : 'var(--text-muted)'
              }}
            >
              {idx < currentRoundIndex ? <CheckCircle size={20} /> : <div style={styles.stepCircle}>{idx + 1}</div>}
              <span>{round.roundType}</span>
              {idx < simulationFlow.length - 1 && <div style={styles.stepLine} />}
            </div>
          ))}
        </div>
        
        <div style={styles.timerContainer}>
          <Clock size={20} color={timeLeft < 300 ? 'var(--danger)' : 'var(--warning)'} />
          <span style={{...styles.timerText, color: timeLeft < 300 ? 'var(--danger)' : 'white'}}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Dynamic Module Loader */}
      <div style={styles.moduleWrapper}>
        {(currentRound.roundType === 'APTITUDE' || currentRound.roundType === 'TECHNICAL_INTERVIEW') && (
          <AptitudeRound questions={questions} onSubmit={handleRoundSubmit} roundType={currentRound.roundType} />
        )}
        {currentRound.roundType === 'CODING' && (
          <CodingRound questions={questions} onSubmit={handleRoundSubmit} />
        )}
        {currentRound.roundType === 'HR_INTERVIEW' && (
          <HRRound questions={questions} onSubmit={handleRoundSubmit} />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem',
    color: 'var(--primary)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    marginBottom: '2rem',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  stepCircle: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid currentColor',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
  },
  stepLine: {
    width: '30px',
    height: '2px',
    backgroundColor: 'var(--bg-card-hover)',
    marginLeft: '0.5rem',
  },
  timerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(0,0,0,0.3)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
  },
  timerText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    fontVariantNumeric: 'tabular-nums',
  },
  moduleWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }
};

export default SimulationEngine;
