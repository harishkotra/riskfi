# RiskFi - DeFi Risk Intelligence Dashboard

A modern, AI-powered dashboard for analyzing DeFi protocol risks. Combines real-time data from DefiLlama with local LLM analysis via Ollama.

## Features

- **Live Market Data**: Tracks Global Volume, Fees, and Top Protocols using DefiLlama.
- **Risk Scoring**: Visualizes Risk vs. Reward (TVL/Volatility) in interactive charts.
- **Local AI Analyst**: Chat with `gemma3:12b` (or any local model) to get qualitative risk assessments.
  - **Privacy First**: AI runs locally on your machine. No data leaves your network.
- **De-Peg Alerts**: Monitors stablecoins for deviations > 1%.

<img width="1554" height="2170" alt="image" src="https://github.com/user-attachments/assets/b1a00754-e581-41e1-9e08-0f40be2084d7" />
<img width="1507" height="1131" alt="image" src="https://github.com/user-attachments/assets/ed95c420-2b36-48a3-ad34-556c43265bfe" />
<img width="910" height="936" alt="image" src="https://github.com/user-attachments/assets/22c3cb77-beb9-4ee6-8bce-c8f31246adad" />
<img width="1554" height="1563" alt="image" src="https://github.com/user-attachments/assets/acddce5f-c7a9-4638-b7e3-b1c2e7a76f97" />
<img width="1150" height="816" alt="image" src="https://github.com/user-attachments/assets/1255c423-a026-4447-9510-936a3729463d" />
<img width="1554" height="1563" alt="image" src="https://github.com/user-attachments/assets/aa13507a-b80e-4abb-890f-439037296da6" />
<img width="1454" height="1123" alt="image" src="https://github.com/user-attachments/assets/3982b8c8-1075-48dc-9a1e-6616fb27d92f" />


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
