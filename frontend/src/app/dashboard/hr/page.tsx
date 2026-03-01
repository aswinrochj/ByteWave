'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Filter, CheckCircle, Search, Download } from 'lucide-react';
import { PipelineFunnelChart } from '@/components/charts/PipelineFunnelChart';
import { SkillRadar } from '@/components/charts/SkillRadar';

const applicants = [
    { id: 1, name: 'Sarah Chen', role: 'Frontend Engineer', score: 94, tags: ['React', 'Optimized Logic', 'UI/UX'] },
    { id: 2, name: 'Michael Ross', role: 'Backend Developer', score: 88, tags: ['Node.js', 'System Design', 'API'] },
    { id: 3, name: 'David Kim', role: 'Full Stack', score: 82, tags: ['TypeScript', 'Database', 'Cloud'] },
];

const HRDashboard = () => {
    // Custom data for comparison radar (Example: Candidate vs Requirement)
    const comparisonData = {
        labels: ['Logic', 'Algorithm', 'System Design', 'Debugging', 'Optimization', 'Testing'],
        datasets: [
            {
                label: 'Candidate (Sarah)',
                data: [90, 85, 75, 95, 88, 92],
                backgroundColor: 'rgba(20, 184, 166, 0.4)',
                borderColor: 'rgba(20, 184, 166, 1)',
                pointBackgroundColor: '#fff',
            },
            {
                label: 'Role Requirement',
                data: [80, 80, 70, 85, 80, 85],
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                borderColor: 'rgba(244, 63, 94, 0.6)',
                borderDash: [5, 5],
            }
        ],
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Talent Intelligence</h1>
                    <p className="text-slate-400">AI-verified candidates for Senior Frontend Engineer</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-lg shadow-teal-500/20">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pipeline Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col"
                >
                    <h3 className="text-lg font-semibold text-white mb-6">Hiring Pipeline</h3>
                    <div className="flex-1 min-h-[250px]">
                        <PipelineFunnelChart />
                    </div>
                </motion.div>

                {/* Candidate Comparison / Highlight */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Top Match Analysis</h3>
                    <div className="flex-1 min-h-[250px] relative">
                        <SkillRadar data={comparisonData} />
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-slate-400">Sarah exceeds role requirements by <span className="text-teal-400 font-bold">+12%</span></p>
                    </div>
                </motion.div>
            </div>

            {/* Candidate List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xl font-bold text-white">Recommended Candidates</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by skill..."
                            className="bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500 w-64 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {applicants.map((applicant, i) => (
                        <motion.div
                            key={applicant.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/60 hover:border-teal-500/30 transition-all group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                                        {applicant.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white group-hover:text-teal-400 transition-colors">{applicant.name}</h4>
                                        <p className="text-xs text-slate-400">{applicant.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-teal-400 bg-teal-500/10 px-2 py-1 rounded text-xs font-bold">
                                    <CheckCircle className="w-3 h-3" />
                                    {applicant.score}%
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {applicant.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wide bg-slate-700/50 text-slate-300 px-2 py-1 rounded border border-slate-600/50">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <button className="w-full py-2 bg-slate-700 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors">
                                View Full Profile
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;
