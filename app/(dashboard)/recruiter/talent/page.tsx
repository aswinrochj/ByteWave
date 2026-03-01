'use client';

import {
    LucideFilter, LucideBriefcase, LucideZap, LucideTrendingUp, LucideStar,
    LucideFileText, LucideMoreHorizontal, LucideSearch, LucideCircuitBoard,
    LucideCheckCircle, LucideSettings, LucideFolder, LucideX, LucideLoader2,
    LucideBrainCircuit, LucideDna, LucideUsers, LucideTarget, LucideMail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { recentCandidates, LEADERBOARD_MEMBERS } from '@/lib/mock-data';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const EXTENDED_TALENT_POOL = LEADERBOARD_MEMBERS.map(m => ({
    id: `pool-${m.id}`,
    name: m.name,
    email: `${m.username.replace('@', '')}@talentcloud.ai`,
    role: m.role === 'Student' ? 'Software Engineer' : m.role,
    matchScore: m.skill_score,
    status: 'Pool',
    skills: m.languages,
    logicScore: Math.floor(m.skill_score * 0.95),
    patternStrength: Math.floor(m.skill_score * 0.9),
    optimizationRating: Math.floor(m.skill_score * 0.85),
    growthCurve: m.streak
}));

const ALL_CANDIDATES = [...recentCandidates, ...EXTENDED_TALENT_POOL];

const STATUS_MAP: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
    'Offer Sent': { label: 'Offer Sent', icon: LucideCheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)' },
    'Technical Round': { label: 'Tech Round', icon: LucideSettings, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)' },
    'Screening': { label: 'Screening', icon: LucideSearch, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)' },
    'Portfolio Review': { label: 'Portfolio', icon: LucideFolder, color: '#c084fc', bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.35)' },
    'Pool': { label: 'Available', icon: LucideUsers, color: '#22d3ee', bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.35)' },
};

const getRank = (score: number) => score >= 93 ? 'S' : score >= 85 ? 'A' : score >= 75 ? 'B' : 'C';
const rankClass = (r: string) => r === 'S' ? 'rank-s' : r === 'A' ? 'rank-a' : r === 'B' ? 'rank-b' : 'rank-c';

// Score color helper
const getMatchVisuals = (score: number) => {
    if (score >= 85) return { color: '#34d399', label: 'Strong', gradient: 'from-emerald-600 to-emerald-400' };
    if (score >= 65) return { color: '#60a5fa', label: 'Moderate', gradient: 'from-blue-600 to-blue-400' };
    if (score >= 40) return { color: '#fbbf24', label: 'Low', gradient: 'from-amber-600 to-amber-400' };
    return { color: '#f87171', label: 'Weak', gradient: 'from-red-600 to-red-400' };
};

export default function RecruiterTalentPage() {
    const [search, setSearch] = useState('');
    const [isFindTalentOpen, setIsFindTalentOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [hasScanned, setHasScanned] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [sendingId, setSendingId] = useState<string | number | null>(null);
    const router = useRouter();

    // Form states
    const [targetRole, setTargetRole] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [minLogic, setMinLogic] = useState(80);
    const [minPattern, setMinPattern] = useState(75);
    const [minOptimization, setMinOptimization] = useState(70);
    const [minGrowth, setMinGrowth] = useState(10);

    const handleScan = () => {
        setIsScanning(true);
        setHasScanned(false);
        setSelectedId(null);

        setTimeout(() => {
            const basePopulation = [...ALL_CANDIDATES].sort((a, b) => b.matchScore - a.matchScore);

            // Generate exactly 6 results with a realistic distribution
            const distributionRanges = [
                { min: 89, max: 98.2 }, // Strong
                { min: 72, max: 84.5 }, // Moderate
                { min: 65, max: 81.3 }, // Moderate
                { min: 48, max: 63.8 }, // Low
                { min: 41.5, max: 55.4 }, // Low
                { min: 28, max: 39.1 }  // Weak
            ];

            const enhancedSuggestions = distributionRanges.map((range, idx) => {
                const candidate = basePopulation[idx % basePopulation.length];

                // Weight score based on slider inputs (Mocking system intelligence)
                const filterIntensity = (minLogic + minPattern + minOptimization) / 300;
                const rangeWidth = range.max - range.min;
                const baseScore = range.min + (Math.random() * rangeWidth);

                // Final score with decimal precision for credibility
                const finalMatchScore = parseFloat((baseScore + (filterIntensity * 1.5)).toFixed(1));

                const displayRole = targetRole ? targetRole : candidate.role;
                const searchSkills = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
                const displaySkills = searchSkills.length > 0
                    ? [...new Set([...searchSkills, ...candidate.skills])].slice(0, 3)
                    : candidate.skills.slice(0, 3);

                return {
                    ...candidate,
                    role: displayRole,
                    skills: displaySkills,
                    matchScore: finalMatchScore,
                    logicScore: Math.floor(finalMatchScore * 0.94),
                    growthCurve: Math.floor(finalMatchScore * 0.88),
                    activeVisuals: getMatchVisuals(finalMatchScore)
                };
            }).sort((a, b) => b.matchScore - a.matchScore);

            setSuggestions(enhancedSuggestions);
            setIsScanning(false);
            setHasScanned(true);
            if (enhancedSuggestions.length > 0) setSelectedId(enhancedSuggestions[0].id);
        }, 1500);
    };

    const filtered = recentCandidates.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase())
    );

    const activeSuggestion = suggestions.find(s => s.id === selectedId);

    return (
        <div className="space-y-6 min-h-screen pb-10">
            {/* ── HERO BANNER ─────────────────────── */}
            <div className="rounded-2xl p-6 relative overflow-hidden scanlines" style={{ background: 'linear-gradient(135deg, #0b0f1e 0%, #12082e 50%, #0a1a1f 100%)', border: '1px solid rgba(168,85,247,0.22)' }}>
                <div className="absolute top-0 right-1/4 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(50px)' }} />
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 18px rgba(168,85,247,0.45)' }}>
                                <LucideCircuitBoard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Talent Intelligence</h1>
                                <p className="text-purple-300/50 text-sm">Logic DNA™ ranked candidates</p>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {[{ v: ALL_CANDIDATES.length.toString(), l: 'Candidates' }, { v: '94%', l: 'Avg Match' }, { v: 'Live', l: 'Pool' }].map(m => (
                                <div key={m.l} className="text-center px-4 py-1.5 rounded-lg" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                                    <div className="text-sm font-black text-purple-300">{m.v}</div>
                                    <div className="text-[10px] text-purple-400/60 uppercase">{m.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsFindTalentOpen(true)} className="h-10 text-xs font-bold px-5" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 0 14px rgba(168,85,247,0.35)' }}>
                            <LucideSearch className="w-4 h-4 mr-2" /> Find Talent
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── SEARCH ─────────────────────────── */}
            <div className="relative max-w-sm">
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search candidate names…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none shadow-inner" style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
            </div>

            {/* ── CANDIDATE GRID ─────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((candidate) => {
                    const rank = getRank(candidate.matchScore);
                    const status = STATUS_MAP[candidate.status] ?? { label: candidate.status, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)' };
                    return (
                        <div key={candidate.id} className="game-card p-5 flex flex-col group relative overflow-hidden transition-all hover:scale-[1.01]">
                            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #7c3aed, #c084fc, #22d3ee)' }} />
                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.15))', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}>
                                        {candidate.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm text-foreground leading-none mb-1">{candidate.name}</h3>
                                        <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1"><LucideBriefcase className="w-3 h-3" /> {candidate.role}</p>
                                    </div>
                                </div>
                                <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black", rankClass(rank))}><LucideStar className="w-3 h-3" /> RANK {rank}</div>
                            </div>
                            <div className="flex items-center gap-2 mb-4 relative z-10">
                                <span className="text-xs font-black text-purple-400">{candidate.matchScore}% Match</span>
                                <span className="text-muted-foreground opacity-20">|</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5" style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                                    {status.icon && <status.icon className="w-3 h-3" />} {status.label}
                                </span>
                            </div>
                            <div className="space-y-3 mb-4 flex-1 relative z-10">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        <span className="flex items-center gap-1"><LucideZap className="w-3 h-3 text-violet-400" />Logic DNA</span>
                                        <span className="text-foreground">{candidate.logicScore}</span>
                                    </div>
                                    <div className="xp-bar"><div className="xp-bar-fill" style={{ width: `${candidate.logicScore}%` }} /></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        <span className="flex items-center gap-1"><LucideTrendingUp className="w-3 h-3 text-sky-400" />Pattern Mastery</span>
                                        <span className="text-foreground">{candidate.patternStrength}</span>
                                    </div>
                                    <div className="xp-bar" style={{ background: 'rgba(14,165,233,0.15)' }}><div className="xp-bar-fill" style={{ width: `${candidate.patternStrength}%`, background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }} /></div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
                                {candidate.skills.slice(0, 3).map(s => <span key={s} className="text-[9px] font-black px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground">{s}</span>)}
                            </div>
                            <div className="flex gap-2 relative z-10 mt-auto">
                                <Button variant="outline" className="flex-1 h-8 text-[10px] font-black border-purple-500/20 text-purple-400 hover:bg-purple-500/10 uppercase tracking-widest"><LucideFileText className="w-3.5 h-3.5 mr-1" /> Full Report</Button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-colors"><LucideMoreHorizontal className="w-4 h-4" /></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── FIND TALENT MODAL ────────────────── */}
            {isFindTalentOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => { if (!isScanning) setIsFindTalentOpen(false); }} />
                    <div className="relative w-full max-w-5xl game-card p-8 space-y-6 animate-in zoom-in-95 duration-200 shadow-[0_0_100px_rgba(168,85,247,0.4)] border-purple-500/30 my-auto">
                        <div className="flex justify-between items-center text-white border-b border-purple-500/20 pb-4">
                            <h2 className="text-xl font-black flex items-center gap-2 italic uppercase tracking-tighter">
                                <LucideBrainCircuit className="w-6 h-6 text-purple-400" /> Neural Pipeline Analysis
                            </h2>
                            <button onClick={() => setIsFindTalentOpen(false)} className="text-muted-foreground hover:text-white transition-colors bg-white/5 p-1 rounded-lg">
                                <LucideX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-8">
                            {/* Input Panel */}
                            <div className="lg:col-span-4 space-y-6 border-r border-purple-500/10 pr-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50 flex justify-between">
                                            <span>Target Role</span>
                                            {targetRole && <LucideCheckCircle className="w-3 h-3 text-emerald-400" />}
                                        </label>
                                        <input type="text" placeholder="e.g. Senior Frontend" value={targetRole} onChange={e => setTargetRole(e.target.value)} className="w-full bg-black/60 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50 flex justify-between">
                                            <span>Required Tech Stack</span>
                                            {requiredSkills && <LucideCheckCircle className="w-3 h-3 text-emerald-400" />}
                                        </label>
                                        <input type="text" placeholder="e.g. React, TypeScript" value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} className="w-full bg-black/60 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50 flex items-center justify-between text-white">
                                                <span className="flex items-center gap-1.5"><LucideZap className="w-3 h-3 text-violet-400" /> Min Logic ({minLogic})</span>
                                            </label>
                                            <input type="range" min="0" max="100" value={minLogic} onChange={e => setMinLogic(parseInt(e.target.value))} className="w-full accent-purple-500 h-1.5 bg-purple-900/30 rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50 flex items-center justify-between text-white">
                                                <span className="flex items-center gap-1.5"><LucideBrainCircuit className="w-3 h-3 text-sky-400" /> Min Pattern ({minPattern})</span>
                                            </label>
                                            <input type="range" min="0" max="100" value={minPattern} onChange={e => setMinPattern(parseInt(e.target.value))} className="w-full accent-purple-500 h-1.5 bg-purple-900/30 rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50 flex items-center justify-between text-white">
                                                <span className="flex items-center gap-1.5"><LucideTarget className="w-3 h-3 text-amber-400" /> Min Opt ({minOptimization})</span>
                                            </label>
                                            <input type="range" min="0" max="100" value={minOptimization} onChange={e => setMinOptimization(parseInt(e.target.value))} className="w-full accent-purple-500 h-1.5 bg-purple-900/30 rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full py-7 font-black uppercase tracking-widest text-xs gap-3" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 0 20px rgba(168,85,247,0.45)' }} onClick={handleScan} disabled={isScanning}>
                                    {isScanning ? <LucideLoader2 className="w-5 h-5 animate-spin" /> : <LucideCircuitBoard className="w-5 h-5" />}
                                    {isScanning ? 'Syncing Pools...' : 'Scan Talent Cloud'}
                                </Button>
                            </div>

                            {/* Analysis Panel */}
                            <div className="lg:col-span-8 space-y-4 min-h-[450px] flex flex-col">
                                <h3 className="text-[10px] font-black text-purple-300/50 uppercase tracking-widest flex items-center justify-between text-white">
                                    <span>AI Analysis Results</span>
                                    {hasScanned && <span className="text-emerald-400 flex items-center gap-1"><LucideCheckCircle className="w-3 h-3" /> Weights Neutralized</span>}
                                </h3>

                                <div className="flex-1 grid grid-cols-2 gap-6 p-4 rounded-2xl bg-black/40 border border-purple-500/10 relative overflow-hidden">
                                    <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />

                                    {isScanning ? (
                                        <div className="col-span-2 flex flex-col items-center justify-center space-y-4 text-center">
                                            <div className="w-16 h-16 rounded-full border-2 border-purple-500/10 border-t-purple-500 animate-spin flex items-center justify-center">
                                                <LucideBrainCircuit className="w-8 h-8 text-purple-400 animate-pulse" />
                                            </div>
                                            <p className="text-sm font-black text-purple-300 uppercase italic tracking-widest">Processing Logic DNA</p>
                                        </div>
                                    ) : hasScanned && suggestions.length > 0 ? (
                                        <>
                                            <div className="space-y-2 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                                                {suggestions.map(s => (
                                                    <div key={s.id} onClick={() => setSelectedId(s.id)} className={cn("p-3 rounded-xl border transition-all cursor-pointer group flex items-center justify-between", selectedId === s.id ? "bg-purple-500/20 border-purple-500/50" : "bg-white/5 border-white/10 hover:bg-white/10")}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc' }}>{s.name.charAt(0)}</div>
                                                            <div>
                                                                <div className="text-xs font-black text-white">{s.name}</div>
                                                                <div className="text-[9px] font-bold" style={{ color: s.activeVisuals.color }}>{s.matchScore}% FIT</div>
                                                            </div>
                                                        </div>
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.activeVisuals.color }} />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-purple-500/5 rounded-2xl border border-purple-500/20 p-5 space-y-5 animate-in fade-in slide-in-from-right-4 duration-500 text-white">
                                                {activeSuggestion ? (
                                                    <>
                                                        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                                                            <div>
                                                                <div className="text-sm font-black text-white">{activeSuggestion.name}</div>
                                                                <div className="text-[10px] font-bold uppercase" style={{ color: activeSuggestion.activeVisuals.color }}>{activeSuggestion.activeVisuals.label} Candidate</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-lg font-black text-white italic">{activeSuggestion.matchScore}%</div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-4 pt-1">
                                                            {[
                                                                { label: 'DNA MATCH', val: activeSuggestion.matchScore, icon: LucideDna, color: activeSuggestion.activeVisuals.color, bar: activeSuggestion.activeVisuals.gradient },
                                                                { label: 'LOGIC AGILITY', val: activeSuggestion.logicScore, icon: LucideBrainCircuit, color: 'text-cyan-400', bar: 'from-cyan-600 to-cyan-400' },
                                                                { label: 'GROWTH FACTOR', val: activeSuggestion.growthCurve || 0, icon: LucideTrendingUp, color: 'text-emerald-400', bar: 'from-emerald-600 to-emerald-400' },
                                                            ].map(m => (
                                                                <div key={m.label} className="space-y-1.5">
                                                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                                                        <span className={cn("flex items-center gap-1")} style={{ color: m.label === 'DNA MATCH' ? m.color : undefined }}><m.icon className="w-3 h-3" /> {m.label}</span>
                                                                        <span className="text-white">{m.val}%</span>
                                                                    </div>
                                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                                        <div className={cn("h-full bg-gradient-to-r transition-all duration-1000", m.bar)} style={{ width: `${m.val}%` }} />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {activeSuggestion.skills.map((skill: string) => (
                                                                <span key={skill} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            <Button className="h-8 text-[9px] font-black uppercase tracking-widest" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
                                                                Add to Pipeline
                                                            </Button>
                                                            <Button
                                                                className="h-8 text-[9px] font-black uppercase tracking-widest group"
                                                                variant="outline"
                                                                disabled={!!sendingId}
                                                                onClick={() => {
                                                                    setSendingId(activeSuggestion.id);
                                                                    setTimeout(() => {
                                                                        const cleanId = activeSuggestion.id.toString().replace('pool-', '').replace('talent-', '');
                                                                        router.push(`/recruiter/candidates?sent=${cleanId}`);
                                                                    }, 1000);
                                                                }}
                                                            >
                                                                {sendingId === activeSuggestion.id ? (
                                                                    <div className="flex items-center gap-1.5 text-purple-400">
                                                                        <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                                                        <span>Syncing...</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <LucideMail className="w-3 h-3 mr-1.5 group-hover:animate-bounce" /> Email Candidate
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-center opacity-30 italic text-xs font-bold leading-relaxed">
                                                        Select a profile to decrypt<br />Logic DNA fingerprints
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : hasScanned ? (
                                        <div className="col-span-2 flex flex-col items-center justify-center space-y-2 opacity-50">
                                            <LucideFilter className="w-10 h-10 text-purple-400" />
                                            <p className="text-xs font-black text-white">Zero DNA matches found.</p>
                                        </div>
                                    ) : (
                                        <div className="col-span-2 flex flex-col items-center justify-center space-y-4 opacity-15 grayscale">
                                            <LucideBrainCircuit className="w-20 h-20 text-purple-400" />
                                            <p className="text-xs font-black uppercase tracking-[0.3em] text-white">System Standby</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
