const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'gemma3:12b';

export const ollamaClient = {

    /**
     * Check if Ollama is reachable
     */
    checkConnection: async (baseUrl = DEFAULT_OLLAMA_URL) => {
        try {
            const response = await fetch(`${baseUrl}/api/tags`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            return response.ok;
        } catch (error) {
            console.warn("Ollama connection failed:", error);
            return false;
        }
    },

    /**
     * List available local models
     */
    listModels: async (baseUrl = DEFAULT_OLLAMA_URL) => {
        try {
            const response = await fetch(`${baseUrl}/api/tags`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) return [];
            const data = await response.json();
            return data.models || [];
        } catch (error) {
            console.warn("Failed to fetch models:", error);
            return [];
        }
    },

    /**
     * Generate a chat response
     */
    chat: async (baseUrl, model, messages, onChunk) => {
        try {
            const response = await fetch(`${baseUrl || DEFAULT_OLLAMA_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model || DEFAULT_MODEL,
                    messages: messages,
                    stream: true
                })
            });

            if (!response.ok) throw new Error('Ollama API error');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                // Ollama sends JSON objects one per line usually, or a stream.
                // We need to parse each JSON chunk.

                const lines = chunk.split('\n').filter(Boolean);
                for (const line of lines) {
                    try {
                        const json = JSON.parse(line);
                        if (json.message?.content) {
                            const content = json.message.content;
                            fullText += content;
                            if (onChunk) onChunk(content);
                        }
                        if (json.done) {
                            // finished
                        }
                    } catch (e) {
                        console.error("JSON parse error on chunk", e);
                    }
                }
            }
            return fullText;

        } catch (error) {
            console.error("Ollama Chat Error:", error);
            throw error;
        }
    },

    /**
     * Generate a one-off completion (wrapper for chat for consistency)
     */
    generate: async (baseUrl, prompt, systemContext) => {
        const messages = [
            { role: 'system', content: systemContext || 'You are a helpful DeFi assistant.' },
            { role: 'user', content: prompt }
        ];

        // Simple non-streaming wrapper
        let result = '';
        await ollamaClient.chat(baseUrl, DEFAULT_MODEL, messages, (chunk) => {
            result += chunk;
        });
        return result;
    }
};
