import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Code, Target, ChevronRight, Play } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if already authorized

  const handleStartProcess = () => {
    if (token) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-wrapper animate-fade-in">
      {/* Navbar segment specifically for marketing page */}
      <header className="landing-nav">
        <div className="landing-brand">PrepFlow</div>
        <div className="landing-nav-actions">
          {token ? (
            <button className="btn-secondary" onClick={() => navigate('/home')}>Enter Hub</button>
          ) : (
            <button className="btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
          )}
          <button className="btn-primary" onClick={handleStartProcess}>
            {token ? 'Resume Simulation' : 'Start Assessment'} <ChevronRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Banner Section */}
      <main className="landing-main">
        <div className="hero-content fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="hero-badge">v2.0 Architecture Live</div>
          <h1 className="hero-title">
            Pass technical rounds <br/>
            <span className="gradient-text">with absolute precision.</span>
          </h1>
          <p className="hero-subtitle text-subtle">
            PrepFlow is an enterprise-grade assessment simulation engine. We recreate the exact recruitment pipelines of top Tier-1 technology companies so you can practice, fail, and master your technical interviews in a safe environment.
          </p>
          <div className="hero-cta-group">
             <button className="btn-primary huge-btn" onClick={handleStartProcess}>
               Deploy Simulation Engine <Play size={18} fill="currentColor" />
             </button>
          </div>
        </div>

        {/* Visual Showcase (Generated Graphic) */}
        <div className="hero-graphic-wrapper fade-up" style={{ animationDelay: '0.2s' }}>
          <img src="/code_preview.png" alt="PrepFlow IDE Environment Preview" className="hero-preview-img" />
          <div className="graphic-glow"></div>
        </div>

        {/* Company Trust Banner */}
        <div className="company-banner fade-up" style={{animationDelay: '0.3s'}}>
          <p className="text-subtle text-small" style={{textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem'}}>Simulating Real Architectures From</p>
          <div className="company-logos">
            <span className="faux-logo">Amazon</span>
            <span className="faux-logo">TCS Ninja</span>
            <span className="faux-logo">Google</span>
            <span className="faux-logo">Microsoft</span>
          </div>
        </div>

        {/* How it Works / The Pipeline */}
        <div className="pipeline-section fade-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="section-title">The Execution Pipeline</h2>
          <p className="section-subtitle text-subtle">How we forge zero-to-offer technical proficiency.</p>
          
          <div className="pipeline-steps">
            <div className="pipe-step">
              <div className="step-number">01</div>
              <h4 className="step-title">Select Architecture</h4>
              <p className="text-subtle">Choose the precise company and role you are targeting. We instantly generate their specific testing sequence.</p>
            </div>
            <div className="step-connector"></div>
            <div className="pipe-step">
              <div className="step-number">02</div>
              <h4 className="step-title">Navigate Modules</h4>
              <p className="text-subtle">Endure strict time constraints and logic puzzles through Aptitude, System Design, and our Advanced Coding IDE.</p>
            </div>
            <div className="step-connector"></div>
            <div className="pipe-step">
              <div className="step-number">03</div>
              <h4 className="step-title">Extract Telemetry</h4>
              <p className="text-subtle">Check your Candidate Dossier to see exactly where you failed, module specific scores, and holistic feedback metrics.</p>
            </div>
          </div>
        </div>

        {/* Advantage Grid */}
        <div className="advantage-grid fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="glass-panel advantage-card">
            <div className="adv-icon">
              <Code size={28} color="var(--primary)" />
            </div>
            <h3 className="adv-title">IDE-Grade Algorithms</h3>
            <p className="text-subtle">Engage with complex data structure challenges mapped identically to competitive programming sites. Native syntax styling and execution constraint modeling.</p>
          </div>

          <div className="glass-panel advantage-card">
            <div className="adv-icon">
              <Shield size={28} color="var(--success)" />
            </div>
            <h3 className="adv-title">Authentic Pipelines</h3>
            <p className="text-subtle">Stop guessing the format. We map out precise sequences—from Aptitude testing straight into High-Level System Architecture and Behavioral HR phases.</p>
          </div>

          <div className="glass-panel advantage-card">
            <div className="adv-icon">
              <Target size={28} color="var(--warning)" />
            </div>
            <h3 className="adv-title">Advanced Telemetry</h3>
            <p className="text-subtle">Track everything. Your Dossier compiles metrics on your logical speed, execution time, and algorithmic accuracy to explicitly map out your recruitment readiness.</p>
          </div>
        </div>
        
        {/* Bottom CTA Block */}
        <div className="bottom-cta-banner fade-up" style={{ animationDelay: '0.6s' }}>
           <h2 className="cta-heading">Ready to beat the assessment barrier?</h2>
           <p className="text-subtle">Stop studying blindly. Start executing the simulation.</p>
           <button className="btn-primary huge-btn mt-4" onClick={handleStartProcess}>Initialize Profile</button>
        </div>
      </main>

      {/* Basic Footer */}
      <footer className="landing-footer text-subtle">
        <p>© 2026 PrepFlow Platforms. Enterprise simulation architecture.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
