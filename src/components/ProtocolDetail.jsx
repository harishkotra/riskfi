import React, { useEffect, useState } from 'react';
import { ArrowLeft, Shield, BrainCircuit, Globe, Lock, Power } from 'lucide-react';
import { api } from '../api';
import { ollamaClient } from '../services/ollamaClient';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ProtocolDetail = ({ protocolName, config, onBack }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState('');
    const [reportLoading, setReportLoading] = useState(false);

    useEffect(() => {
        async function fetchDetails() {
            try {
                const details = await api.getProtocolDetails(protocolName);
                console.log("Details fetched:", details);
                setData(details);

                // Trigger AI if enabled
                if (config.aiEnabled) {
                    generateReport(details.details);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [protocolName, config.aiEnabled]);

    const generateReport = async (details) => {
        setReportLoading(true);
        setReport('');
        try {
            // Safe access to nested properties
            const change_7d_val = details.change_7d !== undefined ? details.change_7d : 'N/A';
            // Some DefiLlama endpoints return audits differently or not at all
            const audits_val = (Array.isArray(details.audits) && details.audits.length > 0)
                ? details.audits.length
                : (details.audits ? 'Yes' : 'Unknown');

            const metrics = {
                name: details.name,
                tvl: details.tvl.reduce((acc, curr) => acc + curr.totalLiquidityUSD, 0),
                change_7d: change_7d_val,
                audits: audits_val
            };

            const prompt = `Analyze risk for ${metrics.name}. 
      Context:
      - TVL: $${(metrics.tvl / 1e9).toFixed(2)} Billion
      - 7d Change: ${metrics.change_7d}%
      - Audit Status: ${metrics.audits} (Count or Yes/No)

      Please list 3 key risks and 1 strength. Use Markdown formatting.`;

            await ollamaClient.chat(config.ollamaUrl, config.model, [{ role: 'user', content: prompt }], (chunk) => {
                setReport(prev => prev + chunk);
            });
        } catch (e) {
            setReport("Could not connect to AI Analyst.");
        } finally {
            setReportLoading(false);
        }
    };

    if (loading) return (
        <div className="w-full h-full flex items-center justify-center min-h-[400px]">
            <div className="animate-spin text-primary"><BrainCircuit size={48} /></div>
        </div>
    );

    if (!data) return <div className="text-center p-8 text-red-500">Failed to load protocol details.</div>;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Header */}
            <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {data.details.logo && <img src={data.details.logo} alt={data.details.name} className="w-16 h-16 rounded-full" />}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{data.details.name}</h1>
                        <div className="flex gap-2 flex-wrap">
                            <span className="badge bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-xs">{data.details.category || 'DeFi'}</span>
                            {data.details.chains && data.details.chains.map(c => (
                                <span key={c} className="badge bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-xs">{c}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: AI Report */}
                <div className="md:col-span-2 space-y-4">
                    <div className="card border-accent/20 bg-gradient-to-b from-zinc-900 to-accent/5 min-h-[200px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 text-accent">
                                <BrainCircuit size={24} />
                                <h2 className="text-lg font-bold">Risk Assessment Report</h2>
                            </div>
                            {!config.aiEnabled && (
                                <span className="text-xs text-zinc-500 flex items-center gap-1"><Power size={12} /> AI Disabled</span>
                            )}
                        </div>

                        {config.aiEnabled ? (
                            <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                                {report ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
                                ) : (
                                    <div className="text-zinc-500 italic">
                                        {reportLoading ? "Analyzing on-chain data..." : "Ready to analyze."}
                                    </div>
                                )}
                                {reportLoading && <span className="animate-pulse">_</span>}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-zinc-600">
                                Enable AI in settings to view risk reports.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Key Stats */}
                <div className="space-y-4">
                    <div className="card">
                        <h3 className="text-sm text-zinc-400 uppercase tracking-wider mb-4">Protocol Vitality</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between">
                                <span className="text-zinc-500 flex items-center gap-2"><Lock size={14} /> TVL</span>
                                <span className="text-white font-mono">${(data.details.tvl.reduce((a, b) => a + b.totalLiquidityUSD, 0) / 1e9).toFixed(2)}B</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-zinc-500 flex items-center gap-2"><Globe size={14} /> Website</span>
                                <a href={data.details.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate w-32 text-right">{data.details.url}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProtocolDetail;
