'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LucideLayoutDashboard, LucideUsers, LucideSettings, LucideLogOut,
    LucideFileText, LucideAward, LucideBriefcase, LucideGraduationCap, LucideBarChart,
    LucideZap, LucideSwords, LucideChevronRight, LucideBell, LucideMenu, LucideX,
    LucideShield, LucideCalendar, LucideStar, LucideTrophy, LucideUser, LucideFlame,
    LucideCoins, LucideInbox
} from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import { useUser } from '@/components/providers/UserProvider';
import { useSkillIntelligence } from '@/components/providers/SkillIntelligenceProvider';
import { logout } from '@/lib/firebase/auth';

/* ── NAV LINK ─────────────────────────────────── */
function SidebarLink({
    href,
    icon: Icon,
    label,
    badge,
    exact = false,
}: {
    href: string;
    icon: any;
    label: string;
    badge?: string | number;
    exact?: boolean;
}) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 overflow-hidden",
                isActive
                    ? "text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
            )}
            style={
                isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(168,85,247,0.15) 100%)',
                        border: '1px solid rgba(168,85,247,0.45)',
                        boxShadow: '0 0 16px rgba(168,85,247,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }
                    : {
                        background: 'transparent',
                        border: '1px solid transparent',
                    }
            }
            onMouseEnter={e => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.06)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.15)';
                }
            }}
            onMouseLeave={e => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                }
            }}
        >
            {/* Active glow left edge */}
            {isActive && (
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: 'linear-gradient(180deg, #a855f7, #7c3aed)', boxShadow: '0 0 8px #a855f7' }}
                />
            )}

            {/* Icon */}
            <div
                className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
                    isActive
                        ? "bg-purple-500/20"
                        : "group-hover:bg-purple-500/10"
                )}
            >
                <Icon
                    className={cn("w-4 h-4 transition-colors", isActive ? "text-purple-300" : "text-current")}
                />
            </div>

            <span className="text-sm flex-1">{label}</span>

            {badge && (
                <span
                    className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    style={{
                        background: isActive ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.12)',
                        color: '#c084fc',
                        border: '1px solid rgba(168,85,247,0.3)',
                    }}
                >
                    {badge}
                </span>
            )}

            {isActive && (
                <LucideChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            )}
        </Link>
    );
}

/* ── NAV SECTION HEADER ───────────────────────── */
function NavSection({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 px-3 mb-1 mt-4">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.4), transparent)' }} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-400/60 shrink-0">{label}</span>
        </div>
    );
}

/* ── LAYOUT ───────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, initials, clearUser, loading } = useUser();
    const { dna } = useSkillIntelligence();

    // Determine role based on user context first, then fallback to path for unauthenticated states
    const isStudent = user.role === 'student' || pathname.startsWith('/student');
    const isRecruiter = user.role === 'recruiter' || pathname.startsWith('/recruiter');
    const isInstitution = user.role === 'institution' || pathname.startsWith('/institution');

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Dynamic stats from context
    const userLevel = Math.floor(dna.logicScore / 10) + 1;
    const userXp = dna.growthCurve;
    const userRank = 'A'; // Derived from scores in a real app

    const roleConfig = isStudent
        ? { label: 'Developer', emoji: '⚔️', color: '#c084fc', rank: userRank, level: userLevel, xp: userXp, workspace: 'Student Sandbox' }
        : isRecruiter
            ? { label: 'Recruiter', emoji: '🎯', color: '#a855f7', rank: userRank, level: userLevel, xp: userXp, workspace: 'Recruiter Enterprise' }
            : { label: 'Admin', emoji: '🏛️', color: '#e9d5ff', rank: userRank, level: userLevel, xp: userXp, workspace: 'System Admin' };

    const handleSignOut = async () => {
        try {
            await logout();
            clearUser();
            router.push('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 animate-pulse flex items-center justify-center">
                        <span className="text-white font-black italic">BW</span>
                    </div>
                    <div className="text-purple-400 font-black tracking-widest text-[10px] uppercase animate-pulse">Synchronising Intelligence...</div>
                </div>
            </div>
        );
    }

    const SidebarContent = () => (
        <>
            {/* ── LOGO ──────────────────────────── */}
            <div
                className="px-5 h-16 flex items-center gap-3 shrink-0"
                style={{ borderBottom: '1px solid rgba(168,85,247,0.12)' }}
            >
                <Link href="/" className="flex items-center gap-3 group">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                            boxShadow: '0 0 16px rgba(168,85,247,0.45)',
                        }}
                    >
                        <span className="text-white font-black italic text-sm tracking-tighter">BW</span>
                    </div>
                    <div className="leading-none">
                        <span className="font-black text-base tracking-widest text-foreground uppercase">Bytewave</span>
                        <div className="text-[9px] font-bold text-purple-400/70 tracking-widest uppercase">Skill Platform</div>
                    </div>
                </Link>
            </div>

            {/* ── PLAYER CARD ───────────────────── */}
            <div
                className="mx-3 mt-3 p-3.5 rounded-xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(168,85,247,0.08) 100%)',
                    border: '1px solid rgba(168,85,247,0.25)',
                }}
            >
                <div
                    className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(ellipse, ${roleConfig.color}33 0%, transparent 70%)`, filter: 'blur(10px)' }}
                />
                <div className="relative z-10 flex items-center gap-2.5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 font-black"
                        style={{
                            background: 'rgba(0,0,0,0.3)',
                            border: `1px solid ${roleConfig.color}55`,
                            boxShadow: `0 0 12px ${roleConfig.color}33`,
                            color: roleConfig.color,
                        }}
                    >
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-black text-white truncate max-w-[80px]">
                                {user.name || 'Anonymous'}
                            </span>
                            <span
                                className="text-[8px] font-black px-1 py-0.5 rounded-md uppercase tracking-wider"
                                style={{
                                    background: `${roleConfig.color}22`,
                                    color: roleConfig.color,
                                    border: `1px solid ${roleConfig.color}44`,
                                }}
                            >
                                {roleConfig.label}
                            </span>
                        </div>
                        {isStudent && (
                            <>
                                <div className="xp-bar" style={{ height: '4px' }}>
                                    <div className="xp-bar-fill" style={{ width: `${roleConfig.xp}%` }} />
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[8px] text-purple-300/50 font-mono">{roleConfig.xp}/100 XP</span>
                                    <span className="text-[8px] font-black text-amber-400">LVL {roleConfig.level}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── NAV LINKS ─────────────────────── */}
            <nav className="flex-1 px-3 pb-2 overflow-y-auto mt-2 space-y-0.5">
                {isStudent && (
                    <>
                        <NavSection label="Developer" />
                        <SidebarLink href="/student/dashboard" icon={LucideLayoutDashboard} label="Dashboard" />
                        <SidebarLink href="/student/arena" icon={LucideSwords} label="Coding Arena" />
                        <SidebarLink href="/student/assessments" icon={LucideFileText} label="Assessments" />
                        <SidebarLink href="/student/achievements" icon={LucideAward} label="Achievements" />
                        <SidebarLink href="/student/apply" icon={LucideBriefcase} label="Apply Interview" />
                        <NavSection label="Community" />
                        <SidebarLink href="/leaderboard" icon={LucideTrophy} label="Top Performers" />
                    </>
                )}

                {isRecruiter && (
                    <>
                        <NavSection label="Recruitment" />
                        <SidebarLink href="/recruiter" icon={LucideLayoutDashboard} label="Dashboard" exact />
                        <SidebarLink href="/recruiter/jobs" icon={LucideBriefcase} label="Job Listings" />
                        <SidebarLink href="/recruiter/candidates" icon={LucideShield} label="Candidates" />
                        <SidebarLink href="/recruiter/applications" icon={LucideFileText} label="Applications" badge="12" />
                        <SidebarLink href="/recruiter/interviews" icon={LucideCalendar} label="Interviews" badge="4" />
                        <NavSection label="Community" />
                        <SidebarLink href="/leaderboard" icon={LucideTrophy} label="Top Performers" />
                    </>
                )}

                {isInstitution && (
                    <>
                        <NavSection label="Institution" />
                        <SidebarLink href="/institution/dashboard" icon={LucideLayoutDashboard} label="Dashboard" />
                        <SidebarLink href="/institution/students" icon={LucideUsers} label="Student Roster" />
                        <SidebarLink href="/institution/assessments" icon={LucideGraduationCap} label="Assessments" />
                        <NavSection label="Insights" />
                        <SidebarLink href="/institution/analytics" icon={LucideBarChart} label="Analytics" />
                        <NavSection label="Community" />
                        <SidebarLink href="/leaderboard" icon={LucideTrophy} label="Top Performers" />
                    </>
                )}
            </nav>

            {/* ── FOOTER ────────────────────────── */}
            <div
                className="p-3 space-y-0.5 shrink-0"
                style={{ borderTop: '1px solid rgba(168,85,247,0.1)' }}
            >
                <SidebarLink href="/settings" icon={LucideSettings} label="Settings" />
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
                    style={{ color: 'var(--muted-foreground)', border: '1px solid transparent' }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.color = '#f87171';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,113,113,0.2)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                    }}
                >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center">
                        <LucideLogOut className="w-4 h-4" />
                    </div>
                    <span>Sign Out</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>

            {/* ── DESKTOP SIDEBAR ───────────────── */}
            <aside
                className="w-72 flex-col shrink-0 hidden md:flex relative"
                style={{
                    background: 'var(--background)',
                    borderRight: '1px solid rgba(168,85,247,0.12)',
                }}
            >
                <div
                    className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.06) 0%, transparent 70%)' }}
                />
                <div className="relative z-10 flex flex-col h-full">
                    <SidebarContent />
                </div>
            </aside>

            {/* ── MOBILE SIDEBAR ────────────────── */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div
                        className="relative w-80 flex flex-col h-full animate-in slide-in-from-left duration-300"
                        style={{ background: 'var(--background)', borderRight: '1px solid rgba(168,85,247,0.2)' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <button
                            onClick={e => { e.stopPropagation(); setIsMobileMenuOpen(false); }}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg z-10"
                            style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}
                        >
                            <LucideX className="w-4 h-4" />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* ── MAIN AREA ─────────────────────── */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: 'var(--background)' }}>

                {/* ── TOP NAVBAR ────────────────── */}
                <header
                    className="h-20 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30"
                    style={{
                        background: 'var(--background)',
                        borderBottom: '1px solid rgba(168,85,247,0.1)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: '#c084fc' }}
                        >
                            <LucideMenu className="w-4 h-4" />
                        </button>

                        <div className="hidden md:flex items-center gap-2">
                            <div
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                                style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', color: '#c084fc' }}
                            >
                                {roleConfig.emoji}
                                <span>{roleConfig.workspace}</span>
                            </div>
                            <LucideChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-medium capitalize">
                                {pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? 'Overview'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-[10px] font-black text-emerald-400 tracking-wider font-mono">LIVE</span>
                        </div>

                        {/* ── STREAK INDICATOR ──────────── */}
                        {isStudent && (
                            <div
                                title="Your current coding streak"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all hover:bg-orange-500/10"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(234,88,12,0.06))',
                                    border: '1px solid rgba(249,115,22,0.25)',
                                    color: '#f97316',
                                }}
                            >
                                <LucideFlame className="w-3.5 h-3.5 animate-pulse" />
                                <span className="hidden sm:inline">{dna.streak} DAY STREAK</span>
                                <span className="sm:hidden">{dna.streak}d</span>
                            </div>
                        )}

                        {/* ── BYTECOIN BALANCE ──────────── */}
                        {isStudent && (
                            <div
                                title="ByteCoins earned from challenges"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all hover:bg-emerald-500/10"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06))',
                                    border: '1px solid rgba(16,185,129,0.25)',
                                    color: '#10b981',
                                }}
                            >
                                <LucideCoins className="w-3.5 h-3.5" />
                                <span>{dna.byteCoin || 0} BC</span>
                            </div>
                        )}

                        <ModeToggle />

                        <Link href="/profile">
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs cursor-pointer transition-all"
                                style={{
                                    background: `linear-gradient(135deg, ${roleConfig.color}33, ${roleConfig.color}15)`,
                                    border: `1px solid ${roleConfig.color}55`,
                                    color: roleConfig.color,
                                    boxShadow: `0 0 12px ${roleConfig.color}22`,
                                }}
                            >
                                {initials}
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>

                {/* ── FLOATING INBOX ────────── */}
                {isStudent && (
                    <>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group z-50"
                            style={{
                                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                boxShadow: '0 8px 32px rgba(124,58,237,0.3)',
                            }}
                        >
                            <LucideInbox className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            <div
                                className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-rose-500 border-2 border-white dark:border-zinc-900 shadow-sm flex items-center justify-center pointer-events-none"
                            >
                                <span className="text-[8px] font-black text-white">4</span>
                            </div>
                        </button>

                        {/* Simple Notification Panel Proxy */}
                        {isNotificationsOpen && (
                            <div
                                className="fixed bottom-24 right-6 w-80 max-h-[400px] rounded-2xl p-4 shadow-2xl z-50 animate-in slide-in-from-bottom-5 fade-in duration-200"
                                style={{
                                    background: 'var(--card)',
                                    border: '1px solid rgba(168,85,247,0.2)',
                                    backdropFilter: 'blur(20px)'
                                }}
                            >
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                                    <span className="text-xs font-black uppercase tracking-widest text-purple-400">Inbox</span>
                                    <button onClick={() => setIsNotificationsOpen(false)} className="text-muted-foreground hover:text-white">
                                        <LucideX className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { title: 'New Offer Letter!', time: 'Just now', icon: LucideFileText, highlight: true },
                                        { title: 'New Achievement!', time: '2m ago', icon: LucideAward },
                                        { title: 'Coding Arena update', time: '1h ago', icon: LucideZap },
                                        { title: 'System maintenance', time: '5h ago', icon: LucideShield },
                                    ].map((n, i) => (
                                        <div key={i} className={cn(
                                            "flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer",
                                            n.highlight && "bg-purple-500/10"
                                        )}>
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                                <n.icon className={cn("w-4 h-4", n.highlight ? "text-purple-300" : "text-purple-400")} />
                                            </div>
                                            <div>
                                                <div className={cn("text-[11px] font-bold", n.highlight ? "text-purple-300" : "text-foreground")}>{n.title}</div>
                                                <div className="text-[9px] text-muted-foreground">{n.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
