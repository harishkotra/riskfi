import React, { useState, useEffect } from 'react';
import { X, Save, Power, Server } from 'lucide-react';
import { ollamaClient } from '../services/ollamaClient';

const SettingsModal = ({ isOpen, onClose, config, onSave }) => {
    const [url, setUrl] = useState(config.ollamaUrl);
    const [enabled, setEnabled] = useState(config.aiEnabled);
    const [selectedModel, setSelectedModel] = useState(config.model || 'gemma3:12b');
    const [availableModels, setAvailableModels] = useState([]);
    const [testing, setTesting] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', null

    useEffect(() => {
        if (enabled) {
            fetchModels(url);
        }
    }, [url, enabled]);

    const fetchModels = async (baseUrl) => {
        const models = await ollamaClient.listModels(baseUrl);
        setAvailableModels(models);
    };

    if (!isOpen) return null;

    const handleTest = async () => {
        setTesting(true);
        setStatus(null);
        const success = await ollamaClient.checkConnection(url);
        if (success) await fetchModels(url);
        setStatus(success ? 'success' : 'error');
        setTesting(false);
    };

    const handleSave = () => {
        onSave({ ollamaUrl: url, aiEnabled: enabled, model: selectedModel });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="card w-full max-w-md bg-zinc-900 border border-zinc-700 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Server size={20} className="text-primary" />
                        AI Configuration
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                    {/* Toggle */}
                    <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${enabled ? 'bg-green-500/20 text-green-500' : 'bg-zinc-700 text-zinc-400'}`}>
                                <Power size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-white">Enable AI Analyst</p>
                                <p className="text-xs text-zinc-500">Connect to local LLM</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setEnabled(!enabled)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-zinc-600'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    {enabled && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Ollama URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="input-field w-full text-sm font-mono"
                                        placeholder="http://localhost:11434"
                                    />
                                    <button
                                        onClick={handleTest}
                                        disabled={testing}
                                        className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm border border-zinc-700"
                                    >
                                        {testing ? '...' : 'Test'}
                                    </button>
                                </div>
                                {status === 'success' && <p className="text-xs text-green-500 mt-1">✓ Connection successful</p>}
                                {status === 'error' && (
                                    <p className="text-xs text-red-500 mt-1">
                                        ✗ Connection failed. Run: <code className="bg-zinc-800 px-1 rounded">OLLAMA_ORIGINS="*" ollama serve</code>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">AI Model</label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="input-field w-full text-sm font-mono bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                                >
                                    {availableModels.length > 0 ? (
                                        availableModels.map(m => (
                                            <option key={m.name} value={m.name}>{m.name}</option>
                                        ))
                                    ) : (
                                        <option value={selectedModel}>{selectedModel} (Default)</option>
                                    )}
                                </select>
                                {availableModels.length === 0 && enabled && (
                                    <p className="text-[10px] text-zinc-500 mt-1">No models detected. Ensure Ollama is running.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 hover:bg-zinc-800 rounded-lg text-sm text-zinc-400">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary hover:bg-blue-600 rounded-lg text-sm font-bold text-white flex items-center gap-2">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
