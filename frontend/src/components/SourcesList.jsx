import { useState } from 'react';

const MAX_VISIBLE = 5;

function extractDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function SourcesList({ sources }) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return <p className="sources-empty">No sources found for this claim</p>;
  }

  const visibleSources = expanded ? sources : sources.slice(0, MAX_VISIBLE);
  const hiddenCount = sources.length - MAX_VISIBLE;

  const openSource = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="sources-list">
      {visibleSources.map((url, i) => (
        <button
          key={i}
          type="button"
          className="source-row"
          onClick={() => openSource(url)}
        >
          <span className="source-domain">{extractDomain(url)}</span>
          <span className="source-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </span>
        </button>
      ))}

      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          className="sources-show-more"
          onClick={() => setExpanded(true)}
        >
          Show {hiddenCount} more
        </button>
      )}
    </div>
  );
}
