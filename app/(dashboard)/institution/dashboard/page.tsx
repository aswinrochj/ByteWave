'use client';

import { institutionMetrics, institutionTopStudents, recentAssessments } from "@/lib/mock-data";
import { LucideActivity, LucideUsers, LucideTrendingUp, LucideTarget, LucideAward, LucideBarChart2, LucideZap, LucideGraduationCap, LucideTrophy } from "lucide-react";
import { cn } from '@/lib/utils';

const METRIC_CONFIG = [
    { icon: LucideUsers, gradient: 'from #7c3aed to #a855f7', bg: '#7c3aed', end: '#a855f7', glow: 'rgba(139,92,246,0.35)' },
    { icon: LucideZap, bg: '#d97706', end: '#fbbf24', glow: 'rgba(245,158,11,0.35)' },
    { icon: LucideTrendingUp, bg: '#0891b2', end: '#22d3ee', glow: 'rgba(6,182,212,0.35)' },
    { icon: LucideAward, bg: '#059669', end: '#34d399', glow: 'rgba(16,185,129,0.35)' },
];

interface TopStudent {
    id: number;
    name: string;
    roll: string;
    score: number;
}

const getRankLabel = (score: number) => score >= 96 ? 'S' : score >= 93 ? 'A' : score >= 90 ? 'B' : 'C';
const rankClass = (r: string) => r === 'S' ? 'rank-s' : r === 'A' ? 'rank-a' : r === 'B' ? 'rank-b' : 'rank-c';

export default function InstitutionDashboard() {
    return (
        <div className="space-y-8">

            {/* ── HERO ──────────────────────────────── */}
            <div
                className="rounded-2xl p-6 relative overflow-hidden scanlines"
                style={{ background: 'linear-gradient(135deg, #0b0f1e 0%, #0f1a2e 50%, #091022 100%)', border: '1px solid rgba(14,165,233,0.2)' }}
            >
                <div className="absolute top-0 right-1/3 w-64 h-48 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                    <div>
                        <h1 className="text-2xl font-black text-white mb-1">Institution Command</h1>
                        <p className="text-sky-300/50 text-sm">Overview of academic performance and engagement metrics.</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2" style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)', color: '#38bdf8' }}>
                        <LucideGraduationCap className="w-4 h-4" /> Spring Semester 2026
                    </span>
                </div>
            </div>

            {/* ── METRIC CARDS ───────────────────────── */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {institutionMetrics.map((metric, i) => {
                    const cfg = METRIC_CONFIG[i];
                    const Icon = cfg.icon;
                    return (
                        <div key={i} className="game-card p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${cfg.bg}, ${cfg.end})`, boxShadow: `0 0 16px ${cfg.glow}` }}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span
                                    className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider"
                                    style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}
                                >
                                    ▲ {metric.change}
                                </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">{metric.title}</p>
                            <div className="text-2xl font-black text-foreground">{metric.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* ── MAIN GRID ──────────────────────────── */}
            <div className="grid gap-6 lg:grid-cols-7">

                {/* Top Students Leaderboard */}
                <div className="col-span-4 game-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <LucideTrophy className="w-5 h-5 text-amber-400" />
                        <h3 className="font-black text-foreground">Institute Internal Leaderboard</h3>
                    </div>
                    <div className="space-y-3">
                        {institutionTopStudents.map((student: TopStudent, i: number) => {
                            const rank = getRankLabel(student.score);
                            return (
                                <div key={student.id} className="flex items-center gap-4 p-3 rounded-xl transition-all group"
                                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                >
                                    {/* Rank number */}
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                                        style={{
                                            background: i === 0 ? 'rgba(251,191,36,0.2)' : i === 1 ? 'rgba(148,163,184,0.15)' : i === 2 ? 'rgba(180,83,9,0.2)' : 'rgba(168,85,247,0.1)',
                                            color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#c084fc',
                                            border: `1px solid ${i === 0 ? 'rgba(251,191,36,0.4)' : i === 1 ? 'rgba(148,163,184,0.3)' : i === 2 ? 'rgba(180,83,9,0.3)' : 'rgba(168,85,247,0.2)'}`,
                                        }}
                                    >
                                        #{i + 1}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                                        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(192,132,252,0.1))', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                                        {student.name.charAt(0)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-foreground truncate">{student.name}</p>
                                        <p className="text-[11px] text-muted-foreground font-mono">{student.roll}</p>
                                    </div>

                                    {/* Score + Rank */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="text-right">
                                            <div className="text-sm font-black text-foreground">{student.score}%</div>
                                        </div>
                                        <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase", rankClass(rank))}>
                                            {rank}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Assessments */}
                <div className="col-span-3 game-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <LucideBarChart2 className="w-5 h-5 text-cyan-400" />
                        <h3 className="font-black text-foreground">Recent Assessments</h3>
                    </div>
                    <div className="space-y-5">
                        {recentAssessments.map((a) => (
                            <div key={a.id}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm font-black text-foreground truncate pr-2">{a.name}</div>
                                    <span className="text-xs font-bold text-cyan-400 shrink-0">{a.avgScore}%</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                                    <span>{a.participants} participants</span>
                                    <span className="font-mono">{a.date}</span>
                                </div>
                                <div className="xp-bar" style={{ background: 'rgba(14,165,233,0.1)' }}>
                                    <div className="xp-bar-fill" style={{ width: `${a.avgScore}%`, background: 'linear-gradient(90deg, #0891b2, #22d3ee)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
