'use client';

import React from 'react';

export const Heatmap = () => {
    // Mock Data: 5 Weeks (rows) x 7 Days (columns) or Students vs Topics
    // Let's do Students (y) vs Weeks (x)
    const rows = 8; // Students
    const cols = 12; // Weeks

    const getIntensity = () => {
        return Math.random(); // 0 to 1
    };

    const getColor = (intensity: number) => {
        // Teal gradient
        if (intensity < 0.2) return 'bg-slate-800';
        if (intensity < 0.4) return 'bg-teal-900/40';
        if (intensity < 0.6) return 'bg-teal-700/60';
        if (intensity < 0.8) return 'bg-teal-500/80';
        return 'bg-teal-400';
    };

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
                <div className="flex mb-2">
                    <div className="w-20"></div>
                    {Array.from({ length: cols }).map((_, i) => (
                        <div key={i} className="flex-1 text-center text-xs text-slate-500">W{i + 1}</div>
                    ))}
                </div>
                {Array.from({ length: rows }).map((_, r) => (
                    <div key={r} className="flex mb-1 gap-1">
                        <div className="w-20 text-xs text-slate-400 flex items-center">Student {r + 1}</div>
                        {Array.from({ length: cols }).map((_, c) => {
                            const intensity = getIntensity();
                            return (
                                <div
                                    key={c}
                                    className={`flex-1 h-8 rounded-sm ${getColor(intensity)} hover:scale-105 transition-transform cursor-pointer relative group`}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                        Score: {Math.round(intensity * 100)}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
