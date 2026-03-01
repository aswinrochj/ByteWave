'use client';

import { useState, useEffect } from 'react';
import {
    LucideCalendar, LucideVideo, LucideUser, LucideClock, LucideChevronRight,
    LucideMic, LucideZap, LucideSettings, LucideUsers, LucideFolder,
    LucideHandshake, LucideX
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TYPE_COLORS: Record<string, { bg: string; color: string; border: string; icon: any }> = {
    'Technical': { bg: 'rgba(168,85,247,0.12)', color: '#c084fc', border: 'rgba(168,85,247,0.3)', icon: LucideSettings },
    'Cultural Fit': { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)', icon: LucideHandshake },
    'HR Round': { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.3)', icon: LucideUsers },
    'Portfolio': { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: 'rgba(96,165,250,0.3)', icon: LucideFolder },
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
    'Confirmed': { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.3)' },
    'Pending': { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
    'Rescheduled': { bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.3)' },
};

export default function RecruiterInterviewsPage() {
    const getMockDate = (offset = 0) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    };

    const [interviews, setInterviews] = useState([
        { id: 1, candidate: 'Aditya Kumar', role: 'Senior Frontend Engineer', time: '10:00 AM', date: getMockDate(0), type: 'Technical', interviewer: 'Priya M.', status: 'Confirmed', day: 'Today' },
        { id: 2, candidate: 'Meera Reddy', role: 'Backend Developer', time: '02:00 PM', date: getMockDate(0), type: 'Cultural Fit', interviewer: 'Rahul K.', status: 'Pending', day: 'Today' },
        { id: 3, candidate: 'John Doe', role: 'Product Manager', time: '11:30 AM', date: getMockDate(1), type: 'HR Round', interviewer: 'Sneha P.', status: 'Confirmed', day: 'Tomorrow' },
        { id: 4, candidate: 'Sarah Smith', role: 'UX Designer', time: '03:30 PM', date: getMockDate(2), type: 'Portfolio', interviewer: 'Arjun V.', status: 'Rescheduled', day: 'Friday' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newInterview, setNewInterview] = useState({
        candidate: '',
        role: '',
        date: getMockDate(0),
        day: 'Today',
        time: '12:00 PM',
        interviewer: 'Self',
        type: 'Technical'
    });

    const isToday = (dateStr: string) => dateStr === getMockDate(0);

    // Stable expiry logic
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setInterviews(prev => {
                const filtered = prev.filter(interview => {
                    try {
                        const [month, dayNum, year] = interview.date.replace(',', '').split(' ');
                        const [time, period] = interview.time.split(' ');
                        let [hours, minutes] = time.split(':').map(Number);
                        if (period === 'PM' && hours < 12) hours += 12;
                        if (period === 'AM' && hours === 12) hours = 0;
                        const interviewDate = new Date(`${month} ${dayNum} ${year} ${hours}:${minutes || '00'}`);
                        // Expire 2 hours after start
                        return now < new Date(interviewDate.getTime() + 120 * 60 * 1000);
                    } catch (e) { return true; }
                });
                return filtered.length === prev.length ? prev : filtered;
            });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const todayList = interviews.filter(i => isToday(i.date));
    const upcomingList = interviews.filter(i => !isToday(i.date));

    const handleSchedule = () => {
        if (!newInterview.candidate || !newInterview.role) return;
        const interview = {
            id: Date.now(),
            ...newInterview,
            status: 'Confirmed'
        };
        setInterviews(prev => [interview, ...prev]);
        setIsModalOpen(false);
        setNewInterview({
            candidate: '', role: '', date: getMockDate(0), day: 'Today',
            time: '12:00 PM', interviewer: 'Self', type: 'Technical'
        });
    };

    const Section = ({ title, icon: Icon, items }: { title: string; icon: any; items: typeof interviews }) => (
        <div>
            <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon className="w-4 h-4 text-purple-400" /> {title}
            </h2>
            <div className="grid gap-3">
                {items.map((interview) => {
                    const typeStyle = TYPE_COLORS[interview.type] ?? TYPE_COLORS.Technical;
                    const statusStyle = STATUS_STYLES[interview.status] ?? STATUS_STYLES.Pending;
                    const TypeIcon = typeStyle.icon;
                    return (
                        <div key={interview.id} className="game-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group relative">
                            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                                style={{ background: 'linear-gradient(90deg, #7c3aed, #c084fc, #22d3ee)' }} />

                            <div className="flex items-center gap-4 flex-1 relative z-10">
                                <div className="text-center shrink-0 w-16 p-2 rounded-xl"
                                    style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                                    <LucideClock className="w-4 h-4 text-purple-400 mx-auto mb-0.5" />
                                    <div className="text-[10px] font-black text-purple-300 ">{interview.time}</div>
                                    {interview.day && <div className="text-[8px] font-bold text-purple-300/50 uppercase">{interview.day}</div>}
                                </div>

                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                                    {interview.candidate.charAt(0)}
                                </div>

                                <div>
                                    <div className="font-black text-foreground text-sm group-hover:text-purple-400 transition-colors">
                                        {interview.candidate}
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-1.5">{interview.role}</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1.5"
                                            style={{ background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}>
                                            <TypeIcon className="w-3 h-3" /> {interview.type}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <LucideUser className="w-3 h-3" /> {interview.interviewer}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end relative z-10">
                                <span className="text-[10px] font-black px-2 py-1 rounded-lg"
                                    style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                                    {interview.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                        style={{ background: 'linear-gradient(135deg, #7c3aed22, #a855f711)' }}>
                        <LucideMic className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground">Scheduled Interviews</h1>
                        <p className="text-muted-foreground text-sm">View and manage upcoming candidate interviews.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs font-bold">
                        Calendar View
                    </Button>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="h-9 text-xs font-bold px-4"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 0 10px rgba(168,85,247,0.3)' }}>
                        + Schedule Interview
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Today", value: todayList.length, color: '#a855f7' },
                    { label: "This Week", value: interviews.length, color: '#22d3ee' },
                    { label: "Confirmed", value: interviews.filter(i => i.status === 'Confirmed').length, color: '#34d399' },
                    { label: "Pending", value: interviews.filter(i => i.status === 'Pending').length, color: '#fbbf24' },
                ].map(s => (
                    <div key={s.label} className="game-card p-4 text-center">
                        <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            <Section title="Today" icon={LucideZap} items={todayList} />
            {upcomingList.length > 0 && <Section title="Upcoming" icon={LucideCalendar} items={upcomingList} />}

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-md game-card p-8 space-y-6 animate-in zoom-in-95 duration-200 border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.2)]">
                        <div className="flex justify-between items-center text-white">
                            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter italic">
                                <LucideCalendar className="w-5 h-5 text-purple-400" /> Schedule Interview
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                <LucideX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Candidate Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Rahul Sharma"
                                    value={newInterview.candidate}
                                    onChange={e => setNewInterview({ ...newInterview, candidate: e.target.value })}
                                    className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Position / Role</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Backend Lead"
                                    value={newInterview.role}
                                    onChange={e => setNewInterview({ ...newInterview, role: e.target.value })}
                                    className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Date</label>
                                    <input
                                        type="text"
                                        value={newInterview.date}
                                        onChange={e => setNewInterview({ ...newInterview, date: e.target.value })}
                                        className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Day</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Monday"
                                        value={newInterview.day}
                                        onChange={e => setNewInterview({ ...newInterview, day: e.target.value })}
                                        className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Timing</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 10:00 AM"
                                        value={newInterview.time}
                                        onChange={e => setNewInterview({ ...newInterview, time: e.target.value })}
                                        className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Interviewer Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sneha P."
                                        value={newInterview.interviewer}
                                        onChange={e => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                                        className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-purple-300/50">Interview Type</label>
                                <select
                                    value={newInterview.type}
                                    onChange={e => setNewInterview({ ...newInterview, type: e.target.value })}
                                    className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 transition-all text-white appearance-none"
                                >
                                    <option>Technical</option>
                                    <option>Cultural Fit</option>
                                    <option>HR Round</option>
                                    <option>Portfolio</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            className="w-full py-7 font-black uppercase tracking-widest text-xs mt-2"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 0 15px rgba(168,85,247,0.4)' }}
                            onClick={handleSchedule}
                        >
                            Schedule Now
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
