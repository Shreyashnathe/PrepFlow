import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompanies, fetchRoles, startSimulation } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Briefcase, ChevronRight, Building, LogOut, User } from 'lucide-react';
import './CompanySelection.css';

const CompanySelection = () => {
  const navigate = useNavigate();
  const { setSelectedCompany, setSelectedRole, setAttemptId, userName, logoutUser } = useAppContext();
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    fetchCompanies().then(res => {
      setCompanies(res.data);
      setLoadingConfig(false);
    }).catch(e => {
      console.error(e);
      setLoadingConfig(false);
    });
  }, []);

  const handleQuickStart = async (company) => {
    setLoading(true);
    setSelectedCompany(company);
    try {
      const roleRes = await fetchRoles(company.id);
      if (roleRes.data && roleRes.data.length > 0) {
        const targetRole = roleRes.data[0];
        setSelectedRole(targetRole);
        const simRes = await startSimulation(targetRole.id);
        setAttemptId(simRes.data);
        navigate('/simulate');
      } else {
        alert("No deployment roles configured for this architecture.");
      }
    } catch (e) {
      console.error(e);
      alert("Error starting simulation. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="page-wrapper">
      <div className="top-nav">
        <div className="welcome-tag">
          <span className="text-subtle">Welcome back,</span>
          <span style={{fontWeight: 600, color: 'var(--text-main)', marginLeft: '6px'}}>{userName || 'Candidate'}</span>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button className="btn-secondary" onClick={() => navigate('/profile')}>
            <User size={16} /> My Dossier
          </button>
          <button className="btn-secondary nav-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="hero-section animate-fade-in">
        <h1 className="text-header gradient-text" style={{marginBottom: '0.5rem'}}>PrepFlow Intelligence</h1>
        <p className="text-subtle" style={{fontSize: '1.1rem'}}>Select your target company pipeline to begin the precise technical assessment.</p>
      </div>

      <div className="cs-content">
        <div className="cs-header-wrap">
          <h2 className="cs-section-title">1. Target Architecture</h2>
        </div>
        
        {loadingConfig ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
            <p className="text-subtle">Establishing connection to datacenters...</p>
          </div>
        ) : (
          <div className="bento-grid animate-fade-in" style={{animationDelay: '0.1s'}}>
            {companies.map(company => (
              <div key={company.id} className="glass-panel bento-card">
                <div className="bento-icon">
                  <Building size={24} color="var(--primary)" />
                </div>
                <h3 className="bento-title">{company.name}</h3>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className="bento-desc" style={{ fontSize: '0.8rem', margin: 0 }}>Full Pipeline</p>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px' }}
                    onClick={(e) => { e.stopPropagation(); handleQuickStart(company); }}
                    disabled={loading}
                  >
                    Deploy <ChevronRight size={14} style={{ marginLeft: '2px' }}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default CompanySelection;
