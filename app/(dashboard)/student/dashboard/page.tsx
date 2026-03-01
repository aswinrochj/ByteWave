'use client';

import { useState, useEffect } from 'react';
import { LucideAtom, LucideBrain, LucideZap, LucideTrendingUp, LucideArrowRight, LucideSwords, LucideStar, LucideShield, LucideClock, LucideFilter, LucideMail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_CHALLENGES } from "@/lib/mock-data";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSkillIntelligence } from "@/components/providers/SkillIntelligenceProvider";
import { useUser } from '@/components/providers/UserProvider';

const RANK_LABELS = ['C', 'B', 'A', 'S'];
const getRank = (score: number) => score >= 90 ? 'S' : score >= 75 ? 'A' : score >= 60 ? 'B' : 'C';
const rankClass = (r: string) => r === 'S' ? 'rank-s' : r === 'A' ? 'rank-a' : r === 'B' ? 'rank-b' : 'rank-c';

const DIFF_COLORS: Record<string, string> = {
    Hard: 'bg-red-500/15 text-red-400 border border-red-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Easy: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
};

const STAT_CARDS = [
    { label: 'Logic Score', key: 'logicScore', icon: LucideBrain, gradient: 'from-violet-600 to-purple-500', glow: 'rgba(139,92,246,0.35)' },
    { label: 'Pattern DNA', key: 'patternStrength', icon: LucideAtom, gradient: 'from-cyan-500 to-sky-400', glow: 'rgba(6,182,212,0.35)' },
    { label: 'Optimization', key: 'optimizationRating', icon: LucideZap, gradient: 'from-amber-500 to-yellow-400', glow: 'rgba(245,158,11,0.35)' },
    { label: 'Growth Curve', key: 'growthCurve', icon: LucideTrendingUp, gradient: 'from-emerald-500 to-green-400', glow: 'rgba(16,185,129,0.35)' },
];

export default function StudentDashboard() {
    const { dna } = useSkillIntelligence();
    const { user, initials } = useUser();
    const [diffFilter, setDiffFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

    const filteredChallenges = diffFilter === 'All'
        ? MOCK_CHALLENGES
        : MOCK_CHALLENGES.filter(c => c.difficulty === diffFilter);

    const level = Math.floor(dna.logicScore / 10) + 1;
    const xpPercent = Math.min(Math.max(dna.growthCurve, 0), 100);
    const overallRank = 'A';

    return (
        <div className="space-y-8">

            {/* ── PLAYER BANNER ───────────────────────── */}
            <div
                className="rounded-2xl p-6 relative overflow-hidden scanlines"
                style={{ background: 'linear-gradient(135deg, #0f0c24 0%, #1a0f3c 50%, #0c1829 100%)', border: '1px solid rgba(168,85,247,0.2)' }}
            >
                {/* ambient glows */}
                <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }} />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    <div className="pulse-ring shrink-0">
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 24px rgba(168,85,247,0.5)' }}
                        >
                            {initials}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h1 className="text-2xl font-black text-white tracking-tight">
                                {user.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Developer Arena'}
                            </h1>
                            <span className={cn("text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider", rankClass(overallRank))} style={{ fontFamily: 'monospace' }}>
                                RANK {overallRank}
                            </span>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-amber-400 border border-amber-500/30" style={{ background: 'rgba(251,191,36,0.12)' }}>
                                ⚡ LVL {level}
                            </span>
                        </div>
                        <p className="text-sm text-purple-200/60 mb-3">Logic DNA Calibration Active — Keep your streak going!</p>

                        {/* XP Bar */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 xp-bar">
                                <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
                            </div>
                            <span className="text-[11px] font-bold text-purple-300 whitespace-nowrap">{xpPercent}% towards LVL {level + 1}</span>
                        </div>
                    </div>

                    {/* Live Sync & Streak */}
                    <div className="flex flex-row md:flex-col items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-xs text-emerald-400 font-mono font-bold">LIVE SYNC</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400"
                            onClick={() => window.location.reload()}
                        >
                            Sync Data
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── STAT CARDS ──────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CARDS.map(({ label, key, icon: Icon, gradient, glow }) => {
                    const val = dna[key as keyof typeof dna] as number;
                    const rank = getRank(val);
                    return (
                        <div key={key} className="game-card p-5 group">
                            <div className="flex justify-between items-start mb-4">
                                <div
                                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
                                    style={{ boxShadow: `0 0 16px ${glow}` }}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider", rankClass(rank))}>
                                    {rank}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
                            <div className="text-2xl font-black text-foreground">
                                {key === 'growthCurve' ? `+${val}%` : val}
                                {key !== 'growthCurve' && <span className="text-xs text-muted-foreground ml-1 font-normal opacity-50">/100</span>}
                            </div>
                            {key !== 'growthCurve' && (
                                <div className="mt-3 xp-bar">
                                    <div className="xp-bar-fill" style={{ width: `${val}%`, background: `linear-gradient(90deg, ${glow.replace('0.35', '1')}, ${glow.replace('0.35', '0.7')})` }} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── MAIN GRID ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Challenge Feed */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Header row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <LucideSwords className="w-5 h-5 text-purple-400" />
                            <h2 className="text-lg font-black text-foreground">Active Missions</h2>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-purple-400 border border-purple-500/30" style={{ background: 'rgba(168,85,247,0.1)' }}>
                                {filteredChallenges.length} / {MOCK_CHALLENGES.length}
                            </span>
                        </div>
                        <Link href="/student/arena" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">
                            Open Arena →
                        </Link>
                    </div>

                    {/* Difficulty filter chips */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <LucideFilter className="w-3.5 h-3.5 text-muted-foreground" />
                        {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => {
                            const colors: Record<string, { active: string; inactive: string }> = {
                                All: { active: 'rgba(168,85,247,0.2)', inactive: 'var(--secondary)' },
                                Easy: { active: 'rgba(52,211,153,0.15)', inactive: 'var(--secondary)' },
                                Medium: { active: 'rgba(251,191,36,0.15)', inactive: 'var(--secondary)' },
                                Hard: { active: 'rgba(248,113,113,0.15)', inactive: 'var(--secondary)' },
                            };
                            const textColors: Record<string, string> = {
                                All: '#c084fc', Easy: '#34d399', Medium: '#fbbf24', Hard: '#f87171'
                            };
                            const isActive = diffFilter === d;
                            const count = d === 'All' ? MOCK_CHALLENGES.length : MOCK_CHALLENGES.filter(c => c.difficulty === d).length;
                            return (
                                <button
                                    key={d}
                                    onClick={() => setDiffFilter(d)}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all"
                                    style={{
                                        background: isActive ? colors[d].active : colors[d].inactive,
                                        color: isActive ? textColors[d] : 'var(--muted-foreground)',
                                        border: isActive ? `1px solid ${textColors[d]}55` : '1px solid var(--border)',
                                    }}
                                >
                                    {d} <span className="opacity-60">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Mission cards */}
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(168,85,247,0.3) transparent' }}>
                        {filteredChallenges.map((challenge, i) => {
                            const xpReward = challenge.difficulty === 'Hard' ? 120 : challenge.difficulty === 'Medium' ? 75 : 40;
                            const stripColor = challenge.difficulty === 'Hard' ? '#f87171' : challenge.difficulty === 'Medium' ? '#fbbf24' : '#34d399';
                            return (
                                <div
                                    key={challenge.id}
                                    className="game-card p-5 group cursor-pointer"
                                >
                                    {/* Animated gradient border top on hover */}
                                    <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                                        style={{ background: 'linear-gradient(90deg, #7c3aed, #c084fc, #22d3ee)' }}
                                    />
                                    {/* Left difficulty strip */}
                                    <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full" style={{ background: stripColor, boxShadow: `0 0 6px ${stripColor}` }} />

                                    <div className="flex justify-between items-start relative z-10 pl-3">
                                        <div className="flex-1">
                                            {/* Meta row */}
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider", DIFF_COLORS[challenge.difficulty])}>
                                                    ⚔ {challenge.difficulty}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                                                    <LucideClock className="w-3 h-3" /> {challenge.time_est}
                                                </span>
                                                <span className="text-[10px] font-bold text-amber-400">
                                                    +{xpReward} XP
                                                </span>
                                                <span className="text-[10px] font-mono text-muted-foreground/60">#{challenge.id}</span>
                                            </div>
                                            {/* Title */}
                                            <h3 className="text-sm font-black text-foreground mb-2 group-hover:text-purple-400 transition-colors">
                                                {challenge.title}
                                            </h3>
                                            {/* Tags */}
                                            <div className="flex gap-1.5 flex-wrap">
                                                {challenge.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                                        style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Link href={`/student/arena?id=${challenge.id}`}>
                                            <Button size="sm"
                                                className="ml-4 shrink-0 text-xs font-bold"
                                                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', border: 'none', boxShadow: '0 0 12px rgba(168,85,247,0.3)' }}
                                            >
                                                Start <LucideArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">

                    {/* Profile Engagement */}
                    <div className="game-card p-5">
                        <h3 className="font-black text-foreground mb-4 flex items-center gap-2 text-sm">
                            <LucideStar className="w-4 h-4 text-amber-400" />
                            Profile Engagement
                        </h3>
                        <div className="flex items-end justify-between border-b border-border pb-4 mb-3">
                            <div>
                                <div className="text-3xl font-black text-foreground">12</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mt-0.5">Recruiter Views</div>
                            </div>
                            <div className="text-xs font-black px-2 py-1 rounded-lg text-emerald-400" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
                                +40%
                            </div>
                        </div>
                        <div
                            className="flex items-center gap-2 p-3 rounded-xl cursor-pointer"
                            style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}
                        >
                            <LucideShield className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold text-purple-400">View Detailed Insights</span>
                        </div>
                    </div>

                    {/* Quick Leaderboard */}
                    <div className="game-card p-5">
                        <h3 className="font-black text-foreground mb-4 flex items-center gap-2 text-sm">
                            🏆 Top Performers
                        </h3>
                        {['Arjun M.', 'Priya S.', 'Rohan G.'].map((name, i) => (
                            <div key={name} className="flex items-center gap-3 mb-3 last:mb-0">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                                    style={{
                                        background: i === 0 ? 'rgba(251,191,36,0.2)' : i === 1 ? 'rgba(148,163,184,0.2)' : 'rgba(180,83,9,0.2)',
                                        color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : '#b45309',
                                        border: `1px solid ${i === 0 ? 'rgba(251,191,36,0.4)' : i === 1 ? 'rgba(148,163,184,0.3)' : 'rgba(180,83,9,0.3)'}`
                                    }}
                                >
                                    #{i + 1}
                                </div>
                                <span className="text-sm font-bold text-foreground flex-1">{name}</span>
                                <span className="text-[10px] font-bold text-muted-foreground">{98 - i * 2}%</span>
                            </div>
                        ))}
                    </div>

                    {/* Career Pulse (Requirement 4) */}
                    <CareerPulse studentId={user.id} />
                </div>
            </div>
        </div>
    );
}

function CareerPulse({ studentId }: { studentId: string }) {
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studentId) return;
        const fetchApps = async () => {
            try {
                const { db } = await import('@/lib/firebase/config');
                const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
                const q = query(
                    collection(db, 'applications'),
                    where('studentId', '==', studentId)
                );
                const snap = await getDocs(q);
                const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                fetched.sort((a: any, b: any) => {
                    const tA = a.appliedAt?.seconds || 0;
                    const tB = b.appliedAt?.seconds || 0;
                    return tB - tA;
                });
                setApps(fetched);
            } catch (err) {
                console.error("Pulse error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, [studentId]);

    if (loading) return null;

    return (
        <div className="game-card p-5 border-purple-500/20 bg-purple-500/[0.03]">
            <h3 className="font-black text-foreground mb-4 flex items-center gap-2 text-sm">
                📡 Career Pulse
            </h3>
            {apps.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic">No active application signals detected.</p>
            ) : (
                <div className="space-y-3">
                    {apps.slice(0, 3).map(app => (
                        <div key={app.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-white uppercase truncate max-w-[120px]">{app.companyName}</span>
                                <span className={cn(
                                    "text-[8px] font-black px-1.5 py-0.5 rounded uppercase",
                                    app.status === 'Offer Sent' ? "bg-emerald-500/20 text-emerald-400" :
                                        app.status === 'Rejected' ? "bg-rose-500/20 text-rose-400" : "bg-blue-500/20 text-blue-400"
                                )}>
                                    {app.status}
                                </span>
                            </div>
                            <div className="text-[9px] text-muted-foreground font-bold">{app.role}</div>
                            {app.status === 'Offer Sent' && (
                                <div className="mt-2 text-[9px] font-black text-emerald-400 animate-pulse flex items-center gap-1">
                                    <LucideMail className="w-3 h-3" /> Check Email for Instructions
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
