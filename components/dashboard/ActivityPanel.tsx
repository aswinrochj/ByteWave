'use client';

import React from 'react';
import { LucideClock, LucideCheckCircle2, LucideMessageSquare, LucideUserPlus, LucideAward } from 'lucide-react';

const activities = [
    {
        id: 1,
        type: 'enrollment',
        user: 'Sarah Miller',
        action: 'enrolled in',
        target: 'Web Security Assessment',
        time: '2 hours ago',
        icon: LucideUserPlus,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600'
    },
    {
        id: 2,
        type: 'completion',
        user: 'David Chen',
        action: 'completed',
        target: 'Full Stack Excellence',
        time: '4 hours ago',
        icon: LucideCheckCircle2,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600'
    },
    {
        id: 3,
        type: 'certification',
        user: 'Alex Rivera',
        action: 'was awarded',
        target: 'Cloud Architecture Expert',
        time: 'Yesterday',
        icon: LucideAward,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600'
    },
    {
        id: 4,
        type: 'feedback',
        user: 'Institute Global',
        action: 'commented on',
        target: 'Project Alpha',
        time: '2 days ago',
        icon: LucideMessageSquare,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600'
    }
];

const ActivityPanel = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activities.map((item) => (
                    <div key={item.id} className="flex gap-4 group cursor-pointer">
                        <div className={item.iconBg + " " + item.iconColor + " w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 leading-tight">
                                <span className="font-bold text-gray-800">{item.user}</span> {item.action} <span className="font-semibold text-blue-600">{item.target}</span>
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <LucideClock className="w-3 h-3 text-gray-400" />
                                <span className="text-[11px] text-gray-400">{item.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
                <p className="text-[11px] text-gray-400 font-medium">Auto-updates every 5 minutes</p>
            </div>
        </div>
    );
};

export default ActivityPanel;
