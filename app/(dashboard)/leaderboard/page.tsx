'use client';

import React, { useState, useMemo } from 'react';
import { LEADERBOARD_MEMBERS, LeaderboardMember } from '@/lib/mock-data';
import {
    LucideSearch, LucideTrendingUp, LucideTrendingDown, LucideMinus,
    LucideFlame, LucideZap, LucideStar, LucideTrophy, LucideFilter, LucideAward, LucideMedal
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── helpers ──────────────────────────────────── */
const RANK_CLASS: Record<string, string> = { S: 'rank-s', A: 'rank-a', B: 'rank-b', C: 'rank-c' };

const MEDAL_ICONS = [LucideTrophy, LucideAward, LucideMedal];

const PODIUM_BG: Record<number, { bg: string; border: string; glow: string; label: string; shadow: string }> = {
    1: { bg: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #7c2d12 100%)', border: 'rgba(251,191,36,0.6)', glow: 'rgba(251,191,36,0.35)', label: '#fbbf24', shadow: '0 0 40px rgba(251,191,36,0.25)' },
    2: { bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', border: 'rgba(165,180,252,0.5)', glow: 'rgba(165,180,252,0.2)', label: '#a5b4fc', shadow: '0 0 30px rgba(165,180,252,0.15)' },
    3: { bg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)', border: 'rgba(251,146,60,0.45)', glow: 'rgba(251,146,60,0.15)', label: '#fb923c', shadow: '0 0 24px rgba(251,146,60,0.12)' },
};

function ChangeChip({ change }: { change: number }) {
    if (change > 0) return <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-400"><LucideTrendingUp className="w-3 h-3" />+{change}</span>;
    if (change < 0) return <span className="flex items-center gap-0.5 text-[10px] font-black text-red-400"><LucideTrendingDown className="w-3 h-3" />{change}</span>;
    return <span className="flex items-center gap-0.5 text-[10px] font-black text-muted-foreground"><LucideMinus className="w-3 h-3" /></span>;
}

/* ── PODIUM CARD ──────────────────────────────── */
function PodiumCard({ member, position }: { member: LeaderboardMember; position: number }) {
    const s = PODIUM_BG[position];
    const heights = ['h-36', 'h-28', 'h-24'];
    const Icon = MEDAL_ICONS[position - 1];

    return (
        <div className="flex flex-col items-center gap-3 flex-1">
            {/* Avatar */}
            <div className="relative">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-lg transition-transform hover:scale-105 overflow-hidden"
                    style={{ background: s.bg, border: `2px solid ${s.border}`, boxShadow: `0 0 24px ${s.glow}`, color: s.label }}
                >
                    {member.avatar.length <= 2 ? member.avatar : member.name.charAt(0)}
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center bg-background border border-border shadow-lg">
                    <Icon className="w-4 h-4" style={{ color: s.label }} />
                </div>
                <div className={cn("absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-black px-1.5 py-0.5 rounded-full", RANK_CLASS[member.rank_badge])}>
                    {member.rank_badge}
                </div>
            </div>
            {/* Name */}
            <div className="text-center">
                <div className="font-black text-foreground text-sm">{member.name}</div>
                <div className="text-[10px] text-muted-foreground">{member.username}</div>
                <div className="text-[10px] font-bold mt-0.5" style={{ color: s.label }}>{member.badge}</div>
            </div>
            {/* Podium pillar */}
            <div
                className={cn("w-full rounded-t-xl flex items-center justify-center font-black text-xl", heights[position - 1])}
                style={{ background: s.bg, border: `1px solid ${s.border}`, borderBottom: 'none', boxShadow: s.shadow }}
            >
                <div className="text-center">
                    <div className="font-black text-2xl" style={{ color: s.label }}>{member.problems_solved}</div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-widest">solved</div>
                </div>
            </div>
        </div>
    );
}

/* ── PAGE ──────────────────────────────────────── */
export default function TopPerformersPage() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'All' | 'Student' | 'Recruiter'>('All');
    const [diffFilter, setDiffFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

    const sorted = useMemo(() => {
        return [...LEADERBOARD_MEMBERS]
            .filter(m => {
                const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                    m.username.toLowerCase().includes(search.toLowerCase()) ||
                    m.badge.toLowerCase().includes(search.toLowerCase());
                const matchRole = roleFilter === 'All' || m.role === roleFilter;
                return matchSearch && matchRole;
            })
            .sort((a, b) => {
                if (diffFilter === 'Easy') return b.easy_solved - a.easy_solved;
                if (diffFilter === 'Medium') return b.medium_solved - a.medium_solved;
                if (diffFilter === 'Hard') return b.hard_solved - a.hard_solved;
                return b.problems_solved - a.problems_solved;
            });
    }, [search, roleFilter, diffFilter]);

    const topThree = sorted.slice(0, 3);
    const rest = sorted.slice(3);
    const maxSolved = sorted[0]?.problems_solved ?? 1;

    return (
        <div className="space-y-7 pb-10">

            {/* ── HERO ────────────────────────────── */}
            <div
                className="rounded-2xl p-7 relative overflow-hidden scanlines"
                style={{
                    background: 'linear-gradient(135deg, #0c0618 0%, #180a35 50%, #0a1020 100%)',
                    border: '1px solid rgba(251,191,36,0.25)',
                }}
            >
                {/* Glows */}
                <div className="absolute top-0 left-1/4 w-56 h-40 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.18) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                <div className="absolute top-0 right-1/4 w-40 h-32 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(24px)' }} />

                <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                            <LucideTrophy className="w-8 h-8 text-amber-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Top Performers</h1>
                    <p className="text-amber-300/50 text-sm mb-5">Global leaderboard · ranked by problems solved · updated live</p>
                    {/* Quick stats */}
                    <div className="flex justify-center gap-6">
                        {[
                            { label: 'Total Members', value: LEADERBOARD_MEMBERS.length },
                            { label: 'Problems Solved', value: LEADERBOARD_MEMBERS.reduce((a, m) => a + m.problems_solved, 0).toLocaleString() },
                            { label: 'Avg Streak', value: Math.round(LEADERBOARD_MEMBERS.reduce((a, m) => a + m.streak, 0) / LEADERBOARD_MEMBERS.length) + 'd' },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <div className="text-xl font-black text-amber-400">{s.value}</div>
                                <div className="text-[10px] text-amber-200/40 uppercase tracking-wider font-bold">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FILTERS ─────────────────────────── */}
            <div className="game-card p-4 flex flex-col md:flex-row items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        placeholder="Search by name, username, or badge…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    />
                </div>

                {/* Role filter */}
                <div className="flex gap-1.5 shrink-0">
                    {(['All', 'Student', 'Recruiter'] as const).map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)}
                            className="px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all"
                            style={roleFilter === r
                                ? { background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.45)' }
                                : { background: 'var(--secondary)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }
                            }
                        >{r}</button>
                    ))}
                </div>

                {/* Difficulty filter */}
                <div className="flex gap-1.5 shrink-0">
                    {([
                        { id: 'All', color: '#94a3b8' },
                        { id: 'Easy', color: '#34d399' },
                        { id: 'Medium', color: '#fbbf24' },
                        { id: 'Hard', color: '#f87171' },
                    ] as const).map(d => (
                        <button key={d.id} onClick={() => setDiffFilter(d.id as any)}
                            className="px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all"
                            style={diffFilter === d.id
                                ? { background: `${d.color}22`, color: d.color, border: `1px solid ${d.color}55` }
                                : { background: 'var(--secondary)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }
                            }
                        >{d.id}</button>
                    ))}
                </div>
            </div>

            {/* ── TOP 3 PODIUM ────────────────────── */}
            {topThree.length === 3 && search === '' && roleFilter === 'All' && (
                <div
                    className="rounded-2xl p-6"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                    <div className="text-center mb-6">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.25em]">🏆 This Week's Podium</span>
                    </div>
                    <div className="flex items-end gap-3 max-w-lg mx-auto">
                        {/* 2nd */}
                        <PodiumCard member={topThree[1]} position={2} />
                        {/* 1st (tallest) */}
                        <PodiumCard member={topThree[0]} position={1} />
                        {/* 3rd */}
                        <PodiumCard member={topThree[2]} position={3} />
                    </div>
                </div>
            )}

            {/* ── FULL LEADERBOARD TABLE ──────────── */}
            <div className="game-card overflow-hidden">
                {/* Header */}
                <div
                    className="grid grid-cols-[3rem_1fr_auto_auto_auto_auto] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                    style={{ background: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}
                >
                    <div>#</div>
                    <div>Player</div>
                    <div className="hidden md:block text-right pr-8">Problems</div>
                    <div className="hidden lg:block text-right pr-8">XP</div>
                    <div className="hidden lg:block text-right pr-8">Streak</div>
                    <div className="text-right">Rank</div>
                </div>

                {/* Rows */}
                <div>
                    {sorted.map((member, idx) => {
                        const pos = idx + 1;
                        const barWidth = (member.problems_solved / maxSolved) * 100;
                        const isTop3 = pos <= 3;
                        const diffSolvedLabel = diffFilter === 'Easy' ? member.easy_solved
                            : diffFilter === 'Medium' ? member.medium_solved
                                : diffFilter === 'Hard' ? member.hard_solved
                                    : member.problems_solved;

                        return (
                            <div
                                key={member.id}
                                className="group relative grid grid-cols-[3rem_1fr_auto_auto_auto_auto] items-center px-5 py-3.5 transition-all"
                                style={{
                                    borderBottom: '1px solid var(--border)',
                                    background: isTop3 ? 'rgba(251,191,36,0.025)' : 'transparent',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--secondary)')}
                                onMouseLeave={e => (e.currentTarget.style.background = isTop3 ? 'rgba(251,191,36,0.025)' : 'transparent')}
                            >
                                {/* Rank num */}
                                <div className="flex items-center gap-1">
                                    <span className={cn(
                                        "text-sm font-black font-mono flex items-center justify-center w-6 h-6",
                                        pos === 1 ? 'text-amber-400' : pos === 2 ? 'text-slate-300' : pos === 3 ? 'text-orange-400' : 'text-muted-foreground'
                                    )}>
                                        {pos <= 3 ? (
                                            React.createElement(MEDAL_ICONS[pos - 1], { className: "w-4 h-4" })
                                        ) : pos}
                                    </span>
                                </div>

                                {/* Player info */}
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Avatar */}
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:scale-105"
                                        style={{
                                            background: isTop3 ? PODIUM_BG[pos].bg : 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))',
                                            border: `1px solid ${isTop3 ? PODIUM_BG[pos].border : 'rgba(168,85,247,0.2)'}`,
                                            color: isTop3 ? PODIUM_BG[pos].label : '#c084fc',
                                        }}
                                    >
                                        {member.avatar}
                                    </div>
                                    {/* Name block */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-black text-sm text-foreground group-hover:text-purple-400 transition-colors truncate">
                                                {member.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">{member.username}</span>
                                            <span className="text-[10px] hidden sm:inline-block">{member.badge}</span>
                                        </div>
                                        {/* Languages row */}
                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                            {member.languages.slice(0, 3).map(l => (
                                                <span key={l} className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                                                    style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                                                    {l}
                                                </span>
                                            ))}
                                            {/* Progress bar (hidden on small) */}
                                            <div className="hidden md:block flex-1 max-w-24 xp-bar ml-1" style={{ height: '3px' }}>
                                                <div className="xp-bar-fill" style={{ width: `${barWidth}%`, height: '3px' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Problems solved */}
                                <div className="hidden md:block text-right pr-8">
                                    <div className="font-black text-foreground text-base">{diffSolvedLabel.toLocaleString()}</div>
                                    {diffFilter === 'All' && (
                                        <div className="text-[9px] font-bold space-x-1">
                                            <span className="text-emerald-400">{member.easy_solved}E</span>
                                            <span className="text-amber-400">{member.medium_solved}M</span>
                                            <span className="text-red-400">{member.hard_solved}H</span>
                                        </div>
                                    )}
                                </div>

                                {/* XP */}
                                <div className="hidden lg:block text-right pr-8">
                                    <div className="flex items-center justify-end gap-1 font-black text-amber-400 text-sm">
                                        <LucideZap className="w-3.5 h-3.5" />
                                        {member.xp.toLocaleString()}
                                    </div>
                                    <div className="text-[9px] text-muted-foreground font-mono">XP</div>
                                </div>

                                {/* Streak */}
                                <div className="hidden lg:block text-right pr-8">
                                    <div className={cn(
                                        "flex items-center justify-end gap-1 font-black text-sm",
                                        member.streak >= 14 ? 'text-orange-400' : member.streak >= 7 ? 'text-amber-400' : 'text-muted-foreground'
                                    )}>
                                        {member.streak > 0 ? <LucideFlame className="w-3.5 h-3.5" /> : null}
                                        {member.streak > 0 ? `${member.streak}d` : '—'}
                                    </div>
                                    <div className="text-[9px] text-muted-foreground font-mono">streak</div>
                                </div>

                                {/* Rank badge + change */}
                                <div className="flex flex-col items-end gap-1">
                                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-lg uppercase", RANK_CLASS[member.rank_badge])}>
                                        {member.rank_badge}
                                    </span>
                                    <ChangeChip change={member.change} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div
                    className="px-5 py-3 text-center text-[11px] text-muted-foreground font-bold"
                    style={{ background: 'var(--secondary)', borderTop: '1px solid var(--border)' }}
                >
                    Showing {sorted.length} of {LEADERBOARD_MEMBERS.length} members · ranked by{' '}
                    <span className="text-purple-400">{diffFilter === 'All' ? 'total problems solved' : `${diffFilter} problems`}</span>
                </div>
            </div>
        </div>
    );
}
