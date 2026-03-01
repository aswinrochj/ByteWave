'use client';

import { useState, useEffect } from 'react';
import {
    LucideUser, LucideEdit3, LucideSave, LucideX, LucideGithub,
    LucideLinkedin, LucideGlobe, LucideCode2, LucideTrophy, LucideFlame,
    LucideZap, LucideShield, LucideStar, LucideCheckCircle, LucideCamera,
    LucideBrain, LucideCpu, LucideTrendingUp, LucideMapPin, LucideMail,
    LucideCalendar, LucideAward, LucideSwords,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUser } from '@/components/providers/UserProvider';
import { useSkillIntelligence } from '@/components/providers/SkillIntelligenceProvider';
import VideoIntroduction from '@/components/profile/VideoIntroduction';
import CertificatesArchive from '@/components/profile/CertificatesArchive';

/* ─── static fallback / extra data ─────────────────────────── */
const EXTRA_DATA = {
    joined: 'Jan 2025',
    problems_solved: 148,
    easy_solved: 72,
    medium_solved: 58,
    hard_solved: 18,
    badges: ['🏆 Top 10%', '🔥 30-Day Streak', '⚡ Speed Coder', '🧠 Logic Master', '🎯 Precision Pro'],
    recent: [
        { id: 1, title: 'Matrix Spiral Traversal', difficulty: 'Medium', xp: 75, status: 'Solved' },
        { id: 3, title: 'Valid Parentheses V2', difficulty: 'Easy', xp: 40, status: 'Solved' },
        { id: 12, title: 'Trapping Rain Water', difficulty: 'Hard', xp: 120, status: 'Attempted' },
        { id: 8, title: 'Coin Change — Min Coins', difficulty: 'Medium', xp: 75, status: 'Solved' },
        { id: 6, title: 'Longest Substring Without Repeating', difficulty: 'Medium', xp: 75, status: 'Solved' },
    ],
};

const rankClass = (r: string) =>
    r === 'S' ? 'rank-s' : r === 'A' ? 'rank-a' : r === 'B' ? 'rank-b' : 'rank-c';

const DIFF: Record<string, { text: string; bg: string; border: string }> = {
    Easy: { text: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
    Medium: { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
    Hard: { text: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
};

function DNABar({ label, icon: Icon, value, from, to }: { label: string; icon: any; value: number; from: string; to: string }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5" style={{ color: to }}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-black uppercase tracking-wide">{label}</span>
                </div>
                <span className="font-black font-mono text-foreground">{value}<span className="text-muted-foreground">/100</span></span>
            </div>
            <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${from}, ${to})` }} />
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { user, initials, setUser } = useUser();
    const { dna } = useSkillIntelligence();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');
    const [location, setLocation] = useState(user.location || '');
    const [github, setGithub] = useState(user.github || '');
    const [linkedin, setLinkedin] = useState(user.linkedin || '');
    const [website, setWebsite] = useState(user.website || '');
    const [saved, setSaved] = useState(false);

    // Sync state if user context updates (e.g. after login/hydrate)
    useEffect(() => {
        setName(user.name);
        setBio(user.bio || '');
        setLocation(user.location || '');
        setGithub(user.github || '');
        setLinkedin(user.linkedin || '');
        setWebsite(user.website || '');
    }, [user]);

    const xpPercent = Math.min(Math.max(dna.growthCurve, 0), 100);

    const handleSave = () => {
        setUser({
            name,
            bio,
            location,
            github,
            linkedin,
            website
        });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const rank = 'A';
    const isStudent = user.role === 'student';
    const isInstitution = user.role === 'institution';
    const isRecruiter = user.role === 'recruiter';
    const isProfessional = isInstitution || isRecruiter;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-8">

            {/* ── HERO BANNER ─────────────────────────── */}
            <div
                className="rounded-2xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0b0618 0%, #130a2a 50%, #0b1628 100%)',
                    border: '1px solid rgba(168,85,247,0.25)',
                    boxShadow: '0 0 40px rgba(168,85,247,0.08)',
                }}
            >
                {/* Ambient glows */}
                <div className="absolute top-0 left-1/4 w-64 h-64 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />

                {/* Cover strip */}
                <div className="h-28 w-full relative"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(34,211,238,0.15), rgba(168,85,247,0.25))' }}>
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(168,85,247,0.1) 0px, rgba(168,85,247,0.1) 1px, transparent 1px, transparent 40px)' }} />
                </div>

                {/* Avatar + info */}
                <div className="relative z-10 px-6 pb-6">
                    <div className="flex flex-wrap items-end justify-between gap-4 -mt-12">
                        {/* Avatar */}
                        <div className="relative group">
                            <div
                                className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-3xl pulse-ring"
                                style={{
                                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                    border: '4px solid var(--background)',
                                    boxShadow: '0 0 30px rgba(168,85,247,0.45)',
                                    color: '#fff',
                                }}
                            >
                                {initials}
                            </div>
                            {editing && (
                                <button className="absolute inset-0 rounded-2xl flex items-center justify-center transition-all"
                                    style={{ background: 'rgba(0,0,0,0.5)' }}>
                                    <LucideCamera className="w-6 h-6 text-white" />
                                </button>
                            )}
                            {/* Online dot */}
                            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background"
                                style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
                        </div>

                        {/* Edit / Save buttons */}
                        <div className="flex gap-2 mt-14 sm:mt-0">
                            {saved && (
                                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-emerald-400"
                                    style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)' }}>
                                    <LucideCheckCircle className="w-4 h-4" /> Saved!
                                </div>
                            )}
                            {editing ? (
                                <>
                                    <Button onClick={handleSave} size="sm" className="font-bold gap-1.5"
                                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none' }}>
                                        <LucideSave className="w-3.5 h-3.5" /> Save Changes
                                    </Button>
                                    <Button onClick={() => setEditing(false)} size="sm" variant="outline"
                                        className="font-bold gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10">
                                        <LucideX className="w-3.5 h-3.5" /> Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setEditing(true)} size="sm" variant="outline"
                                    className="font-bold gap-1.5 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                                    <LucideEdit3 className="w-3.5 h-3.5" /> Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Name & meta */}
                    <div className="mt-4 space-y-2">
                        {editing ? (
                            <Input value={name} onChange={e => setName(e.target.value)}
                                className="text-xl font-black bg-transparent border-purple-500/30 text-foreground max-w-sm" />
                        ) : (
                            <h1 className="text-2xl font-black text-white">{user.name || 'Anonymous User'}</h1>
                        )}

                        <div className="flex items-center flex-wrap gap-2">
                            <span className="text-purple-300/70 text-sm font-mono">{user.username || `@${user.name?.toLowerCase().replace(/\s+/g, '') || 'user'}`}</span>

                            {isStudent && (
                                <>
                                    <span className={cn('text-xs font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider', rankClass(rank))}>
                                        RANK {rank}
                                    </span>
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg text-amber-400 border border-amber-500/30"
                                        style={{ background: 'rgba(251,191,36,0.1)' }}>
                                        ⚡ LVL {Math.floor(dna.logicScore / 10) + 1}
                                    </span>
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg text-emerald-400 border border-emerald-500/30"
                                        style={{ background: 'rgba(52,211,153,0.1)' }}>
                                        🔥 {dna.streak} day streak
                                    </span>
                                </>
                            )}

                            {isRecruiter && (
                                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                                    RECRUITER
                                </span>
                            )}

                            {isInstitution && (
                                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                    INSTITUTION
                                </span>
                            )}

                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <LucideMapPin className="w-3 h-3" /> {user.location || 'Unknown Location'}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <LucideCalendar className="w-3 h-3" /> Joined {EXTRA_DATA.joined}
                            </span>
                        </div>

                        {/* Bio */}
                        {editing ? (
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                rows={2}
                                placeholder="Tell us about yourself..."
                                className="w-full max-w-xl rounded-xl p-3 text-sm resize-none outline-none"
                                style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.25)', color: 'var(--foreground)' }}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{user.bio || 'No bio provided yet.'}</p>
                        )}

                        {/* Social links */}
                        <div className="flex items-center flex-wrap gap-3 pt-1">
                            {editing ? (
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { icon: LucideGithub, val: github, set: setGithub, placeholder: 'github.com/…' },
                                        { icon: LucideLinkedin, val: linkedin, set: setLinkedin, placeholder: 'linkedin.com/in/…' },
                                        { icon: LucideGlobe, val: website, set: setWebsite, placeholder: 'yoursite.com' },
                                    ].map(({ icon: Icon, val, set, placeholder }) => (
                                        <div key={placeholder} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                                            style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}>
                                            <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                            <input value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                                                className="bg-transparent outline-none text-xs font-mono text-foreground w-36"
                                                style={{ color: 'var(--foreground)' }} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {[
                                        { icon: LucideGithub, label: user.github, href: `https://${user.github}` },
                                        { icon: LucideLinkedin, label: user.linkedin, href: `https://${user.linkedin}` },
                                        { icon: LucideGlobe, label: user.website, href: `https://${user.website}` },
                                        { icon: LucideMail, label: user.email, href: `mailto:${user.email}` },
                                    ].filter(s => s.label).map(({ icon: Icon, label, href }) => (
                                        <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-purple-400"
                                            style={{ color: 'var(--muted-foreground)' }}>
                                            <Icon className="w-3.5 h-3.5" />
                                            {label}
                                        </a>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── XP PROGRESS ────────────────────── */}
            {isStudent && (
                <div className="game-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <LucideZap className="w-4 h-4 text-amber-400" />
                            <span className="font-black text-sm text-foreground">XP Progress to Level {Math.floor(dna.logicScore / 10) + 2}</span>
                        </div>
                        <span className="font-black text-sm text-amber-400 font-mono">{dna.growthCurve} / 100 XP</span>
                    </div>
                    <div className="xp-bar" style={{ height: '10px' }}>
                        <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
                        <span>LVL {Math.floor(dna.logicScore / 10) + 1}</span>
                        <span>{xpPercent}% complete</span>
                        <span>LVL {Math.floor(dna.logicScore / 10) + 2}</span>
                    </div>
                </div>
            )}


            {/* ── STATS GRID + DNA + RECENTS ─────── */}
            {isStudent && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ... stats content ... */}
                    <div className="space-y-5">
                        <div className="game-card p-5">
                            <h2 className="font-black text-sm text-foreground mb-4 flex items-center gap-2">
                                <LucideTrophy className="w-4 h-4 text-amber-400" /> Stats
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Problems Solved', val: EXTRA_DATA.problems_solved, color: '#a855f7', icon: LucideSwords },
                                    { label: 'Current Streak', val: `${dna.streak}d`, color: '#f87171', icon: LucideFlame },
                                    { label: 'Logic DNA', val: dna.logicScore, color: '#fbbf24', icon: LucideZap },
                                    { label: 'Global Rank', val: '#142', color: '#22d3ee', icon: LucideShield },
                                ].map(({ label, val, color, icon: Icon }) => (
                                    <div key={label} className="p-3 rounded-xl text-center"
                                        style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                                        <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                                        <div className="font-black text-base" style={{ color }}>{val}</div>
                                        <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="game-card p-5">
                            <h2 className="font-black text-sm text-foreground mb-4 flex items-center gap-2">
                                <LucideCode2 className="w-4 h-4 text-purple-400" /> Problem Breakdown
                            </h2>
                            {[
                                { label: 'Easy', val: EXTRA_DATA.easy_solved, total: 100, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
                                { label: 'Medium', val: EXTRA_DATA.medium_solved, total: 100, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
                                { label: 'Hard', val: EXTRA_DATA.hard_solved, total: 100, color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
                            ].map(({ label, val, total, color, bg }) => (
                                <div key={label} className="mb-3 last:mb-0">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold" style={{ color }}>{label}</span>
                                        <span className="font-black font-mono" style={{ color }}>{val}<span className="text-muted-foreground">/{total}</span></span>
                                    </div>
                                    <div className="xp-bar">
                                        <div className="xp-bar-fill" style={{ width: `${(val / total) * 100}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="game-card p-5">
                            <h2 className="font-black text-sm text-foreground mb-4 flex items-center gap-2">
                                <LucideCpu className="w-4 h-4 text-cyan-400" /> Skill DNA
                            </h2>
                            <div className="space-y-4">
                                <DNABar label="Logic Score" icon={LucideBrain} value={dna.logicScore} from="#7c3aed" to="#a855f7" />
                                <DNABar label="Pattern DNA" icon={LucideCpu} value={dna.patternStrength} from="#0891b2" to="#22d3ee" />
                                <DNABar label="Optimization" icon={LucideZap} value={dna.optimizationRating} from="#d97706" to="#fbbf24" />
                                <DNABar label="Growth Curve" icon={LucideTrendingUp} value={dna.growthCurve} from="#059669" to="#34d399" />
                            </div>
                        </div>

                        <div className="game-card p-5">
                            <h2 className="font-black text-sm text-foreground mb-4 flex items-center gap-2">
                                <LucideAward className="w-4 h-4 text-amber-400" /> Badges
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {EXTRA_DATA.badges.map(badge => (
                                    <span key={badge}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                                        style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <VideoIntroduction />
                        <CertificatesArchive />
                    </div>

                    <div className="game-card p-5">
                        <h2 className="font-black text-sm text-foreground mb-4 flex items-center gap-2">
                            <LucideSwords className="w-4 h-4 text-purple-400" /> Recent Challenges
                        </h2>
                        <div className="space-y-3">
                            {EXTRA_DATA.recent.map((r) => {
                                const d = DIFF[r.difficulty];
                                const solved = r.status === 'Solved';
                                return (
                                    <Link key={r.id} href={`/student/arena?id=${r.id}`}>
                                        <div
                                            className="group p-3 rounded-xl transition-all cursor-pointer"
                                            style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-black text-foreground truncate group-hover:text-purple-400 transition-colors">{r.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider"
                                                            style={{ background: d.bg, color: d.text, border: `1px solid ${d.border}` }}>
                                                            {r.difficulty}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-amber-400">+{r.xp} XP</span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0">
                                                    {solved ? (
                                                        <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400 px-1.5 py-0.5 rounded-md"
                                                            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)' }}>
                                                            <LucideCheckCircle className="w-2.5 h-2.5" /> Solved
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-black text-amber-400 px-1.5 py-0.5 rounded-md"
                                                            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}>
                                                            Attempted
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <Link href="/student/dashboard">
                            <Button variant="outline" size="sm" className="w-full mt-4 text-xs font-bold border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                                View All Missions →
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
