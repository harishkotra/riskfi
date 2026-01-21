import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare } from 'lucide-react';

const ChatPage = ({ config, contextData }) => {
    // We'll wrap the existing ChatInterface but force it open and remove the absolute positioning/modal style if possible, 
    // OR just render a new dedicated view using the same logic. 
    // For speed and consistency, I will re-use ChatInterface but perhaps we can pass a prop `isFullPage` to style it differently?
    // Actually, creating a wrapper that manages the "Open" state is easier.

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <MessageSquare className="text-primary" size={32} />
                    AI Risk Analyst
                </h1>
                <p className="text-zinc-500">Deep dive into DeFi risks with your local LLM.</p>
            </div>

            {/* 
           We will cheat a bit and just mount the ChatInterface as a static element 
           by stripping its fixed positioning via a container or just modifying ChatInterface to accept className overrides.
           Since I cannot easily modify ChatInterface in this turn without viewing it again, 
           I will create a context-aware wrapper.
       */}

            <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-10">
                    <MessageSquare size={200} />
                </div>

                {/* 
              We'll use a slightly different approach: 
              We want the chat to be "always on" here.
              The current ChatInterface is built as a popover. 
              Let's create a *new* CleanChat component or simply reuse the logic?
              Reuse is better. Let's make it fixed open.
           */}
                <div className="relative z-10 w-full h-full p-4">
                    <ChatInterface
                        isOpen={true}
                        onClose={() => { }} // No-op
                        config={config}
                        contextData={contextData} /* Pass global market context */
                        isFullPage={true} // We will need to update ChatInterface to handle this to strip the modal styles
                    />
                </div>
            </div>

            {/* Starter Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {['Analyze the stablecoin market', 'Compare Aave vs Compound risks', 'Explain "Impermanent Loss"'].map(prompt => (
                    <button
                        key={prompt}
                        onClick={() => { /* logic to inject into chat would need state lift, simple copy for now */
                            navigator.clipboard.writeText(prompt);
                            alert("Copied directly to clipboard! Paste in chat.");
                        }}
                        className="p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-primary/50 rounded-xl text-left transition-all group"
                    >
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white block mb-1">Prompt</span>
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400">"{prompt}"</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChatPage;
