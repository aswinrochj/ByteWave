'use client';

import { LucideBarChart2, LucideUsers, LucideTrendingUp, LucideAward, LucideArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const STAT_TILES = [
    { icon: LucideBarChart2, value: '78%', label: 'Avg Assessment Score', change: '+12%', bg: '#7c3aed', end: '#a855f7', glow: 'rgba(139,92,246,0.35)' },
    { icon: LucideUsers, value: '450', label: 'Active Students', change: '+5%', bg: '#0891b2', end: '#22d3ee', glow: 'rgba(6,182,212,0.35)' },
    { icon: LucideTrendingUp, value: '94%', label: 'Placement Rate', change: '+8%', bg: '#059669', end: '#34d399', glow: 'rgba(16,185,129,0.35)' },
    { icon: LucideAward, value: '#12', label: 'Regional Ranking', change: 'Top 5%', bg: '#d97706', end: '#fbbf24', glow: 'rgba(245,158,11,0.35)' },
];

const TrendChart = () => (
    <div className="flex items-end justify-between h-40 gap-1.5 mt-4">
        {[40, 65, 55, 80, 75, 90, 85, 95, 90, 100].map((h, i) => (
            <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: 'backOut' }}
                className="w-full rounded-t-lg relative group cursor-pointer"
                style={{ background: 'linear-gradient(180deg, rgba(168,85,247,0.7) 0%, rgba(168,85,247,0.15) 100%)', border: '1px solid rgba(168,85,247,0.2)', borderBottom: 'none' }}
                whileHover={{ background: 'linear-gradient(180deg, #a855f7 0%, rgba(168,85,247,0.3) 100%)' }}
            >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    style={{ background: 'rgba(168,85,247,0.9)', color: 'white' }}>
                    {h}%
                </div>
            </motion.div>
        ))}
    </div>
);

const SKILLS = [
    { name: 'Algorithms', val: 88, from: '#7c3aed', to: '#c084fc' },
    { name: 'System Design', val: 72, from: '#0891b2', to: '#22d3ee' },
    { name: 'Frontend', val: 94, from: '#db2777', to: '#f472b6' },
    { name: 'Databases', val: 65, from: '#d97706', to: '#fbbf24' },
    { name: 'Security', val: 58, from: '#dc2626', to: '#f87171' },
];

export default function InstitutionAnalyticsPage() {
    return (
        <div className="space-y-8">

            {/* ── HEADER ──────────────────────────── */}
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 18px rgba(168,85,247,0.4)' }}>
                    📊
                </div>
                <div>
                    <h1 className="text-2xl font-black text-foreground">Institutional Analytics</h1>
                    <p className="text-muted-foreground text-sm">Real-time performance and placement tracking</p>
                </div>
            </div>

            {/* ── STAT TILES ──────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {STAT_TILES.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="game-card p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${s.bg}, ${s.end})`, boxShadow: `0 0 16px ${s.glow}` }}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider"
                                    style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                                    ▲ {s.change}
                                </span>
                            </div>
                            <div className="text-3xl font-black text-foreground mb-0.5">{s.value}</div>
                            <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* ── CHARTS ──────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Performance Trend */}
                <div className="game-card p-6">
                    <div className="mb-2">
                        <h3 className="font-black text-foreground text-base flex items-center gap-2">
                            📈 Performance Trend
                        </h3>
                        <p className="text-muted-foreground text-xs mt-0.5">Average batch performance — last 10 weeks</p>
                    </div>
                    <TrendChart />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-3 font-mono uppercase tracking-wider">
                        <span>Week 1</span>
                        <span>Week 10</span>
                    </div>
                </div>

                {/* Skill Distribution */}
                <div className="game-card p-6">
                    <div className="mb-2 flex justify-between items-start">
                        <div>
                            <h3 className="font-black text-foreground text-base flex items-center gap-2">
                                🧬 Skill Distribution
                            </h3>
                            <p className="text-muted-foreground text-xs mt-0.5">Batch mastery across core domains</p>
                        </div>
                        <LucideArrowUpRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-4 mt-4">
                        {SKILLS.map((skill, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span className="text-foreground">{skill.name}</span>
                                    <span style={{ color: skill.to }}>{skill.val}%</span>
                                </div>
                                <div className="xp-bar" style={{ background: `rgba(${skill.from.replace('#', '').match(/.{2}/g)?.map(h => parseInt(h, 16)).join(',') ?? '168,85,247'},0.12)` }}>
                                    <motion.div
                                        className="xp-bar-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.val}%` }}
                                        transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                                        style={{ background: `linear-gradient(90deg, ${skill.from}, ${skill.to})` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
