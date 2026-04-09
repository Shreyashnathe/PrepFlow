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

  const handleCompanySelect = async (company) => {
    setActiveCompany(company);
    setSelectedCompany(company);
    try {
      const res = await fetchRoles(company.id);
      setRoles(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartProcess = async (role) => {
    setLoading(true);
    setSelectedRole(role);
    try {
      const res = await startSimulation(role.id);
      setAttemptId(res.data);
      navigate('/simulate');
    } catch (e) {
      console.error(e);
      alert("Error starting simulation. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
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
              <div 
                key={company.id} 
                className={`glass-panel bento-card ${activeCompany?.id === company.id ? 'active' : ''}`}
                onClick={() => handleCompanySelect(company)}
              >
                <div className="bento-icon">
                  <Building size={28} color={activeCompany?.id === company.id ? '#60a5fa' : 'var(--text-muted)'} />
                </div>
                <h3 className="bento-title">{company.name}</h3>
                <p className="bento-desc">Full Simulation Pipeline</p>
              </div>
            ))}
          </div>
        )}

        {activeCompany && (
          <div className="role-section animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="cs-header-wrap" style={{marginTop: '3rem'}}>
              <h2 className="cs-section-title">2. Role Designation</h2>
            </div>
            
            <div className="role-grid">
              {roles.map(role => (
                <div key={role.id} className="glass-panel role-card">
                  <div className="role-info">
                    <div className="role-icon">
                      <Briefcase size={20} color="var(--text-main)" />
                    </div>
                    <div>
                      <h3 className="role-name">{role.name}</h3>
                      <span className="text-subtle" style={{fontSize: '0.9rem'}}>{activeCompany.name}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={() => handleStartProcess(role)}
                    disabled={loading}
                  >
                    {loading ? 'Initializing...' : 'Deploy Engine'} <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySelection;
