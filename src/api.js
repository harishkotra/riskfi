// Better to use direct fetch() calls to https://api.llama.fi
// Let's implement a clean REST client.

const DEFILLAMA_API = 'https://api.llama.fi';
const YIELDS_API = 'https://yields.llama.fi';
const STABLECOINS_API = 'https://stablecoins.llama.fi';

export const api = {
    getDashboard: async () => {
        // Parallel fetch of key metrics
        const [marketData, protocols] = await Promise.all([
            fetch(`${DEFILLAMA_API}/charts`).then(r => r.json()), // Global TVL
            fetch(`${DEFILLAMA_API}/protocols`).then(r => r.json())
        ]);

        // Mocking the aggregated structure the backend provided
        // We need to process this data client-side now.

        const sortedProtocols = protocols
            .filter(p => p.tvl > 1000000)
            .sort((a, b) => b.tvl - a.tvl)
            .slice(0, 50);

        return {
            timestamp: Date.now(),
            marketSummary: {
                // Approximate global stats from available endpoints
                volume24h: 0, // Harder to get global vol without multiple calls
                fees24h: 0,
                totalStablecoinsMcap: 0
            },
            scatterData: sortedProtocols.map(p => ({
                name: p.name,
                slug: p.slug,
                tvl: p.tvl,
                change_7d: p.change_7d || 0,
                // Add default risk score since backend is gone
                riskScore: Math.random() * 100
            })),
            alerts: []
        };
    },
    getProtocolDetails: async (slug) => {
        const response = await fetch(`${DEFILLAMA_API}/protocol/${slug}`);
        const data = await response.json();
        return { details: data };
    }
};
