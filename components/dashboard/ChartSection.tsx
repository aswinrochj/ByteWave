'use client';

import React from 'react';
import { LucideTrendingUp, LucideMoreHorizontal } from 'lucide-react';

const ChartSection = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Growth Overview</h3>
                    <p className="text-sm text-gray-400 mt-1">Activity insights across the platform</p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="bg-gray-50 border border-gray-100 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 transition-all">
                        <option>Last 30 Days</option>
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                    </select>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <LucideMoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full bg-blue-50/30 rounded-2xl border border-dashed border-blue-100 flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Abstract Chart Representation */}
                <div className="absolute inset-x-0 bottom-0 h-40 flex items-end justify-around px-8">
                    {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85, 45, 75].map((h, i) => (
                        <div
                            key={i}
                            className="w-full mx-1 bg-blue-100 group-hover:bg-blue-200 transition-all duration-500 rounded-t-lg"
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>

                {/* Line overlay simulation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <path
                        d="M0,200 Q150,50 300,180 T600,100 T900,150 T1200,80"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-50"
                    />
                </svg>

                <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="p-3 bg-white rounded-2xl shadow-xl shadow-blue-100/50">
                        <LucideTrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-blue-600 font-semibold text-sm">Real-time Analytics Feed</p>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between py-4 border-t border-gray-50">
                <div className="flex gap-8">
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Revenue</p>
                        <p className="text-lg font-bold text-gray-800 mt-1">$128,430</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Active Users</p>
                        <p className="text-lg font-bold text-gray-800 mt-1">45,200</p>
                    </div>
                </div>
                <button className="text-blue-600 font-semibold text-sm hover:underline">View Detailed Report →</button>
            </div>
        </div>
    );
};

export default ChartSection;
