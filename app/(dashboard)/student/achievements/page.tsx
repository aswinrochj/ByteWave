'use client';

import { LucideAward, LucideTrophy, LucideStar, LucideZap, LucideCode2, LucideShield, LucideLock, LucideCheckCircle2, LucideTarget } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACHIEVEMENTS = [
    {
        id: 'logic-master',
        title: 'Logic Master',
        desc: 'Achieve a Logic Score of 80+',
        emoji: '🧠',
        unlocked: true,
        date: 'Feb 15, 2026',
        xp: 500,
        rarity: 'Rare',
        rarityColor: 'text-blue-400',
        gradient: 'from-indigo-600/30 to-violet-600/20',
        glow: 'rgba(99,102,241,0.3)',
        borderColor: 'rgba(99,102,241,0.4)',
    },
    {
        id: 'streak-survivor',
        title: '7 Day Streak',
        desc: 'Complete a calibration for 7 consecutive days',
        emoji: '🔥',
        unlocked: true,
        date: 'Feb 18, 2026',
        xp: 350,
        rarity: 'Uncommon',
        rarityColor: 'text-yellow-400',
        gradient: 'from-amber-600/30 to-orange-600/20',
        glow: 'rgba(245,158,11,0.3)',
        borderColor: 'rgba(245,158,11,0.4)',
    },
    {
        id: 'speed-demon',
        title: 'Speed Demon',
        desc: 'Solve a Hard problem in top 5% execution time',
        emoji: '⚡',
        unlocked: false,
        progress: 85,
        xpReward: 750,
        rarity: 'Epic',
        rarityColor: 'text-red-400',
    },
    {
        id: 'bug-hunter',
        title: 'Edge Case Elite',
        desc: 'Pass all hidden test cases on first try',
        emoji: '🛡',
        unlocked: false,
        progress: 40,
        xpReward: 400,
        rarity: 'Uncommon',
        rarityColor: 'text-green-400',
    },
    {
        id: 'algo-ace',
        title: 'Algorithm Ace',
        desc: 'Solve 10 Hard difficulty problems',
        emoji: '⚔️',
        unlocked: false,
        progress: 20,
        xpReward: 1000,
        rarity: 'Legendary',
        rarityColor: 'text-purple-400',
    },
    {
        id: 'early-adopter',
        title: 'Early Adopter',
        desc: 'Join Bytewave during the beta phase',
        emoji: '🌟',
        unlocked: true,
        date: 'Jan 20, 2026',
        xp: 200,
        rarity: 'Uncommon',
        rarityColor: 'text-sky-400',
        gradient: 'from-sky-600/30 to-blue-600/20',
        glow: 'rgba(14,165,233,0.3)',
        borderColor: 'rgba(14,165,233,0.4)',
    }
];

const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
const totalXp = ACHIEVEMENTS.filter(a => a.unlocked).reduce((s, a) => s + (a.xp ?? 0), 0);

export default function StudentAchievementsPage() {
    return (
        <div className="space-y-8 pb-10">

            {/* ── HEADER BANNER ─────────────────────── */}
            <div
                className="rounded-2xl p-6 relative overflow-hidden scanlines"
                style={{ background: 'linear-gradient(135deg, #14091f 0%, #1f1035 50%, #0f1a24 100%)', border: '1px solid rgba(251,191,36,0.25)' }}
            >
                <div className="absolute -right-10 -top-10 text-[150px] opacity-5 pointer-events-none select-none">🏆</div>
                <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', boxShadow: '0 0 20px rgba(251,191,36,0.2)' }}>
                                🏆
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white">Hall of Fame</h1>
                                <p className="text-amber-300/60 text-sm">Earn badges by proving your skill, consistency, and growth.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-center px-5 py-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}>
                            <div className="text-2xl font-black text-amber-400">{unlockedCount}<span className="text-sm text-amber-300/50">/{ACHIEVEMENTS.length}</span></div>
                            <div className="text-[10px] uppercase text-amber-300/60 font-bold tracking-wider">Badges</div>
                        </div>
                        <div className="text-center px-5 py-3 rounded-xl" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
                            <div className="text-2xl font-black text-purple-400">{totalXp.toLocaleString()}</div>
                            <div className="text-[10px] uppercase text-purple-300/60 font-bold tracking-wider">Total XP</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PROGRESS OVERVIEW ─────────────────── */}
            <div>
                <div className="flex justify-between items-center mb-2 text-xs font-bold">
                    <span className="text-muted-foreground uppercase tracking-wider">Season Progress</span>
                    <span className="text-amber-400">{Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%</span>
                </div>
                <div className="xp-bar" style={{ height: '8px', background: 'rgba(251,191,36,0.12)' }}>
                    <div
                        className="xp-bar-fill"
                        style={{
                            width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%`,
                            background: 'linear-gradient(90deg, #d97706, #fbbf24, #fde68a)',
                        }}
                    />
                </div>
            </div>

            {/* ── ACHIEVEMENT GRID ──────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ACHIEVEMENTS.map((a) => (
                    <div
                        key={a.id}
                        className="relative overflow-hidden rounded-2xl p-5 transition-all duration-300 group"
                        style={
                            a.unlocked
                                ? {
                                    background: `linear-gradient(135deg, ${a.gradient?.replace('from-', '').replace('to-', '')?.split(' ')[0] ?? '#1a1a2e'} 0%, #0f0c1e 100%)`,
                                    border: `1px solid ${a.borderColor ?? 'rgba(168,85,247,0.3)'}`,
                                    boxShadow: `0 0 30px ${a.glow ?? 'rgba(168,85,247,0.1)'}`,
                                }
                                : {
                                    background: 'var(--card)',
                                    border: '1px solid var(--border)',
                                }
                        }
                    >
                        {/* hover lift for locked */}
                        {!a.unlocked && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.04), transparent)' }} />
                        )}

                        {/* Glow blob for unlocked */}
                        {a.unlocked && (
                            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: a.glow ? `radial-gradient(ellipse, ${a.glow} 0%, transparent 70%)` : 'none', filter: 'blur(20px)' }} />
                        )}

                        {/* Header */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                style={{
                                    background: a.unlocked ? 'rgba(0,0,0,0.3)' : 'var(--secondary)',
                                    border: `1px solid ${a.unlocked ? (a.borderColor ?? 'rgba(255,255,255,0.1)') : 'var(--border)'}`,
                                    filter: !a.unlocked ? 'grayscale(1) opacity(0.5)' : undefined,
                                }}
                            >
                                {a.emoji}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {a.unlocked ? (
                                    <LucideCheckCircle2 className="w-5 h-5 text-emerald-400" />
                                ) : (
                                    <LucideLock className="w-4 h-4 text-muted-foreground" />
                                )}
                                <span className={cn("text-[10px] font-black uppercase tracking-wider", a.rarityColor)}>
                                    {a.rarity}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className={cn("text-base font-black mb-1 relative z-10", a.unlocked ? "text-white" : "text-muted-foreground")}>
                            {a.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 relative z-10 min-h-[32px] leading-relaxed">
                            {a.desc}
                        </p>

                        {/* Progress or Unlock info */}
                        {!a.unlocked && typeof a.progress === 'number' && (
                            <div className="space-y-1.5 relative z-10">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    <span>Progress</span>
                                    <span className="text-purple-400">{a.progress}%</span>
                                </div>
                                <div className="xp-bar">
                                    <div className="xp-bar-fill" style={{ width: `${a.progress}%` }} />
                                </div>
                                <div className="text-[10px] text-amber-400 font-bold">Reward: +{a.xpReward} XP</div>
                            </div>
                        )}

                        {a.unlocked && a.date && (
                            <div className="relative z-10 flex items-center justify-between pt-3 mt-2 border-t border-white/10">
                                <span className="text-[10px] text-white/40 font-mono">Unlocked {a.date}</span>
                                <span className="text-[10px] font-black text-amber-400">+{a.xp} XP</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
