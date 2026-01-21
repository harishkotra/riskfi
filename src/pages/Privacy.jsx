import React from 'react';

const Privacy = () => {
    return (
        <div className="max-w-3xl mx-auto py-20 px-6 space-y-8 text-zinc-300">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">1. Local AI Privacy</h2>
                <p>This application follows a "Bring Your Own AI" model. When you use the AI features:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Your chat data is sent directly from your browser to your local Ollama instance (localhost).</li>
                    <li>We (the developers) do <strong>not</strong> see, store, or process your conversations.</li>
                    <li>Your data never leaves your machine's local network for AI analysis.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">2. Analytics</h2>
                <p>We do not track users or use cookies.</p>
            </section>
        </div>
    );
};

export default Privacy;
