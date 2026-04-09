import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUserApi } from '../services/api';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { Lock, Mail, User, ChevronRight } from 'lucide-react';
import './Login.css';

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
      const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : "Authentication failed.");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-panel login-card animate-fade-in">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <Lock size={22} color="var(--primary)" />
          </div>
          <h2 className="text-header" style={{fontSize: '1.8rem'}}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-subtle">
            {isRegister ? 'Start your placement journey' : 'Securely access your simulation history'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                className="input-base"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="name@example.com" 
              required 
              className="input-base"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              className="input-base"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary login-btn">
            {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
            <ChevronRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          <p className="text-subtle" style={{fontSize: '0.9rem'}}>
            {isRegister ? 'Already have an account? ' : 'Don\'t have an account? '}
            <span className="switch-link" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Login Instead' : 'Register Here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
