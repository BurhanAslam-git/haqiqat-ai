const EXAMPLE_CLAIMS = [
  'Pakistan launched a moon mission in 2024',
  'Drinking warm water cures cancer',
  'Election results were rigged in NA-120',
];

const MAX_CHARS = 2000;

export default function ClaimInput({ claim, onChange, onVerify, isLoading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onVerify();
    }
  };

  return (
    <div className="claim-card glass-card" id="claim-input">
      <div className="claim-label">Enter a claim to verify / تصدیق کے لیے دعویٰ درج کریں</div>

      <div className="textarea-wrapper">
        <textarea
          className="claim-textarea"
          value={claim}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a news headline, WhatsApp message, or political statement...

یہاں خبر، سوشل میڈیا پوسٹ، یا سیاسی بیان چسپاں کریں"
          maxLength={MAX_CHARS}
          disabled={isLoading}
        />
        <span className="char-counter">{claim.length}/{MAX_CHARS}</span>
      </div>

      <button
        type="button"
        className="verify-btn"
        onClick={onVerify}
        disabled={isLoading || claim.trim().length < 10}
      >
        {isLoading ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Verifying...
          </>
        ) : (
          <>
            <span aria-hidden="true">🔍</span>
            Verify Claim
          </>
        )}
      </button>

      <div className="examples">
        <div className="examples-label">Try an example:</div>
        <div className="example-pills">
          {EXAMPLE_CLAIMS.map((example) => (
            <button
              key={example}
              type="button"
              className="example-pill"
              onClick={() => onChange(example)}
              disabled={isLoading}
            >
              {example.length > 45 ? `${example.substring(0, 45)}…` : example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
