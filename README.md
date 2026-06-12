# HaqiqatAI — سچ یا جھوٹ؟

Pakistan's AI-powered bilingual fact-checker. Paste any claim and get the truth in seconds.

---

## 🧠 What is HaqiqatAI?

HaqiqatAI is a civic-tech web application built for Pakistan that lets anyone — journalist, student, or common citizen — paste a claim (news headline, WhatsApp forward, political statement, health advice) and receive an AI-verified, bilingual fact-check with evidence and sources in under 30 seconds.

**The Problem:** Pakistan is one of the world's most affected countries by misinformation — viral WhatsApp forwards, fabricated political quotes, health myths, and economic lies spread daily with no easy way for the public to verify them.

**The Solution:** HaqiqatAI uses real-time web search + a large language model to classify any claim as FACT, MISINFORMATION, PARTIALLY TRUE, UNVERIFIABLE, or SATIRE — with full reasoning in both English and Urdu.

---

## ✨ Key Features

- 🔍 **Real-time Web Search** — powered by Tavily API, searches the live web for evidence
- 🤖 **AI Analysis** — Llama 3.3 70B via Groq API analyzes the claim against search results
- 🇵🇰 **Pakistan-specific Context** — trained prompts covering Pakistani politics, economy, health, and viral content
- 🌐 **Bilingual Output** — full reasoning in both English and Urdu (Nastaliq script)
- ⚡ **480x Faster** — 30 seconds vs ~4 hours of manual fact-checking
- 🎯 **Confidence Score** — 0–100% confidence rating with severity level
- 🚩 **Red Flags Detection** — identifies suspicious elements like anonymous sources or emotional language
- 📊 **Structured Verdict** — classification, evidence points, sources, and a one-line verdict summary

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, bilingual UI (English/Urdu) |
| Backend | Node.js + Express |
| AI Model | Llama 3.3 70B via Groq API |
| Web Search | Tavily Search API |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## 📁 Project Structure
haqiqat-ai/

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   │   ├── ClaimInput.jsx

│   │   │   ├── ConfidenceMeter.jsx

│   │   │   └── ResultCard.jsx

│   │   ├── App.jsx

│   │   ├── App.css

│   │   └── main.jsx

│   ├── index.html

│   └── vite.config.js

│

├── backend/

│   ├── routes/

│   │   └── verify.js

│   ├── services/

│   │   └── groq.js

│   ├── server.js

│   └── package.json

│

└── README.md

---

## 🚀 Local Setup & Running

### Prerequisites
- Node.js v18+
- A Groq API key → console.groq.com
- A Tavily API key → tavily.com

### Step 1 — Clone the repo
```bash
git clone https://github.com/BurhanAslam-git/haqiqat-ai.git
cd haqiqat-ai
```

### Step 2 — Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
GROQ_API_KEY=your_groq_api_key_here

TAVILY_API_KEY=your_tavily_api_key_here

PORT=5000

Start the backend:
```bash
node server.js
```

### Step 3 — Frontend setup
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:
VITE_API_URL=http://localhost:5000

Start the frontend:
```bash
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🔌 API Reference

### POST /api/verify

Request:
```json
{
  "claim": "Pakistan ki economy duniya mein sab se tez grow kar rahi hai"
}
```

Response:
```json
{
  "classification": "MISINFORMATION",
  "confidence": 85,
  "severity": "HIGH",
  "reasoning_english": "This claim is not supported by current economic data...",
  "reasoning_urdu": "یہ دعویٰ موجودہ اقتصادی اعداد و شمار سے ثابت نہیں ہوتا...",
  "key_evidence": ["IMF data shows Pakistan GDP growth at 2.4%"],
  "red_flags": ["No specific date mentioned", "Superlative language used"],
  "verdict_summary": "Pakistan's economy is not the fastest growing in the world.",
  "sources": ["https://imf.org/...", "https://dawn.com/..."],
  "claim_category": "economy",
  "verified_at": "2026-06-12T03:00:00.000Z"
}
```

### GET /api/verify/health
Returns service health status.

---

## 🌍 Deployment

### Backend → Railway
1. Go to railway.app → New Project → Deploy from GitHub
2. Select this repo → Set Root Directory to `backend`
3. Add environment variables: `GROQ_API_KEY`, `TAVILY_API_KEY`, `PORT=5000`
4. Deploy → copy the Railway URL

### Frontend → Vercel
1. Go to vercel.com → New Project → Import this repo
2. Set Root Directory to `frontend`, Build Command to `npm run build`, Output to `dist`
3. Add environment variable: `VITE_API_URL=https://YOUR_RAILWAY_URL`
4. Deploy

---

## 🎯 Impact

- 480x faster than manual fact-checking
- Scales to thousands of claims daily
- Accessible to all Pakistanis in their native language
- Transparent and explainable AI verdicts with sources

---

## 👥 Team

Built for the **AI for Civic Innovation Hackathon 2026** — shortlisted from 162 applications.

---

## 📄 License

MIT License — free to use, modify, and distribute.