import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { ollamaClient } from '../services/ollamaClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatInterface = ({ isOpen, onClose, config, contextData, isFullPage = false }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your DeFi Risk Analyst. I have access to the dashboard data. Ask me anything about the market or specific protocols.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !config.aiEnabled) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Prepare context
            let systemPrompt = "You are an expert DeFi Analyst. Answer based on the provided data context if relevant.";
            if (contextData) {
                systemPrompt += `\n\nCURRENT DASHBOARD DATA:\n${JSON.stringify(contextData, null, 2)}`;
            }

            const history = [
                { role: 'system', content: systemPrompt },
                ...messages,
                userMsg
            ];

            // Streaming response
            let fullResponse = '';
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            await ollamaClient.chat(config.ollamaUrl, config.model, history, (chunk) => {
                fullResponse += chunk;
                setMessages(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].content = fullResponse;
                    return newHistory;
                });
            });

        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Connection error. Is Ollama running?" }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen && !isFullPage) return (
        <button
            onClick={onClose} // acts as toggle open
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 z-40"
        >
            <MessageSquare size={24} />
        </button>
    );

    const containerClasses = isFullPage
        ? "w-full h-full bg-zinc-900 flex flex-col" // Embedded style
        : "fixed bottom-6 right-6 w-96 h-[500px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden"; // Fixed Modal style

    return (
        <div className={containerClasses}>
            {/* Header */}
            <div className="p-4 bg-zinc-800 border-b border-zinc-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
                        <Bot size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">AI Analyst</h3>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Online ({config.model || 'gemma3:12b'})
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-zinc-700' : 'bg-primary/20 text-primary'}`}>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`rounded-2xl p-3 text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-blue-500/10 text-zinc-200'}`}>
                            <div className="prose prose-invert prose-sm max-w-none">
                                {msg.content ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                ) : (
                                    <span className="animate-pulse">...</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-2 items-center text-zinc-500 text-xs ml-11">
                        <Sparkles size={12} className="animate-spin" /> Thinking...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-zinc-800/50 border-t border-zinc-800">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about risk, trends..."
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-lg disabled:opacity-50 disabled:bg-zinc-700"
                    >
                        <Send size={16} />
                    </button>
                </div>
                {!config.aiEnabled && (
                    <p className="text-xs text-red-400 mt-2 text-center">AI is disabled. Check Settings.</p>
                )}
            </form>
        </div>
    );
};

export default ChatInterface;
