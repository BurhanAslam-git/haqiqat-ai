import { useState } from 'react';
import ConfidenceMeter from './ConfidenceMeter';
import SourcesList from './SourcesList';

const CONFIG = {
  FACT: {
    icon: '✓',
    label: 'FACT CONFIRMED',
    gradient: 'banner-fact',
    severityClass: 'severity-low',
  },
  MISINFORMATION: {
    icon: '✕',
    label: 'MISINFORMATION DETECTED',
    gradient: 'banner-misinfo',
    severityClass: 'severity-high',
  },
  UNVERIFIABLE: {
    icon: '?',
    label: 'CANNOT VERIFY',
    gradient: 'banner-unverifiable',
    severityClass: 'severity-medium',
  },
  SATIRE: {
    icon: '🎭',
    label: 'SATIRE / PARODY',
    gradient: 'banner-satire',
    severityClass: 'severity-low',
  },
};

const SEVERITY_CLASS = {
  LOW: 'severity-low',
  MEDIUM: 'severity-medium',
  HIGH: 'severity-high',
  CRITICAL: 'severity-critical',
};

export default function ResultCard({ result, onVerifyAnother }) {
  const [langTab, setLangTab] = useState('english');
  const config = CONFIG[result.classification] || CONFIG.UNVERIFIABLE;
  const severityClass = SEVERITY_CLASS[result.severity] || 'severity-medium';

  const verifiedTime = new Date(result.verified_at).toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="result-card glass-card animate-slide-up">
      <div className={`result-banner ${config.gradient}`}>
        {result.severity && (
          <span className={`severity-pill ${severityClass}`}>
            {result.severity}
          </span>
        )}
        <div className="banner-content">
          <span className="banner-icon">{config.icon}</span>
          <span className="banner-label">{config.label}</span>
        </div>
        {result.claim_category && (
          <span className="category-pill">{result.claim_category}</span>
        )}
      </div>

      <div className="result-body">
        <div className="confidence-section">
          <ConfidenceMeter confidence={result.confidence} />
        </div>

        <div className="lang-tabs">
          <button
            type="button"
            className={`lang-tab ${langTab === 'english' ? 'active' : ''}`}
            onClick={() => setLangTab('english')}
          >
            English
          </button>
          <button
            type="button"
            className={`lang-tab ${langTab === 'urdu' ? 'active' : ''}`}
            onClick={() => setLangTab('urdu')}
          >
            اردو
          </button>
        </div>

        <div className="reasoning-block animate-fade-in">
          {langTab === 'english' ? (
            <p className="reasoning-text">{result.reasoning_english}</p>
          ) : (
            <p className="reasoning-text urdu">{result.reasoning_urdu}</p>
          )}
        </div>

        {result.key_evidence?.length > 0 && (
          <div className="result-section">
            <h3 className="section-title">Key Evidence</h3>
            <ol className="evidence-list">
              {result.key_evidence.map((point, i) => (
                <li key={i} className="evidence-item">
                  <span className="evidence-bullet" aria-hidden="true">●</span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="result-section">
          <h3 className="section-title">Sources</h3>
          <SourcesList sources={result.sources} />
        </div>

        <p className="verified-timestamp">Verified at {verifiedTime} PKT</p>

        <button type="button" className="verify-another-btn" onClick={onVerifyAnother}>
          Verify Another Claim
        </button>
      </div>
    </div>
  );
}
