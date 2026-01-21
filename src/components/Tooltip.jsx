import React, { useState } from 'react';
import { Info } from 'lucide-react';

const Tooltip = ({ text, children }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-flex items-center gap-1 group">
            {children}
            <button
                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-help"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                aria-label="More info"
            >
                <Info size={14} />
            </button>

            {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                    {text}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-700" />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
