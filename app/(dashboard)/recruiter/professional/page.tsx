'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ChartSection from '@/components/dashboard/ChartSection';
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import {
    LucideBriefcase,
    LucideAward,
    LucideUsers,
    LucideBuilding2,
    LucideArrowRight,
    LucidePlus,
    LucideSearch
} from 'lucide-react';

export default function ProfessionalDashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Recruiter Dashboard</h1>
                        <p className="text-gray-500 mt-1">Welcome back, James. Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                            <LucideSearch className="w-4 h-4" />
                            <span>Talent Search</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                            <LucidePlus className="w-4 h-4" />
                            <span>Post New Job</span>
                        </button>
                    </div>
                </div>

                {/* Statistic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Active Projects"
                        value="12"
                        change="+2 this week"
                        icon={LucideBriefcase}
                        trend="up"
                    />
                    <StatCard
                        title="Certifications Issued"
                        value="1,482"
                        change="+12% from last month"
                        icon={LucideAward}
                        trend="up"
                    />
                    <StatCard
                        title="Total Students"
                        value="8,540"
                        change="+320 new"
                        icon={LucideUsers}
                        trend="up"
                    />
                    <StatCard
                        title="Institutions"
                        value="42"
                        change="Stable"
                        icon={LucideBuilding2}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <ChartSection />

                        {/* Additional Section: Top Talents */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">High-Potential Candidates</h3>
                                <button className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:underline">
                                    View Talent Pool <LucideArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: 'Alex Thompson', role: 'Full Stack Developer', score: 98, skills: ['React', 'Node.js', 'AWS'] },
                                    { name: 'Elena Rodriguez', role: 'UI/UX Designer', score: 95, skills: ['Figma', 'Principles', 'Next.js'] },
                                ].map((talent, i) => (
                                    <div key={i} className="p-4 border border-gray-50 rounded-xl hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {talent.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{talent.name}</p>
                                                <p className="text-xs text-gray-500">{talent.role}</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="text-sm font-bold text-blue-600">{talent.score}%</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-black">Match</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            {talent.skills.map(s => (
                                                <span key={s} className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md font-medium border border-gray-100">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <ActivityPanel />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
