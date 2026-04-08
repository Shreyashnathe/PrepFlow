import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUserApi } from '../services/api';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { Lock, Mail, User, ChevronRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAppContext();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        const { registerUser } = await import('../services/api');
        await registerUser({ name: formData.name, email: formData.email, password: formData.password });
        toast.success("Account created! Please log in.");
        setIsRegister(false);
      } else {
        const res = await loginUserApi({ email: formData.email, password: formData.password });
        loginUser(res.data);
        toast.success(`Welcome back, ${res.data.name}!`);
        navigate('/home');
      }
    } catch (err) {
      toast.error(err.response?.data || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <Lock size={24} color="var(--primary)" />
          </div>
          <h2 style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={styles.subtitle}>
            {isRegister ? 'Start your placement journey' : 'Securely access your simulation history'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <div style={styles.inputGroup}>
              <User size={18} style={styles.icon} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                style={styles.input}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.icon} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              style={styles.input}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              style={styles.input}
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{width: '100%', marginTop: '1rem', justifyContent: 'center'}}>
            {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
            <ChevronRight size={18} />
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
            {isRegister ? 'Already have an account? ' : 'Don\'t have an account? '}
            <span style={styles.switchLink} onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Login Instead' : 'Register Here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
  },
  iconWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    background: 'rgba(59, 130, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
  },
  input: {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--bg-card-hover)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'var(--transition)',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  switchLink: {
    color: 'var(--primary)',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  }
};

export default Login;
