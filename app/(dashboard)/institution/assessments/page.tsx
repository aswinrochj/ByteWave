'use client';

import { LucidePlus, LucideCalendar, LucideUsers, LucideSearch, LucideX, LucideBookOpen, LucideLayers, LucideTarget, LucideHistory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_ASSESSMENTS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const STATUS_STYLES: Record<string, { emoji: string; bg: string; color: string; border: string }> = {
    Active: { emoji: '●', bg: 'rgba(168,85,247,0.12)', color: '#c084fc', border: 'rgba(168,85,247,0.3)' },
    Completed: { emoji: '✓', bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.3)' },
    Draft: { emoji: '✎', bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' },
};

export default function InstitutionAssessmentsPage() {
    const [assessments, setAssessments] = useState(MOCK_ASSESSMENTS);
    const [search, setSearch] = useState('');
    const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTopic, setNewTopic] = useState('');

    const filtered = assessments.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.department.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        const newAssessment = {
            id: Date.now(),
            title: newTopic,
            status: 'Active',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            candidates: 0,
            department: 'Computer Science',
            avgScore: 0
        };

        setAssessments([...assessments, newAssessment]);
        setIsCreateModalOpen(false);
        setNewTopic('');
    };

    return (
        <div className="space-y-6">

            {/* ── HEADER ──────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 18px rgba(124,58,237,0.4)' }}>
                        📋
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground">Assessments</h1>
                        <p className="text-muted-foreground text-sm">Manage and monitor academic evaluations.</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="font-bold h-11 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}
                >
                    <LucidePlus className="w-4 h-4 mr-2" /> New Assessment
                </Button>
            </div>

            {/* ── FILTER BAR ──────────────────────── */}
            <div className="game-card p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search assessments..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    />
                </div>
                <div className="flex gap-2 ml-auto shrink-0">
                    <Button variant="outline" size="sm" className="text-xs font-bold border-purple-500/25 text-purple-400 hover:bg-purple-500/10">Status</Button>
                    <Button variant="outline" size="sm" className="text-xs font-bold border-purple-500/25 text-purple-400 hover:bg-purple-500/10">Department</Button>
                </div>
            </div>

            {/* ── ASSESSMENT LIST ─────────────────── */}
            <div className="grid gap-4">
                {filtered.map((assessment, i) => {
                    const st = STATUS_STYLES[assessment.status] ?? STATUS_STYLES.Draft;
                    const fromC = i === 0 ? '#7c3aed' : '#a855f7';
                    const toC = i === 0 ? '#a855f7' : '#c084fc';

                    return (
                        <div key={assessment.id}
                            onClick={() => setSelectedAssessment(assessment)}
                            className="game-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group cursor-pointer hover:translate-y-[-2px] transition-all">
                            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                                style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)' }} />

                            <div className="flex items-start gap-4 flex-1 relative z-10">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                                    style={{ background: `linear-gradient(135deg, ${fromC}33, ${fromC}15)`, border: `1px solid ${fromC}44` }}>
                                    {['📚', '⚙️'][i % 2]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-black text-foreground group-hover:text-purple-400 transition-colors">
                                            {assessment.title}
                                        </h3>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider"
                                            style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                                            {st.emoji} {assessment.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><LucideCalendar className="w-3 h-3" /> {assessment.date}</span>
                                        <span className="flex items-center gap-1"><LucideUsers className="w-3 h-3" /> {assessment.candidates} candidates</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded font-bold"
                                            style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                                            {assessment.department}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end relative z-10">
                                {assessment.avgScore > 0 && (
                                    <div className="text-right">
                                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-1">Avg Score</div>
                                        <div className="text-2xl font-black text-purple-400">{assessment.avgScore}%</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── VIEW ASSESSMENT MODAL ──────────── */}
            {selectedAssessment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedAssessment(null)} />
                    <div className="relative w-full max-w-2xl game-card shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between bg-purple-500/5" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <LucideBookOpen className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-white">{selectedAssessment.title}</h3>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{selectedAssessment.department} • {selectedAssessment.status}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAssessment(null)} className="text-muted-foreground hover:text-white transition-colors">
                                <LucideX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 grid md:grid-cols-2 gap-8 text-left">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                        <LucideTarget className="w-3 h-3" /> Performance Insights
                                    </label>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-muted-foreground">Class Average</span>
                                            <span className="text-lg font-black text-purple-400">{selectedAssessment.avgScore}%</span>
                                        </div>
                                        <div className="xp-bar" style={{ background: 'rgba(168,85,247,0.1)' }}>
                                            <div className="xp-bar-fill" style={{ width: `${selectedAssessment.avgScore}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <LucideUsers className="w-4 h-4 text-sky-400 mb-2" />
                                        <div className="text-2xl font-black">{selectedAssessment.candidates}</div>
                                        <div className="text-[10px] font-black text-muted-foreground uppercase">Participants</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <LucideHistory className="w-4 h-4 text-emerald-400 mb-2" />
                                        <div className="text-sm font-black">{selectedAssessment.date}</div>
                                        <div className="text-[10px] font-black text-muted-foreground uppercase">Created Date</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                                    <LucideLayers className="w-3 h-3" /> Assessment Overview
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Complexity', value: 'Moderate' },
                                        { label: 'Evaluation Type', value: 'Logic + Pattern' },
                                        { label: 'Time Allocated', value: '45 Mins' },
                                        { label: 'Verification', value: 'AI Authenticated' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                            <span className="text-xs font-bold text-muted-foreground">{item.label}</span>
                                            <span className="text-xs font-black text-white">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* ── NEW ASSESSMENT MODAL ───────────── */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCreateModalOpen(false)} />
                    <div className="relative w-full max-w-md game-card shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <LucidePlus className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="font-black text-lg text-white">Create Assessment</h3>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                <LucideX className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4 text-left">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Assessment Topic</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/20 bg-[#1c1926] border border-[#2d264a] text-white"
                                    placeholder="e.g. Advanced Data Structures"
                                    value={newTopic}
                                    onChange={e => setNewTopic(e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground mt-2 px-1">
                                    * AI will automatically generate the evaluation questions based on this topic.
                                </p>
                            </div>

                            <Button type="submit" className="w-full h-12 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}>
                                Deploy Assessment
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
