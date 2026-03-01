'use client';

import { useState, useEffect } from 'react';
import {
    LucideSearch, LucideFilter, LucideMail, LucideCheckCircle,
    LucideXCircle, LucideClock, LucideDna, LucideStar,
    LucideBriefcase, LucideArrowRight, LucideMoreVertical,
    LucideX, LucideTrendingUp, LucideCpu, LucideShieldCheck,
    LucideAward, LucideTarget, LucideCircuitBoard, LucideBrainCircuit, LucideLoader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const getRank = (score: number) => score >= 93 ? 'S' : score >= 85 ? 'A' : score >= 75 ? 'B' : 'C';
const rankClass = (r: string) => r === 'S' ? 'rank-s' : r === 'A' ? 'rank-a' : r === 'B' ? 'rank-c' : 'rank-c';

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; icon: any }> = {
    'Pending': { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', icon: LucideClock },
    'Under Review': { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', icon: LucideClock },
    'Screening': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', icon: LucideSearch },
    'Technical Round': { color: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.2)', icon: LucideDna },
    'Offer Sent': { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', icon: LucideCheckCircle },
    'Accepted': { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', icon: LucideCheckCircle },
    'Rejected': { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', icon: LucideXCircle },
};

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [viewingDNA, setViewingDNA] = useState<any>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                // In a real app, use user.id instead of 'recruiter_demo'
                const q = query(
                    collection(db, 'applications'),
                    where('recruiterId', '==', 'recruiter_demo')
                );
                const querySnapshot = await getDocs(q);
                const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                fetched.sort((a: any, b: any) => {
                    const tA = a.appliedAt?.seconds || 0;
                    const tB = b.appliedAt?.seconds || 0;
                    return tB - tA;
                });
                setApplications(fetched);
            } catch (err) {
                console.error("Error fetching apps:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const updateStatus = async (appId: string, newStatus: string) => {
        if (!appId || typeof appId !== 'string') {
            console.error("Invalid Application ID provided to updateStatus:", appId);
            return;
        }
        try {
            const appRef = doc(db, 'applications', appId);
            await updateDoc(appRef, { status: newStatus });
            setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    const handleSendEmail = async (candidate: any) => {
        if (!candidate || !candidate.id) {
            console.error("Cannot send email: Candidate ID is missing");
            return;
        }
        const firstName = candidate.studentName?.split(' ')[0] || 'Candidate';
        const mailtoUrl = `mailto:${candidate.studentEmail}?subject=Selection with Bytewave Intelligence&body=Hi ${firstName},%0D%0A%0D%0AWe're impressed with your Logic DNA. Let's move forward.%0D%0A%0D%0ABest regards,%0D%0AHiring Manager`;
        window.open(mailtoUrl);
        await updateStatus(candidate.id.toString(), 'Offer Sent');
    };

    const filtered = applications.filter(app => {
        const name = app.studentName || '';
        const role = app.role || '';
        const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
            role.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <LucideLoader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-gray-400 font-mono text-sm animate-pulse">DECRYPTING INBOUND SIGNALS...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── HEADER ──────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 18px rgba(168,85,247,0.4)' }}>
                        📄
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground">Inbound Applications</h1>
                        <p className="text-muted-foreground text-sm">Review candidate applications and Logic DNA fits.</p>
                    </div>
                </div>
            </div>

            {/* ── CONTROLS ────────────────────────── */}
            <div className="game-card p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        className="w-full rounded-xl pl-10 pr-4 py-2 text-sm outline-none"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                    {['All', 'Under Review', 'Technical Round', 'Offer Sent'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={cn(
                                "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                filterStatus === s ? "bg-purple-500 text-white shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── APPLICATIONS LIST ───────────────── */}
            <div className="grid gap-4">
                {filtered.map((app) => {
                    const status = STATUS_CONFIG[app.status] || STATUS_CONFIG['Under Review'];
                    const StatusIcon = status.icon;

                    return (
                        <div key={app.id} className="game-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group relative overflow-hidden hover:scale-[1.005] transition-all">
                            <div className="absolute top-0 left-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(180deg, #7c3aed, #a855f7)' }} />

                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0"
                                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))', border: '1px solid rgba(168,85,247,0.2)', color: '#c084fc' }}>
                                    {(app.studentName || 'C').charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-black text-foreground group-hover:text-purple-400 transition-colors uppercase tracking-tight">{app.studentName || 'Anonymous'}</h3>
                                        <div className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <LucideStar className="w-3 h-3" /> MATCH {app.matchScore || 85}%
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5"><LucideBriefcase className="w-3.5 h-3.5" /> {app.role}</span>
                                        <span className="opacity-20">|</span>
                                        <span className="flex items-center gap-1.5"><LucideMail className="w-3.5 h-3.5" /> {app.studentEmail}</span>
                                        <span className="opacity-20">|</span>
                                        <span className="flex items-center gap-1.5"><LucideClock className="w-3.5 h-3.5" /> Applied {app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ background: status.bg, borderColor: status.border, color: status.color }}>
                                    <StatusIcon className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{app.status}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="h-9 w-9 p-0 rounded-xl border-white/10 hover:bg-white/5">
                                        <LucideMoreVertical className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                    <Button
                                        onClick={() => setViewingDNA(app)}
                                        className="h-9 px-4 text-[11px] font-bold gap-2 rounded-xl"
                                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none' }}
                                    >
                                        Review DNA <LucideArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-30 grayscale">
                        <LucideBriefcase className="w-16 h-16 text-purple-400" />
                        <p className="text-sm font-black uppercase tracking-widest text-white">No applications match your criteria</p>
                    </div>
                )}
            </div>

            {/* ── DNA MODAL (Mirrored from Candidates for Consistency) ─────────────────────── */}
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
                                    {viewingDNA.candidate.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{viewingDNA.candidate}</h2>
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

                        {/* Content Grid */}
                        <div className="relative z-10 grid lg:grid-cols-12 gap-0">
                            {/* Stats Panel */}
                            <div className="lg:col-span-12 p-8 space-y-8">
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
