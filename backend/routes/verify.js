const express = require('express');
const router = express.Router();
const { verifyClaim } = require('../services/groq');

// POST /api/verify
router.post('/', async (req, res) => {
  try {
    const { claim } = req.body;

    // Validation
    if (!claim) {
      return res.status(400).json({
        error: 'Claim text is required',
        message: 'Please provide a claim to verify',
      });
    }

    if (typeof claim !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Claim must be a text string',
      });
    }

    const trimmedClaim = claim.trim();

    if (trimmedClaim.length < 10) {
      return res.status(400).json({
        error: 'Claim too short',
        message: 'Please provide a more detailed claim (at least 10 characters)',
      });
    }

    if (trimmedClaim.length > 2000) {
      return res.status(400).json({
        error: 'Claim too long',
        message: 'Please limit your claim to 2000 characters',
      });
    }

    console.log(`[${new Date().toISOString()}] Verifying claim: "${trimmedClaim.substring(0, 80)}..."`);

    const result = await verifyClaim(trimmedClaim);

    // Add metadata
    result.claim = trimmedClaim;
    result.verified_at = new Date().toISOString();

    console.log(`[${new Date().toISOString()}] Result: ${result.classification} (${result.confidence}%)`);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Route error:', error.message);
    return res.status(500).json({
      error: 'Verification failed',
      message: error.message || 'An unexpected error occurred. Please try again.',
    });
  }
});

// GET /api/verify/health
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HaqiqatAI Verification Engine',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;