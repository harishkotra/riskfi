import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell, ReferenceLine } from 'recharts';

const RiskScatterPlot = ({ data }) => {
    // Data format expected: { name, tvl, mcap, change_7d, riskScore }
    // X: Risk Score (0-100)
    // Y: Volatility (7d Change abs) or Market Cap? Let's verify Logic.
    // Implementation Plan said: Yield (Y) vs Risk (X). 
    // But we have TVL/Mcap. Let's use 7d Change (Yield proxy sort of) vs Risk Score.

    // Filter outliers to improve chart readability
    // Remove anything with absolute change > 200% to prevent scaling issues
    const filteredData = data.filter(d => Math.abs(d.change_7d) < 200);
    const hiddenCount = data.length - filteredData.length;

    const formattedData = filteredData.map(d => ({
        ...d,
        x: Math.round(d.riskScore), // Round risk score
        y: d.change_7d,
        z: d.tvl
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-surface/95 border border-zinc-700 p-3 rounded-lg shadow-xl text-sm backdrop-blur-md z-50">
                    <p className="font-bold text-white mb-2 text-base">{d.name}</p>
                    <div className="space-y-1.5">
                        <p className="text-zinc-400 flex justify-between gap-6 items-center">
                            <span>Risk Score:</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden`}>
                                    <div className={`h-full ${d.x > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${d.x}%` }} />
                                </div>
                                <span className={d.x > 50 ? "text-red-400 font-mono font-bold" : "text-green-400 font-mono font-bold"}>{d.x}/100</span>
                            </div>
                        </p>
                        <p className="text-zinc-400 flex justify-between gap-6">
                            <span>7d Change:</span>
                            <span className={d.y >= 0 ? "text-green-400 font-mono font-bold" : "text-red-400 font-mono font-bold"}>{d.y > 0 ? '+' : ''}{Math.round(d.y)}%</span>
                        </p>
                        <p className="text-zinc-400 flex justify-between gap-6 border-t border-zinc-700 pt-2 mt-1">
                            <span>TVL:</span>
                            <span className="text-white font-mono">${(d.z / 1e9).toFixed(2)}B</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[500px] w-full bg-surface/50 rounded-xl border border-zinc-800 p-6 relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Risk / Reward Map
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1 max-w-md">
                        Visualizing how <b>{(data.length - hiddenCount)} top protocols</b> are performing relative to their risk.
                        {hiddenCount > 0 && <span className="text-yellow-500 ml-1">({hiddenCount} outliers hidden)</span>}
                    </p>
                </div>
                <div className="text-xs text-zinc-500 text-right bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                    <p className="font-medium text-zinc-400">Data Source: <span className="text-primary">DefiLlama API</span></p>
                    <p>Period: Last 7 Days</p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 30, bottom: 40, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Risk Score"
                            stroke="#52525b"
                            domain={[0, 100]}
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            label={{ value: 'Risk Score (Right is Riskier) →', position: 'insideBottom', offset: -25, fill: '#71717a', fontSize: 13 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="7d Change"
                            unit="%"
                            stroke="#52525b"
                            width={65}
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            label={{ value: '↑ Better Performance (7d Change %)', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 13, offset: 15 }}
                        />
                        <ZAxis type="number" dataKey="z" range={[60, 600]} name="TVL" />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                        {/* Zero Line for reference */}
                        <ReferenceLine y={0} stroke="#3f3f46" strokeWidth={2} />

                        <Scatter name="Protocols" data={formattedData} fill="#8884d8" animationDuration={1000}>
                            {formattedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.y > 0 ? '#3b82f6' : '#ef4444'}
                                    fillOpacity={0.7}
                                    strokeWidth={2}
                                    stroke={entry.y > 0 ? '#60a5fa' : '#f87171'}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RiskScatterPlot;
