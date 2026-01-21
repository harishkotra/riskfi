import React from 'react';
import { Activity, DollarSign, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
    <div className="card flex items-start justify-between relative overflow-hidden group">
        <div className="z-10 relative">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
            {subtext && <p className="text-xs text-zinc-500">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-500/10 text-${color}-500 z-10`}>
            <Icon size={20} />
        </div>
        <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-${color}-500/5 rounded-full blur-2xl group-hover:bg-${color}-500/10 transition-all duration-500`} />
    </div>
);

const MarketPulse = ({ data }) => {
    // data: { volume24h, fees24h, totalStablecoinsMcap, aiCommentary }

    if (!data) return <div className="animate-pulse h-32 bg-zinc-900 rounded-xl"></div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
                label="24h Volume"
                value={`$${(data.volume24h / 1e9).toFixed(2)}B`}
                subtext="Global DEX Activity"
                icon={Activity}
                color="blue"
            />
            <StatCard
                label="24h Fees"
                value={`$${(data.fees24h / 1e6).toFixed(2)}M`}
                subtext="Protocol Revenue"
                icon={DollarSign}
                color="green"
            />
            <StatCard
                label="Stablecoin Mcap"
                value={`$${(data.totalStablecoinsMcap / 1e9).toFixed(2)}B`}
                subtext="Market Liquidity"
                icon={BarChart3}
                color="purple"
            />

            {/* AI Commentary Block */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card col-span-1 border-l-4 border-l-accent p-4 flex flex-col justify-center bg-gradient-to-br from-zinc-900 to-accent/5"
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">AI Analyst</span>
                </div>
                <p className="text-sm text-zinc-300 italic leading-relaxed">
                    "{data.aiCommentary || "Analyzing market conditions..."}"
                </p>
            </motion.div>
        </div>
    );
};

export default MarketPulse;
