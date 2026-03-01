'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BarChart2, Bell, Settings, LogOut, Menu, X,
    ChevronRight, Home, Brain, Trophy, Wallet, GitBranch,
    Layers, GraduationCap
} from 'lucide-react';
import clsx from 'clsx';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    const role = pathname?.split('/')[2] || 'student'; // dashboard/student -> student

    const getNavItems = (role: string) => {
        switch (role) {
            case 'hr':
                return [
                    { icon: Users, label: 'Candidates', href: '/dashboard/hr' },
                    { icon: GitBranch, label: 'Pipelines', href: '/dashboard/hr/pipelines' },
                    { icon: BarChart2, label: 'Analytics', href: '/dashboard/hr/analytics' },
                ];
            case 'institution':
                return [
                    { icon: GraduationCap, label: 'Classes', href: '/dashboard/institution' },
                    { icon: BarChart2, label: 'Performance', href: '/dashboard/institution/performance' },
                    { icon: Layers, label: 'Assessments', href: '/dashboard/institution/assessments' },
                ];
            default: // student
                return [
                    { icon: Home, label: 'Dashboard', href: '/dashboard/student' },
                    { icon: Brain, label: 'Skill Lab', href: '/dashboard/student/skill-lab' },
                    { icon: Trophy, label: 'Achievements', href: '/dashboard/student/achievements' },
                    { icon: Wallet, label: 'Rewards', href: '/dashboard/student/rewards' },
                ];
        }
    };

    const navItems = getNavItems(role);

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence mode='wait'>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hidden md:flex flex-col bg-slate-800/50 backdrop-blur-md border-r border-slate-700/50 relative z-20"
                    >
                        <div className="p-6 flex items-center justify-between">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
                                    <span className="font-bold text-white">B</span>
                                </div>
                                <span className="font-bold text-xl tracking-tight">ByteWave</span>
                            </Link>
                        </div>

                        <nav className="flex-1 px-4 py-4 space-y-2">
                            <div className="mb-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {role.toUpperCase()} MENU
                            </div>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                            isActive
                                                ? "bg-slate-700/50 text-white shadow-lg shadow-teal-500/10"
                                                : "text-slate-400 hover:bg-slate-700/30 hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent border-l-4 border-teal-500"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                        <item.icon className={clsx("w-5 h-5", isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300")} />
                                        <span className="relative font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-slate-700/50">
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                        <span className="text-sm font-bold">JD</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold">John Doe</h4>
                                        <p className="text-xs text-slate-400 capitalize">{role}</p>
                                    </div>
                                </div>
                                <button className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                    <LogOut className="w-3 h-3" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-10 sticky top-0">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 relative rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                        </button>
                        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto bg-slate-950 p-6 overscroll-contain">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
