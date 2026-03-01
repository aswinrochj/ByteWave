'use client';

import { useState, useEffect } from 'react';
import { LucideCalendar, LucideClock, LucideFileText, LucideArrowRight, LucideCheckCircle, LucideAlertCircle, LucideLoader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
    Active: { label: 'Assigned', icon: LucideAlertCircle, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
    Completed: { label: 'Completed', icon: LucideCheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    Draft: { label: 'Upcoming', icon: LucideClock, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
};

export default function StudentAssessmentsPage() {
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const q = query(
                    collection(db, 'assessments'),
                    where('status', '==', 'Active')
                );
                const querySnapshot = await getDocs(q);
                const fetched = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a: any, b: any) => {
                    const tA = a.createdAt?.seconds || 0;
                    const tB = b.createdAt?.seconds || 0;
                    return tB - tA;
                });
                setAssessments(fetched);
            } catch (error) {
                console.error("Error fetching assessments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <LucideLoader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-gray-400 font-mono text-sm animate-pulse">SYNCHRONISING ASSESSMENTS...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* ── HEADER ──────────────────────────── */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
                    📝
                </div>
                <div>
                    <h1 className="text-2xl font-black text-foreground">Official Assessments</h1>
                    <p className="text-muted-foreground text-sm">Evaluations assigned by your institution.</p>
                </div>
            </div>

            {/* ── ASSESSMENT CARDS ────────────────── */}
            <div className="grid gap-5">
                {assessments.length > 0 ? (
                    assessments.map((assessment, i) => {
                        const config = STATUS_CONFIG[assessment.status] || STATUS_CONFIG.Draft;
                        const isCompleted = assessment.status === 'Completed';

                        return (
                            <div key={assessment.id} className="game-card p-6 group">
                                <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    style={{ background: `linear-gradient(90deg, #7c3aed, #a855f7, ${config.color})` }} />

                                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                    <div className="flex gap-5">
                                        <div className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-2xl"
                                            style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
                                            {assessment.title.toLowerCase().includes('python') ? '🐍' :
                                                assessment.title.toLowerCase().includes('react') ? '⚛️' : '💻'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                <h3 className="text-lg font-black text-foreground group-hover:text-purple-400 transition-colors">
                                                    {assessment.title}
                                                </h3>
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5"
                                                    style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
                                                    <config.icon className="w-3 h-3" />
                                                    {config.label}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                                                <span className="flex items-center gap-1.5"><LucideCalendar className="w-3.5 h-3.5" /> {assessment.date}</span>
                                                <span className="flex items-center gap-1.5"><LucideFileText className="w-3.5 h-3.5" /> {assessment.department}</span>
                                                <span className="px-2 py-0.5 rounded bg-muted/50 border border-border">Timed: 60 Mins</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                                        {isCompleted ? (
                                            <div className="text-right">
                                                <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-0.5">Your Score</div>
                                                <div className="text-2xl font-black text-emerald-400">88%</div>
                                            </div>
                                        ) : (
                                            <Link href={`/assessment/${assessment.id}`}>
                                                <Button className="font-bold gap-2 px-6 h-11"
                                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
                                                    Start Test <LucideArrowRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 game-card">
                        <div className="text-4xl mb-4">📭</div>
                        <h3 className="text-xl font-black text-foreground mb-1">No Assessments Found</h3>
                        <p className="text-muted-foreground">You don't have any assessments assigned at the moment.</p>
                    </div>
                )}
            </div>

            {/* ── NOTES ──────────────────────────── */}
            <div className="rounded-2xl p-6 bg-purple-500/5 border border-purple-500/10">
                <h3 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <LucideAlertCircle className="w-4 h-4" /> Before you start
                </h3>
                <ul className="space-y-2 text-sm text-purple-300/70 list-disc list-inside">
                    <li>Once started, you cannot pause the timer.</li>
                    <li>Ensure you have a stable internet connection.</li>
                    <li>Your code will be automatically saved during the session.</li>
                    <li>Plagiarism checks are active on all institutional assessments.</li>
                </ul>
            </div>
        </div>
    );
}
