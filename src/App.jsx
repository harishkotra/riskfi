import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { api } from './api';
import MarketPulse from './components/MarketPulse';
import RiskScatterPlot from './components/RiskScatterPlot';
import ProtocolList from './components/ProtocolList';
import ProtocolDetail from './components/ProtocolDetail';
import ChatInterface from './components/ChatInterface';
import SettingsModal from './components/SettingsModal';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ChatPage from './pages/ChatPage';
import Tooltip from './components/Tooltip';
import { AlertTriangle, LayoutGrid, Search, Settings, MessageCircle, ShieldCheck } from 'lucide-react';
import { ollamaClient } from './services/ollamaClient';

/* Wrapper to use hooks like useLocation */
const AppContent = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Config State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    ollamaUrl: 'http://localhost:11434',
    aiEnabled: true,
    model: 'gemma3:12b'
  });

  const location = useLocation();


  useEffect(() => {
    async function init() {
      try {
        const data = await api.getDashboard();
        setDashboardData(data);

        // Trigger AI Analysis if enabled
        if (aiConfig.aiEnabled) {
          generateMarketAnalysis(data, aiConfig);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Effect to re-run analysis if AI is toggled or config changes
  useEffect(() => {
    if (dashboardData && aiConfig.aiEnabled && !dashboardData.marketSummary.aiCommentary) {
      generateMarketAnalysis(dashboardData, aiConfig);
    }
  }, [aiConfig.aiEnabled, aiConfig.model]);

  const generateMarketAnalysis = async (data, config) => {
    try {
      const topProtocols = data.scatterData.slice(0, 5).map(p => `${p.name} ($${(p.tvl / 1e9).toFixed(1)}B TVL)`).join(', ');
      const prompt = `Analyze this DeFi market snapshot in 1 short sentence (max 15 words). Mention key trends. Top protocols: ${topProtocols}.`;

      const commentary = await ollamaClient.generate(
        config.ollamaUrl,
        prompt,
        `You are a DeFi analyst. Be concise. Model: ${config.model}`
      );

      setDashboardData(prev => ({
        ...prev,
        marketSummary: {
          ...prev.marketSummary,
          aiCommentary: commentary.trim() || "Market stable. No major anomalies detected."
        }
      }));
    } catch (err) {
      console.warn("AI Analysis failed:", err);
      setDashboardData(prev => ({
        ...prev,
        marketSummary: {
          ...prev.marketSummary,
          aiCommentary: "AI Analysis unavailable (Local LLM offline)"
        }
      }));
    }
  };


  // Wrapper for Detail View to handle routing
  const ProtocolWrapper = () => {
    // For simplicity in this demo, we're not extracting ID from URL yet, 
    // but ideally we should: /protocol/:slug. 
    // We'll stick to passing props or using basic state for now if sticking to old flow,
    // BUT "Phase 2" requested Router. 
    // Let's implement real params next step? 
    // For now, let's keep it compatible with existing components. 
    // Actually, let's just use a simple State wrapper for the home page 
    // and real routes for the new pages.
    // WAIT: User said "Add new page".
    return null;
  };


  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-12 font-sans flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-8 relative flex-1">

        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">DeFi Intel <span className="text-primary">X</span></h1>
              <p className="text-xs text-zinc-500">
                {aiConfig.aiEnabled ? 'AI-Powered ' : ''}Risk Assessment Engine
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/chat" className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all">
              <MessageCircle size={20} />
              <span className="text-sm font-medium">AI Analyst</span>
            </Link>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <Settings size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${aiConfig.aiEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-zinc-500">{aiConfig.aiEnabled ? 'AI Online' : 'AI Offline'}</span>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomeLogic dashboardData={dashboardData} aiConfig={aiConfig} loading={loading} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/chat" element={<ChatPage config={aiConfig} contextData={dashboardData?.marketSummary} />} />
        </Routes>

      </div>

      <Footer />

      {/* Global Modals */}
      {/* Hide ChatWidget if on ChatPage */}
      {location.pathname !== '/chat' && (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(!isChatOpen)}
          config={aiConfig}
          contextData={dashboardData?.marketSummary}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSave={setAiConfig}
      />
    </div>
  );
};

// Internal component to handle the switch between Dashboard and Detail on the "/" route
const HomeLogic = ({ dashboardData, aiConfig, loading }) => {
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin mb-4 text-primary"><LayoutGrid size={32} /></div>
      <p className="text-zinc-500">Loading...</p>
    </div>
  );

  if (selectedProtocol) {
    return (
      <ProtocolDetail
        protocolName={selectedProtocol}
        config={aiConfig}
        onBack={() => setSelectedProtocol(null)}
      />
    );
  }

  // Dashboard View
  if (!dashboardData) return null;
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <MarketPulse data={dashboardData.marketSummary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Risk Map</h2>
            <Tooltip text="Visualizes protocols based on Risk Score (Y) vs 7-day Change (X). High Score = Higher Risk.">
              <div className="cursor-help opacity-50 text-xs">(?)</div>
            </Tooltip>
          </div>
          <RiskScatterPlot data={dashboardData.scatterData} />
          <div className="flex items-center gap-2 mt-8">
            <h2 className="text-xl font-bold">Top Protocols</h2>
            <Tooltip text="Top 50 protocols by TVL with computed risk metrics.">
              <div className="cursor-help opacity-50 text-xs">(?)</div>
            </Tooltip>
          </div>
          <ProtocolList protocols={dashboardData.scatterData} onSelect={(p) => setSelectedProtocol(p.slug)} />
        </div>

        <div className="space-y-6">
          {dashboardData.alerts.length > 0 ? (
            <div className="card h-full bg-red-500/5 border-red-900/50">
              <div className="flex items-center gap-2 mb-4 text-red-500">
                <AlertTriangle size={20} />
                <h3 className="font-bold">Active Risks</h3>
                <Tooltip text="Stablecoins deviating from $1.00 peg or high-volatility events."><span className="text-xs opacity-50">(?)</span></Tooltip>
              </div>
              <ul className="space-y-3">
                {dashboardData.alerts.slice(0, 5).map(alert => (
                  <li key={alert.name} className="bg-surface p-3 rounded-lg border border-red-500/20 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-white">{alert.symbol}</p>
                      <p className="text-xs text-red-400">Peg: ${alert.price?.toFixed(4)}</p>
                    </div>
                    <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded">DE-PEG</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="card h-full bg-surface border-zinc-800">
              <div className="flex items-center gap-2 mb-4 text-green-500">
                <ShieldCheck size={20} />
                <h3 className="font-bold">Market Stability</h3>
                <Tooltip text="Real-time monitoring of stablecoin pegs and protocol volatility."><span className="text-xs opacity-50 cursor-help">(?)</span></Tooltip>
              </div>
              <div className="space-y-6">
                <div className="bg-green-500/5 p-6 rounded-xl border border-green-500/20 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <ShieldCheck size={64} />
                  </div>
                  <p className="text-green-400 font-bold text-xl mb-1">System Normal</p>
                  <p className="text-xs text-green-400/60 font-mono">ALL SYSTEMS OPERATIONAL</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded transition-colors">
                    <span className="text-zinc-400">Stablecoin Pegs</span>
                    <span className="text-green-500 font-medium flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      Stable
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded transition-colors">
                    <span className="text-zinc-400">Volatility Index</span>
                    <span className="text-zinc-300 font-medium">Moderate</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded transition-colors">
                    <span className="text-zinc-400">Data Feed</span>
                    <span className="text-green-500 font-medium">Live</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/50">
                  <p className="text-[10px] text-zinc-600 text-center">
                    Monitoring 50+ Top DeFi Protocols
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
