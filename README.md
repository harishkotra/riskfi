# RiskFi - DeFi Risk Intelligence Dashboard

A modern, AI-powered dashboard for analyzing DeFi protocol risks. Combines real-time data from DefiLlama with local LLM analysis via Ollama.

## Features

- **Live Market Data**: Tracks Global Volume, Fees, and Top Protocols using DefiLlama.
- **Risk Scoring**: Visualizes Risk vs. Reward (TVL/Volatility) in interactive charts.
- **Local AI Analyst**: Chat with `gemma3:12b` (or any local model) to get qualitative risk assessments.
  - **Privacy First**: AI runs locally on your machine. No data leaves your network.
- **De-Peg Alerts**: Monitors stablecoins for deviations > 1%.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS (v3), Recharts, Framer Motion.
- **Router**: React Router v7.
- **Data**: Direct client-side fetch from DefiLlama API.
- **AI**: Client-side fetch to local Ollama instance (default: `http://localhost:11434`).

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Ollama (Required for AI features)**
   - Install [Ollama](https://ollama.com).
   - Pull a model: `ollama pull gemma3:12b`
   - Run with CORS enabled:
     ```bash
     OLLAMA_ORIGINS="*" ollama serve
     ```

3. **Run Application**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

## Disclaimer

This software is for educational purposes only. It is not financial advice.
Built by [Harish Kotra](https://github.com/harishkotra).
