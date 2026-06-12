import { useEffect, useState } from 'react';

export default function ConfidenceMeter({ confidence }) {
  const [animated, setAnimated] = useState(false);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, confidence));
  const offset = circumference - (clamped / 100) * circumference;

  const getColor = () => {
    if (clamped <= 40) return '#EF4444';
    if (clamped <= 70) return '#F59E0B';
    return '#22C55E';
  };

  useEffect(() => {
    const timer = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(timer);
  }, [confidence]);

  return (
    <div className="confidence-meter-circle">
      <svg className="confidence-svg" viewBox="0 0 140 140" aria-hidden="true">
        <circle
          className="confidence-track"
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          strokeWidth="10"
        />
        <circle
          className="confidence-arc"
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          strokeWidth="10"
          stroke={getColor()}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="confidence-center">
        <span className="confidence-percent" style={{ color: getColor() }}>
          {clamped}%
        </span>
        <span className="confidence-sublabel">AI Confidence Score</span>
      </div>
    </div>
  );
}
