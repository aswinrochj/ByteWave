'use client';

import { LucideBriefcase, LucidePlus, LucideUsers, LucideEye, LucideMoreHorizontal, LucideZap, LucideX, LucideLayout, LucideGraduationCap, LucideLoader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function RecruiterJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPostJobOpen, setIsPostJobOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    // New Job Form State
    const [title, setTitle] = useState('');
    const [isFresher, setIsFresher] = useState(true);
    const [department, setDepartment] = useState('Engineering');
    const [type, setType] = useState('Full Time');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // In a real app, filter by user.id
                const q = query(
                    collection(db, 'jobs'),
                    where('recruiterId', '==', 'recruiter_demo')
                );
                const querySnapshot = await getDocs(q);
                const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Client-side sort by newest
                fetched.sort((a: any, b: any) => {
                    const tA = a.createdAt?.seconds || 0;
                    const tB = b.createdAt?.seconds || 0;
                    return tB - tA;
                });
                setJobs(fetched);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handlePostJob = async () => {
        if (!title) return;
        setIsPosting(true);
        try {
            const jobData = {
                title: title + (isFresher ? " (Fresher)" : ""),
                applicants: 0,
                status: 'Active',
                department,
                type,
                isFresher,
                recruiterId: 'recruiter_demo', // Standard Demo ID
                createdAt: serverTimestamp(),
            };
            const docRef = await addDoc(collection(db, 'jobs'), jobData);
            setJobs([{ id: docRef.id, ...jobData, createdAt: { seconds: Date.now() / 1000 } }, ...jobs]);
            setIsPostJobOpen(false);
            setTitle('');
        } catch (err) {
            console.error("Error posting job:", err);
        } finally {
            setIsPosting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <LucideLoader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-gray-400 font-mono text-sm animate-pulse">RECONSTRUCTING CAREER VECTORS...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* ── HEADER ─────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 16px rgba(168,85,247,0.4)' }}>
                            💼
                        </div>
                        <h1 className="text-2xl font-black text-foreground">Job Listings</h1>
                    </div>
                    <p className="text-muted-foreground text-sm ml-[52px]">Manage open roles and track applicant flow.</p>
                </div>
                <Button
                    onClick={() => setIsPostJobOpen(true)}
                    className="font-bold"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 0 14px rgba(168,85,247,0.35)' }}
                >
                    <LucidePlus className="w-4 h-4 mr-2" /> Post New Job
                </Button>
            </div>

            {/* ── JOB CARDS ──────────────────────── */}
            <div className="grid gap-4">
                {jobs.map((job, i) => (
                    <div key={job.id} className="game-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
                        {/* Gradient top bar on hover */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                            style={{ background: 'linear-gradient(90deg, #7c3aed, #c084fc, #22d3ee)' }} />

                        <div className="flex items-center gap-4 flex-1 relative z-10">
                            {/* Job icon */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                                style={{
                                    background: `linear-gradient(135deg, rgba(124,58,237,${0.3 - i * 0.05}), rgba(168,85,247,${0.15 - i * 0.02}))`,
                                    border: '1px solid rgba(168,85,247,0.3)',
                                }}
                            >
                                {['🚀', '⚙️', '📊', '🛡'][i] ?? '💼'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-black text-foreground group-hover:text-purple-400 transition-colors">
                                        {job.title}
                                    </h3>
                                    <span className={cn("text-[10px] uppercase font-black px-2 py-0.5 rounded-lg tracking-wider",
                                        job.status === 'Active'
                                            ? 'text-emerald-400'
                                            : 'text-amber-400'
                                    )}
                                        style={{
                                            background: job.status === 'Active' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.1)',
                                            border: `1px solid ${job.status === 'Active' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
                                        }}
                                    >
                                        {job.status === 'Active' ? '● Active' : '⏸ On Hold'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                    <span className="flex items-center gap-1"><LucideUsers className="w-3 h-3" /> {job.applicants} Applicants</span>
                                    <span className="flex items-center gap-1"><LucideZap className="w-3 h-3" /> Full Time</span>
                                    <span>• Remote</span>
                                </div>
                            </div>
                        </div>

                        {/* XP bar showing fill level */}
                        <div className="w-full md:w-32 relative z-10">
                            <div className="text-[10px] text-muted-foreground mb-1 flex justify-between">
                                <span>Pipeline</span>
                                <span className="text-purple-400 font-bold">{Math.min(Math.round(job.applicants / 1.5), 100)}%</span>
                            </div>
                            <div className="xp-bar">
                                <div className="xp-bar-fill" style={{ width: `${Math.min(Math.round(job.applicants / 1.5), 100)}%` }} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 relative z-10" style={{ borderColor: 'var(--border)' }}>
                            <Link href="/recruiter/applications">
                                <Button variant="outline" size="sm" className="text-xs font-bold border-purple-500/20 text-purple-400 hover:bg-purple-500/10">
                                    <LucideEye className="w-4 h-4 mr-2" /> Applications
                                </Button>
                            </Link>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg"
                                style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                                <LucideMoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* ── POST JOB MODAL ────────────────── */}
            {isPostJobOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsPostJobOpen(false)} />
                    <div className="relative w-full max-w-lg game-card p-8 space-y-6 animate-in zoom-in-95 duration-200 border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.25)]">
                        <div className="flex justify-between items-center text-white">
                            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter italic">
                                <LucidePlus className="w-5 h-5 text-purple-400" /> Opening for Freshers
                            </h2>
                            <button onClick={() => setIsPostJobOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                <LucideX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Role Title</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Associate Software Engineer"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-white/10"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Department</label>
                                    <select
                                        value={department}
                                        onChange={e => setDepartment(e.target.value)}
                                        className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white appearance-none"
                                    >
                                        <option value="Engineering">Engineering</option>
                                        <option value="Design">Design</option>
                                        <option value="Product">Product</option>
                                        <option value="QA">Quality Assurance</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Job Type</label>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value)}
                                        className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white appearance-none"
                                    >
                                        <option value="Full Time">Full Time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                            </div>

                            <div
                                className={cn(
                                    "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group",
                                    isFresher ? "bg-purple-500/20 border-purple-500/50" : "bg-black/20 border-white/10 hover:border-white/20"
                                )}
                                onClick={() => setIsFresher(!isFresher)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                        isFresher ? "bg-purple-500 text-white" : "bg-white/5 text-purple-400"
                                    )}>
                                        <LucideGraduationCap className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-black text-white uppercase italic tracking-wider">Fresher Intake</div>
                                        <div className="text-[9px] text-purple-300/50 font-bold">Candidates with 0-1 years exp</div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    isFresher ? "border-purple-400 bg-purple-400" : "border-white/10"
                                )}>
                                    {isFresher && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full py-7 font-black uppercase tracking-widest text-xs mt-2"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 0 15px rgba(168,85,247,0.4)' }}
                            onClick={handlePostJob}
                            disabled={isPosting}
                        >
                            {isPosting ? <><LucideLoader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</> : 'Publish Opening'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
