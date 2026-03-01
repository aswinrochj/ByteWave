'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { recentCandidates } from '@/lib/mock-data';
import {
    LucideSearch, LucideFilter, LucideCpu, LucideZap, LucideBrain,
    LucideBriefcase, LucideMail, LucideDna, LucideX, LucideTrendingUp,
    LucideCheckCircle, LucideShieldCheck, LucideAward, LucideTarget, LucideCircuitBoard,
    LucideBrainCircuit, LucideStar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import VideoIntroduction from '@/components/profile/VideoIntroduction';
import CertificatesArchive from '@/components/profile/CertificatesArchive';

const getRank = (score: number) => score >= 93 ? 'S' : score >= 85 ? 'A' : score >= 75 ? 'B' : 'C';
const rankClass = (r: string) => r === 'S' ? 'rank-s' : r === 'A' ? 'rank-a' : r === 'B' ? 'rank-c' : 'rank-c';

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
    'Offer Sent': { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.35)' },
    'Technical Round': { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: 'rgba(96,165,250,0.35)' },
    'Screening': { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.35)' },
    'Portfolio Review': { bg: 'rgba(192,132,252,0.12)', color: '#c084fc', border: 'rgba(192,132,252,0.35)' },
};

export default function CandidatesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [minLogicScore, setMinLogicScore] = useState(0);
    const [selectedRole, setSelectedRole] = useState('All');
    const [sentEmails, setSentEmails] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'sent'>('all');
    const [isSending, setIsSending] = useState<number | null>(null);
    const [viewingDNA, setViewingDNA] = useState<any>(null);
    const [certFilter, setCertFilter] = useState('All');

    const router = useRouter();
    const searchParams = useSearchParams();

    // Handle redirected sent state
    useEffect(() => {
        const sentIdParam = searchParams.get('sent');
        if (sentIdParam) {
            const cleanId = parseInt(sentIdParam.replace('talent-', '').replace('pool-', ''));
            if (!isNaN(cleanId) && !sentEmails.includes(cleanId)) {
                setSentEmails(prev => [...prev, cleanId]);
                setActiveTab('sent');
                // Clean up URL without reload
                router.replace('/recruiter/candidates');
            }
        }
    }, [searchParams, sentEmails, router]);

    const handleSendEmail = (candidate: any) => {
        const firstName = candidate.name.split(' ')[0];
        const mailtoUrl = `mailto:${candidate.email || (candidate.name.toLowerCase().replace(/\s+/g, '.') + '@bytewave.ai')}?subject=Opportunity with Bytewave&body=Hi ${firstName},%0D%0A%0D%0AWe've been reviewing your Logic DNA profile on Bytewave and were exceptionally impressed with your performance in our technical arena.%0D%0A%0D%0AWe'd love to chat about some unique opportunities we have available.%0D%0A%0D%0ABest regards,%0D%0AThe Bytewave Recruitment Team`;

        // 1. Trigger mailto first (Priority)
        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.click();

        setIsSending(candidate.id);

        // 2. Browser finishes update second (Background transition)
        setTimeout(() => {
            if (!sentEmails.includes(candidate.id)) {
                setSentEmails(prev => [...prev, candidate.id]);
            }
            setIsSending(null);
            setActiveTab('sent');
        }, 1500);
    };

    const candidatesToFilter = activeTab === 'all'
        ? recentCandidates.filter(c => !sentEmails.includes(c.id))
        : recentCandidates.filter(c => sentEmails.includes(c.id));

    const filteredCandidates = candidatesToFilter.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLogic = (c.logicScore || 0) >= minLogicScore;
        const matchesRole = selectedRole === 'All' || c.role === selectedRole;

        let matchesCert = true;
        if (certFilter !== 'All') {
            const certs = c.certificates || [];
            if (certFilter === 'Verified') {
                matchesCert = certs.some((cert: any) => cert.badgeType === 'Verified' || cert.badgeType === 'ByteWave Earned');
            } else if (certFilter === 'ByteWave Earned') {
                matchesCert = certs.some((cert: any) => cert.badgeType === 'ByteWave Earned');
            } else if (certFilter === 'Has Certificates') {
                matchesCert = certs.length > 0;
            }
        }

        return matchesSearch && matchesLogic && matchesRole && matchesCert;
    });

    const uniqueRoles = ['All', ...Array.from(new Set(recentCandidates.map(c => c.role)))];

    return (
        <div className="space-y-6">

            {/* ── HEADER ──────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 18px rgba(168,85,247,0.4)' }}>
                        🧬
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground">Candidate Intelligence</h1>
                        <p className="text-muted-foreground text-sm">Filter talent by verified cognitive DNA metrics.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={cn("px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", activeTab === 'all' ? "bg-purple-500 text-white shadow-lg" : "text-white/40 hover:text-white")}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={cn("px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", activeTab === 'sent' ? "bg-purple-500 text-white shadow-lg" : "text-white/40 hover:text-white")}
                        >
                            Sent ({sentEmails.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* ── FILTER BAR ──────────────────────── */}
            <div className="game-card p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name, role, or skill..."
                        className="w-full rounded-xl pl-10 pr-4 py-2 text-sm outline-none"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <label className="text-[10px] text-muted-foreground font-black uppercase tracking-wider whitespace-nowrap">Logic ≥</label>
                    <input
                        type="range" min="0" max="100" value={minLogicScore}
                        onChange={(e) => setMinLogicScore(parseInt(e.target.value))}
                        className="w-full md:w-28 accent-purple-500 cursor-pointer"
                        style={{ accentColor: '#a855f7' }}
                    />
                    <span className="text-sm font-black text-purple-400 w-7">{minLogicScore}</span>
                </div>
                <select
                    className="rounded-xl px-3 py-2 text-sm outline-none w-full md:w-auto"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <select
                    className="rounded-xl px-3 py-2 text-sm outline-none w-full md:w-auto"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    value={certFilter}
                    onChange={(e) => setCertFilter(e.target.value)}
                >
                    <option value="All">All Certifications</option>
                    <option value="Has Certificates">Has Certificates</option>
                    <option value="Verified">Verified</option>
                    <option value="ByteWave Earned">ByteWave Earned</option>
                </select>
            </div>

            {/* ── CANDIDATE GRID ──────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredCandidates.map((candidate) => {
                    const dnaAvg = Math.round(((candidate.logicScore || 0) + (candidate.patternStrength || 0) + (candidate.optimizationRating || 0)) / 3);
                    const rank = getRank(dnaAvg);
                    const status = STATUS_STYLES[candidate.status] ?? { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' };
                    const isSent = sentEmails.includes(candidate.id);

                    return (
                        <div key={candidate.id} className="game-card p-5 flex flex-col group relative overflow-hidden">
                            {isSent && (
                                <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] pointer-events-none z-10" />
                            )}
                            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                                style={{ background: 'linear-gradient(90deg, #7c3aed, #c084fc, #22d3ee)' }} />

                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 relative z-20">
                                <div>
                                    <h3 className="text-base font-black text-foreground group-hover:text-purple-400 transition-colors">
                                        {candidate.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                        <LucideBriefcase className="w-3 h-3" />
                                        {candidate.role}
                                    </div>
                                    <div className="text-[10px] text-purple-400/60 font-medium mt-1 lowercase italic">
                                        {candidate.email}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 text-right">
                                    <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider", rankClass(rank))}>
                                        RANK {rank}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                                        {candidate.status}
                                    </span>
                                    {isSent && (
                                        <span className="text-[8px] font-black uppercase tracking-tighter bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                            <LucideMail className="w-2.5 h-2.5" /> Email Sent
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* DNA Bars */}
                            <div className="space-y-3 mb-4 p-4 rounded-xl relative z-20"
                                style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                                {[
                                    { icon: LucideBrain, label: 'Logic', val: candidate.logicScore || 0, bg: '#7c3aed', end: '#a855f7' },
                                    { icon: LucideCpu, label: 'Pattern', val: candidate.patternStrength || 0, bg: '#0891b2', end: '#22d3ee' },
                                    { icon: LucideZap, label: 'Speed', val: candidate.optimizationRating || 0, bg: '#d97706', end: '#fbbf24' },
                                ].map(({ icon: Icon, label, val, bg, end }) => (
                                    <div key={label} className="flex items-center gap-2 text-xs">
                                        <Icon className="w-3 h-3 shrink-0" style={{ color: end }} />
                                        <span className="text-muted-foreground w-14">{label}</span>
                                        <div className="flex-1 xp-bar">
                                            <div className="xp-bar-fill" style={{ width: `${val}%`, background: `linear-gradient(90deg, ${bg}, ${end})` }} />
                                        </div>
                                        <span className="font-black text-foreground w-6 text-right font-mono text-[11px]">{val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1.5 mb-4 relative z-20">
                                {candidate.skills.slice(0, 3).map(skill => (
                                    <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded"
                                        style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                                        {skill}
                                    </span>
                                ))}
                                {candidate.skills.length > 3 && (
                                    <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded"
                                        style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                                        +{candidate.skills.length - 3}
                                    </span>
                                )}
                            </div>

                            {/* Match Score */}
                            <div className="mb-4 relative z-20 text-center p-3 rounded-xl"
                                style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
                                <span className="text-xl font-black text-purple-400">{candidate.matchScore}%</span>
                                <span className="text-xs text-muted-foreground ml-2 font-bold">Overall Match</span>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto flex gap-2 relative z-20">
                                <Button className="flex-1 h-8 text-xs font-bold"
                                    onClick={() => setViewingDNA(candidate)}
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 0 10px rgba(168,85,247,0.25)' }}>
                                    <LucideDna className="w-3.5 h-3.5 mr-1.5" /> View DNA
                                </Button>
                                {isSent ? (
                                    <Button disabled className="flex-1 h-8 text-xs font-bold bg-emerald-500/10 border-emerald-500/20 text-emerald-400 border grayscale opacity-50">
                                        <LucideMail className="w-3.5 h-3.5 mr-1.5" /> Already Sent
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleSendEmail(candidate)}
                                        disabled={isSending === candidate.id}
                                        variant="outline"
                                        className="flex-1 h-8 text-xs font-bold border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                                    >
                                        {isSending === candidate.id ? (
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                                <span>Sending...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <LucideMail className="w-3.5 h-3.5 mr-1.5" /> Email
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredCandidates.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-30 grayscale">
                    <LucideMail className="w-16 h-16 text-purple-400" />
                    <p className="text-sm font-black uppercase tracking-widest text-white">
                        {activeTab === 'sent' ? 'No emails sent yet' : 'No active candidates found'}
                    </p>
                </div>
            )}

            {/* ── DNA MODAL ─────────────────────── */}
            {viewingDNA && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setViewingDNA(null)} />
                    <div className="relative w-full max-w-4xl game-card p-0 overflow-hidden animate-in zoom-in-95 duration-300 border-purple-500/40 shadow-[0_0_120px_rgba(168,85,247,0.3)]">
                        {/* Decorative background elements */}
                        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

                        {/* Top Bar */}
                        <div className="relative z-10 flex border-b border-white/10 bg-white/5 p-6 justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black relative overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))', border: '1px solid rgba(168,85,247,0.4)', color: '#c084fc' }}>
                                    <div className="absolute inset-0 bg-white/5 animate-pulse" />
                                    {viewingDNA.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{viewingDNA.name}</h2>
                                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-black", rankClass(getRank(Math.round((viewingDNA.logicScore + viewingDNA.patternStrength + viewingDNA.optimizationRating) / 3))))}>
                                            RANK {getRank(Math.round((viewingDNA.logicScore + viewingDNA.patternStrength + viewingDNA.optimizationRating) / 3))}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-purple-300/70 font-bold flex items-center gap-1.5"><LucideCircuitBoard className="w-3.5 h-3.5" /> Logic DNA Fingerprint v4.2</span>
                                        <span className="text-[10px] text-white/20">|</span>
                                        <span className="text-xs text-cyan-400 font-black uppercase tracking-widest">{viewingDNA.role}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setViewingDNA(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white/50 hover:text-white border border-white/10">
                                <LucideX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="relative z-10 grid lg:grid-cols-12 gap-0">
                            {/* Profile Details */}
                            <div className="lg:col-span-12 p-8 space-y-6">
                                {viewingDNA.videoIntroUrl && (
                                    <VideoIntroduction hrView={true} candidateVideoUrl={viewingDNA.videoIntroUrl} />
                                )}

                                <div className="grid md:grid-cols-3 gap-6">
                                    {[
                                        { label: 'Neural Logic', val: viewingDNA.logicScore, icon: LucideBrainCircuit, color: '#a855f7', desc: 'Ability to solve abstract algorithmic patterns and complex edge cases.' },
                                        { label: 'Pattern Mastery', val: viewingDNA.patternStrength, icon: LucideTrendingUp, color: '#22d3ee', desc: 'Speed of recognizing repeating data structures and system architecture.' },
                                        { label: 'Optimization Rating', val: viewingDNA.optimizationRating, icon: LucideTarget, color: '#fbbf24', desc: 'Efficiency of code execution time and memory footprint management.' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-purple-500/30 transition-all group">
                                            <div className="flex justify-between items-start">
                                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-3xl font-black text-white italic">{stat.val}<span className="text-sm opacity-30 italic font-medium">%</span></div>
                                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Decrypted</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5 text-white/60">
                                                    <span>{stat.label}</span>
                                                    <span style={{ color: stat.color }}>STABLE</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                                    <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${stat.val}%`, background: `linear-gradient(90deg, ${stat.color}99, ${stat.color})`, boxShadow: `0 0 15px ${stat.color}44` }} />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-white/40 leading-relaxed font-medium">{stat.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-4">
                                    {/* Tech Stack Decryption */}
                                    <div className="game-card border-none bg-white/5 p-6 rounded-3xl space-y-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10"><LucideCpu className="w-20 h-20" /></div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                            <LucideCircuitBoard className="w-4 h-4" /> Cognitive Tech Stack
                                        </h3>
                                        <div className="flex flex-wrap gap-2.5">
                                            {viewingDNA.skills.map((skill: string) => (
                                                <div key={skill} className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2 group hover:bg-purple-500/20 transition-all">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:animate-pulse" />
                                                    <span className="text-[11px] font-black text-purple-100 uppercase tracking-wider">{skill}</span>
                                                </div>
                                            ))}
                                            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 opacity-40">
                                                <span className="text-[11px] font-black text-white">+ Advanced Core</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                            <div className="text-[10px] text-white/30 font-bold uppercase">Learning Velocity</div>
                                            <div className="flex items-center gap-1.5">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className={cn("w-1.5 h-3 rounded-full", i <= 4 ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "bg-white/10")} />
                                                ))}
                                                <span className="text-[10px] font-black text-purple-400 ml-1">ELITE</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification Status */}
                                    <div className="game-card border-none bg-emerald-500/5 p-6 rounded-3xl space-y-5 border border-emerald-500/10 relative">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                                    <LucideShieldCheck className="w-4 h-4" /> Integrity Verified
                                                </h3>
                                                <p className="text-[10px] text-emerald-400/50 font-medium">Bypassed all anti-cheat neural blocks.</p>
                                            </div>
                                            <LucideAward className="w-8 h-8 text-emerald-400 opacity-50" />
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Plagiarism Audit', status: '0.2%', color: 'text-emerald-400' },
                                                { label: 'Time Regularity', status: 'Optimal', color: 'text-emerald-400' },
                                                { label: 'Space Optimality', status: '94th Pctl', color: 'text-sky-400' },
                                            ].map(row => (
                                                <div key={row.label} className="flex justify-between items-center text-[10px] font-black uppercase py-2 border-b border-emerald-500/5 last:border-0 text-white/70">
                                                    <span>{row.label}</span>
                                                    <span className={row.color}>{row.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="w-full h-8 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] animate-pulse italic">ByteWave Secure Fingerprint Verified</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <CertificatesArchive hrView={true} candidateCerts={viewingDNA.certificates || []} />
                                </div>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-8 bg-black/40 border-t border-white/10 relative z-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div>
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Overall DNA Synergy</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-white italic">{viewingDNA.matchScore}%</span>
                                        <span className="text-sm font-black text-purple-400">SCORE</span>
                                    </div>
                                </div>
                                <div className="hidden md:block w-[1px] h-10 bg-white/10" />
                                <div className="hidden md:flex gap-4">
                                    <div className="text-center">
                                        <div className="text-xs font-black text-white">4.2ms</div>
                                        <div className="text-[8px] font-bold text-white/30 uppercase">Avg Response</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-black text-white">Top 2%</div>
                                        <div className="text-[8px] font-bold text-white/30 uppercase">Global Pool</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Button
                                    variant="outline"
                                    className="flex-1 md:flex-none h-12 px-8 text-xs font-black uppercase tracking-widest border-white/10 text-white hover:bg-white/5"
                                    onClick={() => setViewingDNA(null)}
                                >
                                    Close Scan
                                </Button>
                                <Button
                                    className="flex-1 md:flex-none h-12 px-10 text-xs font-black uppercase tracking-widest border-none relative group overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}
                                    onClick={() => {
                                        handleSendEmail(viewingDNA);
                                        setViewingDNA(null);
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <LucideMail className="w-4 h-4 mr-2 relative z-10" />
                                    <span className="relative z-10">Initiate Contact</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
