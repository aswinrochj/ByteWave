'use client';

import { recruiterMetrics, recentCandidates, activeJobs, LEADERBOARD_MEMBERS } from "@/lib/mock-data";
import {
    LucideBriefcase, LucideUsers, LucideCalendar, LucideClock,
    LucideZap, LucideStar, LucideTrendingUp, LucideTarget, LucideX,
    LucideCircuitBoard, LucideVideo, LucideLoader2, LucideFilter,
    LucideSearch
} from "lucide-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const METRIC_ICONS = [LucideBriefcase, LucideUsers, LucideCalendar, LucideClock];
const METRIC_GRADIENTS = [
    { from: '#7c3aed', to: '#a855f7', glow: 'rgba(139,92,246,0.35)' },
    { from: '#0891b2', to: '#22d3ee', glow: 'rgba(6,182,212,0.35)' },
    { from: '#d97706', to: '#fbbf24', glow: 'rgba(245,158,11,0.35)' },
    { from: '#059669', to: '#34d399', glow: 'rgba(16,185,129,0.35)' },
];

const ALL_TALENT = LEADERBOARD_MEMBERS.map(m => ({
    id: `talent-${m.id}`,
    name: m.name,
    email: `${m.username.replace('@', '')}@talentcloud.ai`,
    role: m.role === 'Student' ? 'Software Engineer' : m.role,
    matchScore: m.skill_score,
    skills: m.languages,
    avatar: m.avatar
}));

const getMatchColor = (score: number) => {
    if (score >= 85) return { text: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', label: 'Strong' };
    if (score >= 65) return { text: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', label: 'Moderate' };
    if (score >= 40) return { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', label: 'Low' };
    return { text: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', label: 'Weak' };
};

export default function RecruiterDashboard() {
    const [isAddPositionOpen, setIsAddPositionOpen] = useState(false);
    const [isTalentSearchOpen, setIsTalentSearchOpen] = useState(false);
    const [skillQuery, setSkillQuery] = useState('');
    const [jobs, setJobs] = useState(activeJobs);
    const router = useRouter();

    // Filtered talent logic
    const filteredTalent = (ALL_TALENT || []).filter(t => {
        const query = skillQuery.toLowerCase().trim();
        if (!query) return true;

        return (
            t.name.toLowerCase().includes(query) ||
            t.role.toLowerCase().includes(query) ||
            t.skills.some(s => s.toLowerCase().includes(query))
        );
    }).sort((a, b) => b.matchScore - a.matchScore);

    // New position form state
    const [newPosTitle, setNewPosTitle] = useState('');
    const [newPosDept, setNewPosDept] = useState('Engineering');



    const handleAddPosition = () => {
        if (!newPosTitle) return;
        const newJob = {
            id: jobs.length + 1,
            title: newPosTitle,
            applicants: 0,
            status: 'Active'
        };
        setJobs([newJob, ...jobs]);
        setNewPosTitle('');
        setIsAddPositionOpen(false);
    };

    return (
        <div className="space-y-8 min-h-screen pb-10">

            {/* ── HERO ──────────────────────────────── */}
            <div
                className="rounded-2xl p-6 relative overflow-hidden scanlines"
                style={{ background: 'linear-gradient(135deg, #0b0f1e 0%, #140b2e 50%, #0a1520 100%)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-48 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                    <div>
                        <h1 className="text-2xl font-black text-white mb-1 lowercase">Recruiter <span className="text-purple-400">Command</span></h1>
                        <p className="text-purple-300/50 text-sm">Manage your hiring pipeline with AI-powered insights.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsTalentSearchOpen(true)}
                            className="h-10 text-xs font-bold px-5"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 0 14px rgba(168,85,247,0.4)' }}
                        >
                            <LucideSearch className="mr-2 h-4 w-4" /> Talent Search
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── METRIC CARDS ──────────────────────── */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {recruiterMetrics.map((metric, i) => {
                    const Icon = METRIC_ICONS[i];
                    const g = METRIC_GRADIENTS[i];
                    return (
                        <div
                            key={i}
                            className={cn("game-card p-5 transition-all", i === 0 && "cursor-pointer hover:border-purple-500/50 group/metric")}
                            onClick={() => i === 0 && setIsAddPositionOpen(true)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover/metric:scale-110"
                                    style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})`, boxShadow: `0 0 16px ${g.glow}` }}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                {i === 0 ? (
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover/metric:bg-purple-500 group-hover/metric:text-white transition-all">
                                        <LucideZap className="w-3 h-3" />
                                    </div>
                                ) : (
                                    <span
                                        className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider"
                                        style={{ background: metric.trend === 'up' ? 'rgba(52,211,153,0.12)' : 'rgba(148,163,184,0.1)', color: metric.trend === 'up' ? '#34d399' : '#94a3b8', border: `1px solid ${metric.trend === 'up' ? 'rgba(52,211,153,0.3)' : 'rgba(148,163,184,0.2)'}` }}
                                    >
                                        {metric.trend === 'up' ? '▲' : '→'} {metric.change}
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">{metric.title}</p>
                            <div className="text-2xl font-black text-foreground flex items-center justify-between">
                                {metric.value}
                                {i === 0 && <span className="text-[9px] font-black italic text-purple-400 opacity-0 group-hover/metric:opacity-100 transition-opacity uppercase">Hire Now</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── MAIN GRID ──────────────────────────── */}
            <div className="grid gap-6 lg:grid-cols-7">

                {/* Recent Candidates */}
                <div className="col-span-4 game-card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <LucideUsers className="w-5 h-5 text-purple-400" />
                            <h3 className="font-black text-foreground">Recent Candidates</h3>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-purple-400 border border-purple-500/30" style={{ background: 'rgba(168,85,247,0.1)' }}>
                            {recentCandidates.length} new
                        </span>
                    </div>
                    <div className="space-y-3">
                        {recentCandidates.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => router.push(`/recruiter/candidates?sent=${c.id}`)}
                                className="flex items-center justify-between p-3 rounded-xl transition-colors group block cursor-pointer"
                                style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                                        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.1))', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                                        {c.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">{c.name}</p>
                                        <p className="text-xs text-muted-foreground">{c.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm font-black text-purple-400">{c.matchScore}% Match</div>
                                        <div className="text-[10px] text-muted-foreground">{c.skills.slice(0, 2).join(' · ')}</div>
                                    </div>
                                    <span
                                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                                        style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}
                                    >
                                        {c.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Jobs */}
                <div className="col-span-3 game-card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <LucideBriefcase className="w-5 h-5 text-cyan-400" />
                            <h3 className="font-black text-foreground">Active Jobs</h3>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[9px] font-black uppercase tracking-widest border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                            onClick={() => setIsAddPositionOpen(true)}
                        >
                            + Add Position
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div key={job.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0" style={{ borderColor: 'var(--border)' }}>
                                <div>
                                    <div className="font-black text-foreground text-sm">{job.title}</div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>Remote</span>
                                        <span>Posted 2d ago</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className="text-sm font-black text-foreground">{job.applicants}</span>
                                    <span
                                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={job.status === 'Active'
                                            ? { background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }
                                            : { background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}
                                    >
                                        {job.status === 'Active' ? '● Active' : '⏸ Hold'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/recruiter/jobs" className="block w-full">
                        <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                            View All Jobs →
                        </Button>
                    </Link>
                </div>
            </div>


            {/* ── TALENT SEARCH MODAL ──────────────── */}
            {isTalentSearchOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsTalentSearchOpen(false)} />
                    <div className="relative w-full max-w-2xl game-card p-6 space-y-6 animate-in zoom-in-95 duration-200 border-purple-500/30">
                        <div className="flex justify-between items-center text-white">
                            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter italic">
                                <LucideUsers className="w-5 h-5 text-purple-400" /> Talent Skill Search
                            </h2>
                            <button onClick={() => setIsTalentSearchOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                <LucideX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search by skill (e.g. Python, React, Go)..."
                                    value={skillQuery}
                                    onChange={e => setSkillQuery(e.target.value)}
                                    className="w-full bg-black/40 border border-purple-500/20 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-purple-300/20"
                                />
                            </div>

                            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {filteredTalent.length > 0 ? (
                                    filteredTalent.map(t => {
                                        const visual = getMatchColor(t.matchScore);
                                        const query = skillQuery.toLowerCase().trim();
                                        return (
                                            <div
                                                key={t.id}
                                                onClick={() => {
                                                    const confirms = window.confirm(`Send introductory email to ${t.name}?`);
                                                    if (confirms) {
                                                        const cleanId = t.id.toString().replace('talent-', '').replace('pool-', '');
                                                        router.push(`/recruiter/candidates?sent=${cleanId}`);
                                                    }
                                                }}
                                                className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center font-black text-sm text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                                                        {t.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-white">{t.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t.role}</div>
                                                        <div className="flex gap-1.5 mt-1">
                                                            {t.skills.map(s => (
                                                                <span key={s} className={cn(
                                                                    "text-[8px] font-black px-1.5 py-0.5 rounded border uppercase",
                                                                    query && s.toLowerCase().includes(query)
                                                                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                                                        : "bg-white/5 text-white/40 border-white/10"
                                                                )}>
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-black italic" style={{ color: visual.text }}>{t.matchScore}%</div>
                                                    <div className="text-[9px] font-black uppercase text-white/30 tracking-tighter">{visual.label} Match</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-12 flex flex-col items-center justify-center gap-3 opacity-30 grayscale">
                                        <LucideFilter className="w-10 h-10 text-purple-400" />
                                        <p className="text-xs font-black uppercase tracking-widest text-white">No matches found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ── ADD POSITION MODAL ──────────────── */}
            {isAddPositionOpen && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setIsAddPositionOpen(false)} />
                    <div className="relative w-full max-w-md game-card p-8 space-y-6 animate-in zoom-in-95 duration-200 border-cyan-500/30 shadow-[0_0_80px_rgba(34,211,238,0.2)]">
                        <div className="flex justify-between items-center text-white">
                            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter italic">
                                <LucideBriefcase className="w-5 h-5 text-cyan-400" /> New Position
                            </h2>
                            <button onClick={() => setIsAddPositionOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                <LucideX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-cyan-300/50">Internal Job Title</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Lead UI Architect"
                                    value={newPosTitle}
                                    onChange={e => setNewPosTitle(e.target.value)}
                                    className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/50 transition-all text-white shadow-inner"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-cyan-300/50">Department</label>
                                <select
                                    value={newPosDept}
                                    onChange={e => setNewPosDept(e.target.value)}
                                    className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/50 transition-all text-white shadow-inner"
                                >
                                    <option>Engineering</option>
                                    <option>Product</option>
                                    <option>Design</option>
                                    <option>Marketing</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            className="w-full py-7 font-black uppercase tracking-widest text-xs mt-2"
                            style={{ background: 'linear-gradient(135deg, #0891b2, #22d3ee)', color: '#fff', border: 'none', boxShadow: '0 0 15px rgba(34,211,238,0.4)' }}
                            onClick={handleAddPosition}
                        >
                            Open Requisition
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
