'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Heatmap } from '@/components/charts/Heatmap';
import { GrowthLineChart } from '@/components/charts/GrowthLineChart'; // Reusing for content

const InstitutionDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Academic Console</h1>
                    <p className="text-slate-400">Batch 2024 - Computer Science Performance</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-300 border border-slate-700">
                        Term: <span className="text-white font-bold">Fall 2024</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Students', value: '1,240', icon: Users, color: 'text-blue-400' },
                    { label: 'Avg. Logic Score', value: '78%', icon: TrendingUp, color: 'text-green-400' },
                    { label: 'Assessment Comp.', value: '92%', icon: BookOpen, color: 'text-purple-400' },
                    { label: 'At Risk', value: '12', icon: GraduationCap, color: 'text-red-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-lg bg-slate-700/30 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Heatmap Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">Class Performance Heatmap</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <div className="w-3 h-3 bg-slate-800 rounded-sm"></div> Low
                            <div className="w-3 h-3 bg-teal-400 rounded-sm"></div> High
                        </div>
                    </div>
                    <div className="flex-1 w-full overflow-x-auto">
                        <Heatmap />
                    </div>
                </motion.div>

                {/* Engagement / Alerts */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-1 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Engagement Trend</h3>
                    <div className="flex-1 h-[200px] mb-4">
                        <GrowthLineChart />
                    </div>

                    <div className="space-y-3 mt-4">
                        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Alerts</h4>
                        {[
                            { msg: '3 Students dropped below 50% accuracy', time: '2h ago', type: 'critical' },
                            { msg: 'System Design Assessment Published', time: '5h ago', type: 'info' },
                        ].map((alert, idx) => (
                            <div key={idx} className="flex gap-3 text-sm p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                                <div className={`w-2 h-2 mt-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} />
                                <div>
                                    <p className="text-slate-200">{alert.msg}</p>
                                    <span className="text-xs text-slate-500">{alert.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InstitutionDashboard;
