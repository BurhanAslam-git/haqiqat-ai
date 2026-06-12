# HaqiqatAI — سچ یا جھوٹ؟

Pakistan's AI-powered bilingual fact-checker. Paste any claim and get the truth in seconds.

---

## 🧠 What is HaqiqatAI?

HaqiqatAI is a civic-tech web application built for Pakistan that lets anyone — journalist, student, or common citizen — paste a claim (news headline, WhatsApp forward, political statement, health advice) and receive an AI-verified, bilingual fact-check with evidence and sources in under 30 seconds.

**The Problem:** Pakistan is one of the world's most affected countries by misinformation — viral WhatsApp forwards, fabricated political quotes, health myths, and economic lies spread daily with no easy way for the public to verify them.

**The Solution:** HaqiqatAI uses real-time web search + a large language model to classify any claim as FACT, MISINFORMATION, PARTIALLY TRUE, UNVERIFIABLE, or SATIRE — with full reasoning in both English and Urdu.

---

## ✨ Key Features

- 🔍 **Real-time Web Search** — powered by Tavily API
- 🤖 **AI Analysis** — Llama 3.3 70B via Groq API
- 🇵🇰 **Pakistan-specific Context** — politics, economy, health, viral content
- 🌐 **Bilingual Output** — English and Urdu (Nastaliq script)
- ⚡ **480x Faster** — 30 seconds vs ~4 hours of manual fact-checking
- 🎯 **Confidence Score** — 0–100% with severity level
- 🚩 **Red Flags Detection** — anonymous sources, emotional language
- 📊 **Structured Verdict** — classification, evidence, sources, summary

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| AI Model | Llama 3.3 70B via Groq API |
| Web Search | Tavily Search API |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- Groq API key → console.groq.com
- Tavily API key → tavily.com

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