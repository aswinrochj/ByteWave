'use client';

import { useState, useEffect } from 'react';
import { LucideCpu } from 'lucide-react';

export default function LoadingScreen() {
    const [statusIndex, setStatusIndex] = useState(0);
    const MESSAGES = [
        "Initializing Neural Interface...",
        "Synchronizing Developer DNA...",
        "Allocating Quantum Compute...",
        "Verifying Signal Integrity...",
        "Optimizing Logic Patterns...",
        "Bypassing Firewall Clusters...",
        "Brewing Digital Excellence..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#030014]">
            {/* ── BACKGROUND LAYER ────────────────── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-pink-600/5 rounded-full blur-[100px]" />
            </div>

            {/* ── NEURAL CORE ANIMATION ───────────── */}
            <div className="relative group perspective-1000 scale-110 md:scale-125 lg:scale-150">
                {/* Outer Ring 1 - Clockwise */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-purple-500/20 rotate-12"
                    style={{ animation: 'spin-slow 15s linear infinite' }} />

                {/* Outer Ring 2 - Slow Counter-Clockwise */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-dashed border-indigo-400/10"
                    style={{ animation: 'rotate-reverse 20s linear infinite' }} />

                {/* Neural Pulse Field */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-purple-500/5"
                    style={{ animation: 'neural-pulse 4s ease-in-out infinite' }} />

                {/* Central Focus */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#0a0a1f] border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.2)] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />

                    {/* The BW Text Logo */}
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-2xl font-black text-white italic tracking-tighter leading-none">BW</span>
                        <div className="w-6 h-0.5 bg-purple-500 mt-1 rounded-full shadow-[0_0_8px_rgba(168,85,247,1)]" />
                    </div>

                    {/* Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                        style={{ animation: 'progress 2s linear infinite' }} />
                </div>
            </div>

            {/* ── STATUS TEXT ─────────────────────── */}
            <div className="mt-20 flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                    <LucideCpu className="w-5 h-5 text-purple-400 animate-pulse" />
                    <div className="h-6 flex items-center">
                        <p className="text-white/90 font-bold tracking-widest uppercase text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-[text-reveal_0.5s_ease-out_forwards]"
                            key={statusIndex}>
                            {MESSAGES[statusIndex]}
                        </p>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="relative w-64 h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                    {/* Inner Progress Fill */}
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                        style={{ width: '100%', animation: 'progress 4s cubic-bezier(0.65, 0.05, 0.36, 1) infinite' }} />

                    {/* Shadow/Glow under bar */}
                    <div className="absolute inset-0 shadow-[inset_0_0_4px_rgba(255,255,255,0.1)]" />
                </div>

                <div className="flex gap-4 opacity-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
            </div>

            <p className="absolute bottom-10 text-white/20 text-[10px] font-medium tracking-[0.3em] uppercase italic">
                ByteWave Pro · Next Gen Talent Protocol
            </p>
        </div>
    );
}
