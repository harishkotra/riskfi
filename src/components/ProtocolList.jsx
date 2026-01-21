import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown, ShieldAlert } from 'lucide-react';

const ProtocolList = ({ protocols, onSelect }) => {
    const [page, setPage] = React.useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(protocols.length / itemsPerPage);

    const paginatedProtocols = protocols.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <div className="card w-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Top Protocols by TVL</h2>
                <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">Live Data</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-zinc-500 uppercase border-b border-zinc-800">
                            <th className="pb-3 pl-2">Protocol</th>
                            <th className="pb-3">TVL</th>
                            <th className="pb-3">7d Change</th>
                            <th className="pb-3">Risk Score</th>
                            <th className="pb-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {paginatedProtocols.map((p) => (
                            <tr key={p.name} className="group hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onSelect(p)}>
                                <td className="py-3 pl-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300">
                                            {p.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{p.name}</p>
                                            <p className="text-xs text-zinc-500">{p.category || 'DeFi'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 font-mono text-zinc-300">
                                    ${(p.tvl / 1e9).toFixed(2)}B
                                </td>
                                <td className="py-3">
                                    <div className={`flex items-center gap-1 text-sm ${p.change_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {p.change_7d >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {Math.abs(p.change_7d).toFixed(2)}%
                                    </div>
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${p.riskScore > 50 ? 'bg-red-500' : p.riskScore > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                style={{ width: `${p.riskScore}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-zinc-400 font-mono">{Math.round(p.riskScore)}/100</span>
                                    </div>
                                </td>
                                <td className="py-3 text-right pr-2">
                                    <button className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all">
                                        <ChevronRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-zinc-500">
                        Page <span className="text-zinc-300 font-mono">{page}</span> of <span className="text-zinc-300 font-mono">{totalPages}</span>
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProtocolList;
