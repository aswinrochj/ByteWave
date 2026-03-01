'use client';

import { LucideSearch, LucideUserPlus, LucideMoreHorizontal, LucideX, LucideUser, LucideMail, LucideFingerprint, LucideShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_STUDENTS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const getRank = (score: number) => score >= 96 ? 'S' : score >= 93 ? 'A' : score >= 90 ? 'B' : 'C';
const rankClass = (r: string) => r === 'S' ? 'rank-s' : r === 'A' ? 'rank-a' : r === 'B' ? 'rank-b' : 'rank-c';

export default function InstitutionStudentsPage() {
    const [students, setStudents] = useState(MOCK_STUDENTS);
    const [search, setSearch] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        id_number: '',
        password: '',
        department: 'Computer Science'
    });

    const filtered = students
        .filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.id_number.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newStudent = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            id_number: formData.id_number,
            gpa: (Math.random() * (4.0 - 2.5) + 2.5).toFixed(1), // Random GPA for mock
            skill_score: Math.floor(Math.random() * (100 - 60) + 60), // Random Score for mock
            status: "Developing"
        };

        setStudents([newStudent, ...students]);
        setFormData({ name: '', email: '', id_number: '', password: '', department: 'Computer Science' });
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* ── HEADER ─────────────────────────── */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 18px rgba(124,58,237,0.4)' }}>
                        🎓
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground">Student Roster</h1>
                        <p className="text-muted-foreground text-sm">{MOCK_STUDENTS.length} enrolled — manage profiles and performance</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="font-bold h-11 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}
                >
                    <LucideUserPlus className="w-4 h-4 mr-2" /> Add Student
                </Button>
            </div>

            {/* ── TABLE CARD ─────────────────────── */}
            <div className="game-card overflow-hidden">
                {/* Search + actions */}
                <div className="p-4 border-b flex items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
                    <div className="relative w-64">
                        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            placeholder="Search students…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                            style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-foreground">Export CSV</Button>
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-foreground">Filter</Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr style={{ background: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}>
                                {['#', 'Student', 'ID Number', 'GPA', 'Skill Score', 'Status', ''].map(h => (
                                    <th key={h} className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((student, i) => {
                                const rank = getRank(student.skill_score);
                                return (
                                    <tr
                                        key={student.id}
                                        className="group transition-colors"
                                        style={{ borderBottom: '1px solid var(--border)' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--secondary)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <td className="px-5 py-4">
                                            <span className="text-[11px] font-black text-muted-foreground font-mono">#{i + 1}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                                                    style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(192,132,252,0.1))', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-foreground group-hover:text-purple-400 transition-colors text-sm">{student.name}</div>
                                                    <div className="text-[11px] text-muted-foreground">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{student.id_number}</td>
                                        <td className="px-5 py-4">
                                            <span className="font-black text-foreground">{student.gpa}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-foreground">{student.skill_score}</span>
                                                <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase", rankClass(rank))}>
                                                    {rank}
                                                </span>
                                                <div className="w-20 xp-bar hidden md:block" style={{ background: 'rgba(168,85,247,0.1)' }}>
                                                    <div className="xp-bar-fill" style={{ width: `${student.skill_score}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn("text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-wide",
                                                student.status === 'Outstanding' ? 'text-emerald-400' :
                                                    student.status === 'Developing' ? 'text-orange-400' : 'text-purple-400'
                                            )}
                                                style={{
                                                    background: student.status === 'Outstanding' ? 'rgba(52,211,153,0.12)' :
                                                        student.status === 'Developing' ? 'rgba(249,115,22,0.12)' : 'rgba(168,85,247,0.12)',
                                                    border: `1px solid ${student.status === 'Outstanding' ? 'rgba(52,211,153,0.3)' : student.status === 'Developing' ? 'rgba(249,115,22,0.3)' : 'rgba(168,85,247,0.3)'}`,
                                                }}
                                            >
                                                {student.status === 'Outstanding' ? '⭐ ' : student.status === 'Developing' ? '⚡ ' : '✨ '}
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                <LucideMoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── ADD STUDENT MODAL ──────────────── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative w-full max-w-lg game-card shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <LucideUserPlus className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-white">Enroll New Student</h3>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Fill details to create login</p>
                                </div>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                <LucideX className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Full Name</label>
                                <div className="relative">
                                    <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/20 bg-[#1c1926] border border-[#2d264a] text-white"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Email Address</label>
                                    <div className="relative">
                                        <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/20 bg-[#1c1926] border border-[#2d264a] text-white"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Student ID (Roll No)</label>
                                    <div className="relative">
                                        <LucideFingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/20 bg-[#1c1926] border border-[#2d264a] text-white"
                                            placeholder="KIT-2026-XXX"
                                            value={formData.id_number}
                                            onChange={e => setFormData({ ...formData, id_number: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Temporary Password</label>
                                <div className="relative">
                                    <LucideShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/20 bg-[#1c1926] border border-[#2d264a] text-white"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="ghost" className="flex-1 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-white/5" onClick={() => setIsAddModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}>
                                    Create Account
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
