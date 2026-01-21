import React from 'react';

const Terms = () => {
    return (
        <div className="max-w-3xl mx-auto py-20 px-6 space-y-8 text-zinc-300">
            <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">1. No Financial Advice</h2>
                <p>This application, "RiskFi", provides data and analysis for informational purposes only. Nothing on this website constitutes financial, investment, or trading advice.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">2. Liability</h2>
                <p>The creator (Harish Kotra) assumes no liability for any financial losses or damages resulting from the use of this data. All data is fetched from public APIs and is provided "as is" without warranty of any kind.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">3. Data Sources</h2>
                <p>Protocol data is provided by the DefiLlama API. We do not control or verify this data.</p>
            </section>
        </div>
    );
};

export default Terms;
