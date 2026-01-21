import React from 'react';
import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full border-t border-zinc-800 mt-20 py-8 text-center text-sm text-zinc-500">
            <div className="flex flex-col gap-4 items-center">
                <p className="flex items-center gap-2">
                    Built by <span className="text-white font-semibold">Harish Kotra</span>
                </p>

                <div className="flex gap-6">
                    <a
                        href="https://github.com/harishkotra"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                        <Github size={16} /> github.com/harishkotra
                    </a>
                </div>

                <div className="flex gap-4 text-xs">
                    <Link to="/terms" className="hover:text-zinc-300">Terms of Service</Link>
                    <span className="text-zinc-700">•</span>
                    <Link to="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
                </div>

                <p className="text-[10px] text-zinc-600 max-w-md mx-auto">
                    Data provided by DefiLlama. This application is for informational purposes only and does not constitute financial advice.
                    The developer assumes no liability for the accuracy of the data or decisions made based on it.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
