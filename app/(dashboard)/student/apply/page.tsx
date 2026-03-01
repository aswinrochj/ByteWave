'use client';

import { useState, useEffect } from 'react';
import {
    LucideBriefcase, LucideCoins, LucideStar, LucideCheckCircle,
    LucideArrowRight, LucideBuilding2, LucideUsers, LucideMapPin,
    LucideSearch, LucideSparkles, LucideRocket, LucideBrain, LucideGem, LucideShield, LucideLoader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSkillIntelligence } from '@/components/providers/SkillIntelligenceProvider';
import { useUser } from '@/components/providers/UserProvider';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function ApplyInterviewPage() {
    const { dna } = useSkillIntelligence();
    const { user, setUser } = useUser();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [appliedIds, setAppliedIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isApplying, setIsApplying] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const q = query(
                    collection(db, 'jobs'),
                    where('status', '==', 'Active')
                );
                const querySnapshot = await getDocs(q);
                const fetchedJobs = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Dynamic cost mapping
                    const cost = data.isFresher ? 100 : 250;
                    return {
                        id: doc.id,
                        name: "Bytewave Partner", // In a real app, fetch from recruiter profile
                        role: data.title,
                        location: "Remote / On-site",
                        salary: "Competitive",
                        cost: cost,
                        logo: data.isFresher ? LucideRocket : LucideBrain,
                        color: data.isFresher ? "#7c3aed" : "#0ea5e9",
                        applicants: data.applicants || 0,
                        rating: 4.8 + (Math.random() * 0.2),
                        recruiterId: data.recruiterId
                    };
                });
                setJobs(fetchedJobs);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = async (job: any) => {
        const currentCoins = user.byteCoin || 0;
        if (currentCoins < job.cost) {
            alert('Insufficient ByteCoins! Solve more problems in the Arena to earn coins.');
            return;
        }

        if (confirm(`Unlock ${job.role} interview? Cost: ${job.cost} BC`)) {
            setIsApplying(job.id);
            try {
                // 1. Deduct coins
                await setUser({ byteCoin: currentCoins - job.cost });

                // 2. Create application in Firestore
                await addDoc(collection(db, 'applications'), {
                    studentId: user.id,
                    studentName: user.name,
                    studentEmail: user.email,
                    companyName: job.name,
                    role: job.role,
                    cost: job.cost,
                    status: 'Pending',
                    appliedAt: serverTimestamp(),
                    recruiterId: job.recruiterId || 'recruiter_demo',
                });

                setAppliedIds([...appliedIds, job.id]);
                alert('Application submitted successfully!');
            } catch (error) {
                console.error("Application error:", error);
                alert('Failed to submit application. Please try again.');
            } finally {
                setIsApplying(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <LucideLoader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-gray-400 font-mono text-sm animate-pulse">STREAMING JOB VECTORS FROM HYPERSPACE...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* ── HEADER ─────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest">
                        <LucideSparkles className="w-4 h-4" /> Career Gateway
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Interview Pipeline</h1>
                    <p className="text-muted-foreground text-sm max-w-lg">
                        Use your hard-earned <span className="text-emerald-400 font-bold">ByteCoins</span> to unlock exclusive interview opportunities with top-tier technology firms.
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <LucideCoins className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Current Balance</div>
                        <div className="text-2xl font-black text-white leading-none">{dna.byteCoin || 0} <span className="text-sm font-medium text-muted-foreground">BC</span></div>
                    </div>
                </div>
            </div>

            {/* ── SEARCH & FILTERS ───────────────── */}
            <div className="relative group">
                <div className="absolute inset-0 bg-purple-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center">
                    <LucideSearch className="absolute left-4 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search roles or companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus-visible:ring-purple-500/30 transition-all"
                    />
                </div>
            </div>

            {/* ── COMPANY GRID ───────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {jobs.filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase())).map((company) => {
                    const isApplied = appliedIds.includes(company.id);
                    const canAfford = (dna.byteCoin || 0) >= company.cost;
                    const LogoIcon = company.logo;

                    return (
                        <div key={company.id}
                            className={cn(
                                "group relative p-6 rounded-3xl transition-all duration-300 border overflow-hidden",
                                isApplied ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/5 border-white/10 hover:border-purple-500/30 hover:bg-white/[0.07]"
                            )}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[40px] rounded-full pointer-events-none" />

                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
                                        style={{ background: `${company.color}15`, border: `1px solid ${company.color}33` }}>
                                        <LogoIcon className="w-7 h-7" style={{ color: company.color }} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tight">{company.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black bg-white/10 text-purple-300 px-2 py-0.5 rounded-md uppercase tracking-wider">{company.role}</span>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <LucideStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                <span>{company.rating} Rating</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isApplied ? (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-in zoom-in">
                                        <LucideCheckCircle className="w-3 h-3" /> Applied
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                                        <LucideCoins className="w-3 h-3 text-emerald-400" />
                                        {company.cost} BC
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        <LucideMapPin className="w-3 h-3" /> Location
                                    </div>
                                    <div className="text-xs font-bold text-white">{company.location}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        <LucideStar className="w-3 h-3" /> Annual Salary
                                    </div>
                                    <div className="text-xs font-bold text-emerald-400">{company.salary}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        <LucideUsers className="w-3 h-3" /> Active Candidates
                                    </div>
                                    <div className="text-xs font-bold text-white">{company.applicants} Applied</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        <LucideBriefcase className="w-3 h-3" /> Experience
                                    </div>
                                    <div className="text-xs font-bold text-white">Associate to Senior</div>
                                </div>
                            </div>

                            <div className="mt-8 relative z-10">
                                <Button
                                    onClick={() => handleApply(company)}
                                    disabled={isApplied}
                                    className={cn(
                                        "w-full h-12 font-black transition-all gap-2 tracking-widest text-[11px] uppercase",
                                        isApplied ? "bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/20" : "hover:scale-[1.02] active:scale-95 shadow-lg"
                                    )}
                                    style={!isApplied ? {
                                        background: canAfford ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.05)',
                                        color: canAfford ? '#fff' : '#64748b',
                                        border: 'none',
                                        boxShadow: canAfford ? '0 8px 16px rgba(124,58,237,0.2)' : 'none'
                                    } : {}}
                                >
                                    {isApplied ? (
                                        "Application Submitted"
                                    ) : (
                                        <>
                                            Unlock Interview Opportunity <LucideArrowRight className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </Button>
                                {!isApplied && !canAfford && (
                                    <div className="mt-2 text-center text-[10px] text-rose-400 font-bold animate-pulse">
                                        Need {company.cost - (dna.byteCoin || 0)} more ByteCoins to apply
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
