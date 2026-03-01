'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen relative bg-blue-50/40 professional-theme">
            {/* Soft Blue Gradient Background */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#3b82f633_0,transparent_40%),radial-gradient(circle_at_80%_80%,#60a5fa33_0,transparent_40%)]" />
            </div>

            <Sidebar />

            <div className="pl-[240px] min-h-screen flex flex-col relative z-10">
                <Header />

                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Centered White Dashboard Container */}
                    <div className="max-w-[1400px] mx-auto bg-white/60 backdrop-blur-sm rounded-[20px] p-8 shadow-2xl shadow-blue-900/5 border border-white/40 ring-1 ring-black/5">
                        {children}
                    </div>
                </main>

                <footer className="py-6 px-12 text-center text-gray-400 text-sm">
                    <p>&copy; 2026 Bytewave SaaS Platform. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
