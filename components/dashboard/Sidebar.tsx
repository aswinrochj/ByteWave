'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LucideLayoutDashboard,
    LucideUsers,
    LucideFileText,
    LucideSettings,
    LucideBriefcase,
    LucideGraduationCap,
    LucideLogOut,
    LucideAward,
    LucideBuilding2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
    { name: 'Dashboard', href: '/recruiter', icon: LucideLayoutDashboard },
    { name: 'Projects', href: '/recruiter/projects', icon: LucideBriefcase },
    { name: 'Certifications', href: '/recruiter/certifications', icon: LucideAward },
    { name: 'Students', href: '/recruiter/students', icon: LucideUsers },
    { name: 'Institutions', href: '/recruiter/institutions', icon: LucideBuilding2 },
    { name: 'Reports', href: '/recruiter/reports', icon: LucideFileText },
    { name: 'Settings', href: '/settings', icon: LucideSettings },
];

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-100 flex flex-col z-50">
            <div className="p-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                        <span className="text-white font-bold text-xl italic leading-none">BW</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">Bytewave</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-1">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <link.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                            )} />
                            <span className="text-[15px]">{link.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-gray-50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
                >
                    <LucideLogOut className="w-5 h-5 group-hover:text-rose-600" />
                    <span className="text-[15px] font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
