'use client';

import { LucideBell, LucidePalette, LucideCheck, LucideCircle, LucideSettings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/ThemeProvider';

const TABS = [
    { id: 'notifications', icon: LucideBell, label: 'Notifications' },
    { id: 'appearance', icon: LucidePalette, label: 'Appearance' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('notifications');
    const { theme, setTheme } = useTheme();

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        achievements: true,
        system: true
    });

    const themes = [
        { id: 'dark', label: 'Stellar Purple', color: '#0a0518', desc: 'Deep cosmic violet for focused sessions' },
        { id: 'light', label: 'Soft Lavender', color: '#fdfaff', desc: 'Professional clarity with a touch of violet' },
        { id: 'midnight', label: 'Royal Amethyst', color: '#030014', desc: 'Deep luxury purple with high-contrast text' },
    ] as const;

    const notificationItems = [
        { id: 'email', label: 'Email Alerts', desc: 'Weekly activity summaries & match alerts' },
        { id: 'push', label: 'Push Notifications', desc: 'Get notified of important platform updates' },
        { id: 'achievements', label: 'Achievement Alerts', desc: 'Celebrate unlocks and platform milestones' },
        { id: 'system', label: 'System Reminders', desc: 'Important alerts about your account status' },
    ] as const;

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* ── HEADER ─────────────────────────── */}
            <div
                className="rounded-2xl p-6 relative overflow-hidden scanlines"
                style={{ background: 'linear-gradient(135deg, #0b0f1e 0%, #14082e 50%, #0a1525 100%)', border: '1px solid rgba(168,85,247,0.2)' }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-48 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="pulse-ring">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 24px rgba(168,85,247,0.5)' }}>
                            <LucideSettings className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">System Settings</h1>
                        <p className="text-purple-300/50 text-sm">Configure your experience and notification preferences</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* ── SIDEBAR NAV ─────────────────── */}
                <nav className="w-full md:w-56 space-y-2 shrink-0">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 font-bold text-sm",
                                activeTab === tab.id
                                    ? "text-purple-300"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            style={
                                activeTab === tab.id
                                    ? { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', boxShadow: '0 0 10px rgba(168,85,247,0.08)' }
                                    : { background: 'var(--secondary)', border: '1px solid var(--border)' }
                            }
                        >
                            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-purple-400" : "text-muted-foreground")} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* ── CONTENT PANEL ───────────────── */}
                <div className="flex-1 game-card p-7">
                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-5 border-b border-border pb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <LucideBell className="w-5 h-5 text-purple-400" />
                                </div>
                                <h2 className="text-lg font-black text-foreground">Notification Preferences</h2>
                            </div>

                            {notificationItems.map(({ id, label, desc }) => {
                                const isOn = notifications[id as keyof typeof notifications];
                                return (
                                    <div
                                        key={id}
                                        className="flex items-center justify-between p-4 rounded-xl"
                                        style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
                                    >
                                        <div>
                                            <div className="font-black text-foreground text-sm">{label}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                                        </div>
                                        <div
                                            className="w-11 h-6 rounded-full relative cursor-pointer transition-all shrink-0"
                                            onClick={() => setNotifications(prev => ({ ...prev, [id]: !prev[id as keyof typeof notifications] }))}
                                            style={{
                                                background: isOn
                                                    ? 'linear-gradient(90deg, #7c3aed, #a855f7)'
                                                    : 'var(--muted)',
                                                boxShadow: isOn ? '0 0 10px rgba(168,85,247,0.4)' : 'none',
                                            }}
                                        >
                                            <div
                                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all"
                                                style={{ left: isOn ? 'calc(100% - 20px)' : '4px' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-5 border-b border-border pb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <LucidePalette className="w-5 h-5 text-purple-400" />
                                </div>
                                <h2 className="text-lg font-black text-foreground">Appearance</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl transition-all border text-left",
                                            theme === t.id
                                                ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/20"
                                                : "border-border bg-secondary hover:border-purple-500/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-10 h-10 rounded-lg shadow-inner flex items-center justify-center"
                                                style={{ background: t.color, border: '1px solid rgba(255,255,255,0.1)' }}
                                            >
                                                {theme === t.id && <LucideCheck className="w-5 h-5 text-white" />}
                                            </div>
                                            <div>
                                                <div className="font-black text-foreground text-sm">{t.label}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                                            </div>
                                        </div>
                                        {theme === t.id ? (
                                            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            </div>
                                        ) : (
                                            <LucideCircle className="w-5 h-5 text-muted-foreground/30" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 p-4 rounded-xl border border-dashed border-purple-500/20 bg-purple-500/5">
                                <div className="flex items-center gap-3">
                                    <LucidePalette className="w-5 h-5 text-purple-400" />
                                    <div className="text-xs text-purple-300/70 leading-relaxed">
                                        More custom themes and high-contrast modes will be arriving soon.
                                        Your preference is saved locally and synced across your session.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
