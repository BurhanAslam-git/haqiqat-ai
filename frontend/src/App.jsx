import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ClaimInput from './components/ClaimInput';
import ResultCard from './components/ResultCard';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const LOADING_MESSAGES = [
  'Searching the web...',
  'Analyzing claim...',
  'Cross-checking sources...',
  'Writing Urdu explanation...',
  'Calculating confidence...',
];

export default function App() {
  const [claim, setClaim] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [apiOnline, setApiOnline] = useState(null);
  const msgIndexRef = useRef(0);

  const checkHealth = useCallback(async () => {
    try {
      const url = API_URL ? `${API_URL}/api/verify/health` : '/api/verify/health';
      const res = await axios.get(url, { timeout: 5000 });
      setApiOnline(res.data?.status === 'ok');
    } catch {
      setApiOnline(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const handleVerify = async () => {
    if (!claim.trim() || claim.trim().length < 10) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    msgIndexRef.current = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const msgInterval = setInterval(() => {
      msgIndexRef.current = (msgIndexRef.current + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndexRef.current]);
    }, 2500);

    try {
      const url = API_URL ? `${API_URL}/api/verify` : '/api/verify';
      const response = await axios.post(
        url,
        { claim: claim.trim() },
        { timeout: 60000 }
      );

      setResult(response.data);

      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      clearInterval(msgInterval);
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setError(null);
    document.getElementById('claim-input')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleVerifyAnother = () => {
    setResult(null);
    setClaim('');
    setError(null);
    document.getElementById('claim-input')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon" aria-hidden="true">🛡</div>
            <div className="logo-text">
              Haqiqat<span>AI</span>
            </div>
          </div>
          <span className="beta-badge">Beta</span>
        </div>
        <div className={`api-status ${apiOnline === true ? 'online' : apiOnline === false ? 'offline' : 'checking'}`}>
          <span className="status-dot" aria-hidden="true" />
          <span className="status-text">
            {apiOnline === true ? 'API Online' : apiOnline === false ? 'API Offline' : 'Checking…'}
          </span>
        </div>
      </header>

      <section className="hero">
        <h1 className="hero-title">Sach Ya Jhoot?</h1>
        <p className="hero-sub">
          Pakistan&apos;s AI-powered fact-checker. Paste any claim and get the truth in seconds.
        </p>
        <p className="hero-sub urdu">
          پاکستان کا اے آئی حقیقت جانچنے کا پلیٹ فارم — کسی بھی دعوے کی تصدیق کریں
        </p>
      </section>

      <div className="stats-row">
        <div className="stat-card glass-card">
          <div className="stat-number">480x</div>
          <div className="stat-label">Faster</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-number">30 Sec</div>
          <div className="stat-label">Per Claim</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-number">2</div>
          <div className="stat-label">Urdu + English</div>
        </div>
      </div>

      <main className="main">
        <ClaimInput
          claim={claim}
          onChange={setClaim}
          onVerify={handleVerify}
          isLoading={isLoading}
        />

        {isLoading && (
          <div className="loading-card glass-card animate-fade-in" id="result">
            <div className="spinner pulse-spinner" aria-hidden="true" />
            <p className="loading-text">{loadingMsg}</p>
            <p className="loading-sub">Groq AI is searching the web and analyzing evidence…</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="error-card glass-card animate-slide-up" id="result">
            <div className="error-icon" aria-hidden="true">⚠</div>
            <h2 className="error-title">Verification Failed</h2>
            <p className="error-msg">{error}</p>
            <button type="button" className="try-again-btn" onClick={handleTryAgain}>
              Try Again
            </button>
          </div>
        )}

        {result && !isLoading && (
          <div id="result">
            <ResultCard result={result} onVerifyAnother={handleVerifyAnother} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>HaqiqatAI — Code for Pakistan Hackathon 2026</p>
      </footer>
    </div>
  );
}
