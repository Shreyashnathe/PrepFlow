import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Activity, Clock, LogOut, ChevronLeft } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        
        const res = await axios.get('http://localhost:8080/api/v1/attempts/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [navigate]);

  return (
    <div className="page-wrapper profile-wrapper animate-fade-in">
      <div className="profile-header-strip">
        <button className="btn-secondary" onClick={() => navigate('/home')}>
          <ChevronLeft size={18} /> Back to Hub
        </button>
        <button className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => {
            localStorage.clear();
            navigate('/');
        }}>
          <LogOut size={16} /> Secure Logout
        </button>
      </div>

      <div className="profile-hero">
        <div className="avatar-orb">
          <User size={40} color="var(--primary)" />
        </div>
        <div className="profile-info">
          <h1 className="text-header gradient-text">Candidate Dossier</h1>
          <p className="text-subtle">Review your historical assessment telemetry and pipeline scores.</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="glass-panel logs-panel">
          <div className="panel-heading">
            <Activity size={20} color="var(--accent)" />
            <h2>Assessment Log</h2>
          </div>
          
          {loading ? (
            <p className="text-subtle">Compiling historical logs...</p>
          ) : logs.length === 0 ? (
            <div className="empty-logs">
              <p className="text-subtle">No simulation telemetry recorded yet.</p>
              <button className="btn-primary" onClick={() => navigate('/home')} style={{marginTop: '1rem'}}>
                Start Pipeline
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="dark-table profile-table">
                <thead>
                  <tr>
                    <th>Target Company</th>
                    <th>Role Designation</th>
                    <th>Status</th>
                    <th>Final Score</th>
                    <th>Date Logged</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.attemptId}>
                      <td style={{fontWeight: 600, color: 'var(--text-main)'}}>{log.companyName}</td>
                      <td>{log.roleName}</td>
                      <td>
                        <span className={`status-badge ${log.status}`}>
                          {log.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span style={{color: log.totalScore > 60 ? 'var(--success)' : 'var(--warning)', fontWeight: 600}}>
                          {log.totalScore ? log.totalScore.toFixed(0) + '%' : 'Pending'}
                        </span>
                      </td>
                      <td className="text-subtle text-small">
                        {log.completedAt ? new Date(log.completedAt).toLocaleDateString() : new Date(log.startedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
