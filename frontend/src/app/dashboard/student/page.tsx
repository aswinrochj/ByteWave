'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SkillRadar } from '@/components/charts/SkillRadar';
import { GrowthLineChart } from '@/components/charts/GrowthLineChart';
import {
    Trophy, TrendingUp, Zap, Target, BookOpen, MessageSquare,
    CheckCircle, Lock, Star, Flame, GraduationCap, Brain
} from 'lucide-react';

const StudentDashboard = () => {
    return (
        <div className="space-y-6">
            {/* Header Stats & Level */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <div className="md:col-span-3 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-2xl p-6 border border-teal-500/20 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Trophy className="w-32 h-32 text-teal-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Alex! 👋</h1>
                        <p className="text-slate-400">You're on a 5-day coding streak. Keep it up!</p>
                    </div>
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-teal-400 font-semibold">Level 12: Algorithm Architect</span>
                            <span className="text-slate-400">2,450 / 3,000 XP</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '82%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="bg-gradient-to-r from-teal-400 to-blue-500 h-2.5 rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse w-full h-full"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-orange-500/20 rounded-full">
                        <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-white">5 Days</h3>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Current Streak</p>
                    </div>
                </div>
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* DNA Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Skill DNA
                        </h3>
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Beta v2.1</span>
                    </div>
                    <div className="flex-1 min-h-[300px] relative">
                        <SkillRadar />
                    </div>
                </motion.div>

                {/* Growth & Metrics */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Logic Depth', value: '92', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            { label: 'Optimization', value: '85', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
                            { label: 'Consistency', value: '98%', icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { label: 'Reward Coins', value: '450', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center hover:bg-slate-800/80 transition-colors">
                                <div className={`p-2 rounded-lg mb-2 ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <span className="text-2xl font-bold text-white">{stat.value}</span>
                                <span className="text-xs text-slate-400">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Growth Chart */}
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 h-[300px] flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Skill Growth Trajectory
                        </h3>
                        <div className="flex-1 w-full h-full">
                            <GrowthLineChart />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer / Activities */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Next Milestones</h3>
                        <button className="text-xs text-teal-400 hover:text-teal-300">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: 'Complete "Advanced Recursion"', xp: '+50 XP', status: 'In Progress' },
                            { title: 'Solve 3 Dynamic Programming Probs', xp: '+120 XP', status: 'Pending' },
                            { title: 'Review Code Structure Analysis', xp: '+30 XP', status: 'Locked' },
                        ].map((task, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-teal-500/30 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${task.status === 'In Progress' ? 'bg-yellow-400 animate-pulse' : task.status === 'Locked' ? 'bg-slate-600' : 'bg-slate-400'}`} />
                                    <span className={`text-sm font-medium ${task.status === 'Locked' ? 'text-slate-500' : 'text-slate-200'}`}>{task.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-yellow-500">{task.xp}</span>
                                    {task.status === 'Locked' && <Lock className="w-3 h-3 text-slate-500" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                    <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
                    <div className="z-10 bg-indigo-500/20 p-4 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white z-10">AI Coding Mentor</h3>
                    <p className="text-sm text-indigo-200 mb-6 z-10 max-w-xs">Stuck on a problem or need optimization tips? Ask your personal AI logic coach.</p>
                    <button className="z-10 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20">
                        Start Session
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentDashboard;
