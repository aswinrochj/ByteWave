'use client';

import React from 'react';
import {
    LucideSearch,
    LucideBell,
    LucideChevronDown,
    LucideSettings,
    LucideUser
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for projects, students, or reports..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <LucideBell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 border-2 border-white rounded-full" />
                </button>

                <div className="h-8 w-px bg-gray-100 mx-2" />

                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-xl transition-all outline-none">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm overflow-hidden">
                            <span className="text-blue-600 font-bold text-sm">JS</span>
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-gray-800 leading-none">James Smith</p>
                            <p className="text-[11px] text-gray-500 mt-1 font-medium">Hiring Manager</p>
                        </div>
                        <LucideChevronDown className="w-4 h-4 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mt-2" align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                            <LucideUser className="w-4 h-4 text-gray-500" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">
                            <LucideSettings className="w-4 h-4 text-gray-500" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="gap-2 cursor-pointer py-2.5 text-rose-600 hover:text-rose-600 hover:bg-rose-50"
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
