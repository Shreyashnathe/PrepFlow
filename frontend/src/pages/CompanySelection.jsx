import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompanies, fetchRoles, startSimulation } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Briefcase, ChevronRight, Building } from 'lucide-react';

const CompanySelection = () => {
  const navigate = useNavigate();
  const { setSelectedCompany, setSelectedRole, setAttemptId, userName, logoutUser } = useAppContext();
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies().then(res => setCompanies(res.data)).catch(console.error);
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
    <div style={styles.container}>
      <div style={styles.topNav}>
        <div style={styles.welcomeTag}>Hi, {userName || 'Candidate'} 👋</div>
        <button className="btn-primary" style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.hero}>
        <h1 className="gradient-text animate-fade-in" style={styles.title}>PrepFlow Simulator</h1>
        <p style={styles.subtitle}>Experience the exact hiring process of top companies.</p>
      </div>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>1. Select Target Company</h2>
        <div style={styles.grid}>
          {companies.map(company => (
            <div 
              key={company.id} 
              className="glass-panel"
              style={{
                ...styles.card,
                ...(activeCompany?.id === company.id ? styles.cardActive : {})
              }}
              onClick={() => handleCompanySelect(company)}
            >
              <Building size={40} color={activeCompany?.id === company.id ? '#60a5fa' : '#94a3b8'} />
              <h3 style={styles.cardTitle}>{company.name}</h3>
            </div>
          ))}
        </div>

        {activeCompany && (
          <div className="animate-fade-in" style={styles.roleSection}>
            <h2 style={styles.sectionTitle}>2. Select Role Hierarchy</h2>
            <div style={styles.roleGrid}>
              {roles.map(role => (
                <div key={role.id} className="glass-panel" style={styles.roleCard}>
                  <div style={styles.roleInfo}>
                    <Briefcase size={24} color="#8b5cf6" />
                    <span style={styles.roleName}>{role.name}</span>
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={() => handleStartProcess(role)}
                    disabled={loading}
                    style={styles.actionBtn}
                  >
                    {loading ? 'Starting...' : 'Simulate Pipeline'} <ChevronRight size={18} />
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

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  card: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cardActive: {
    borderColor: 'var(--primary)',
    boxShadow: 'var(--shadow-neon)',
    transform: 'translateY(-5px)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  roleSection: {
    marginTop: '2rem',
  },
  roleGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  roleCard: {
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  roleName: {
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  topNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  welcomeTag: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    padding: '0.5rem 1rem',
  }
};

export default CompanySelection;
