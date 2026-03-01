'use client';

import { LucideCode2, LucideBriefcase, LucideBuilding2, LucideArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/components/ui/button';
import { usePageTransition } from '@/components/providers/PageTransitionProvider';

export default function SelectRolePage() {
    const { triggerTransition } = usePageTransition();
    const roles = [
        {
            id: 'student',
            title: 'Developer / Student',
            icon: <LucideCode2 className="w-8 h-8 text-indigo-400" />,
            desc: 'Verify your skills and get hired.',
            color: 'hover:border-indigo-500/50 hover:bg-indigo-500/5',
            glow: 'group-hover:bg-indigo-500/20 text-indigo-400'
        },
        {
            id: 'recruiter',
            title: 'HR / Recruiter',
            icon: <LucideBriefcase className="w-8 h-8 text-purple-400" />,
            desc: 'Find verified talent.',
            color: 'hover:border-purple-500/50 hover:bg-purple-500/5',
            glow: 'group-hover:bg-purple-500/20 text-purple-400'
        },
        {
            id: 'institution',
            title: 'Institution',
            icon: <LucideBuilding2 className="w-8 h-8 text-blue-400" />,
            desc: 'Assess students at scale.',
            color: 'hover:border-blue-500/50 hover:bg-blue-500/5',
            glow: 'group-hover:bg-blue-500/20 text-blue-400'
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden text-white p-4">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-900 via-black to-black pointer-events-none" />

            <div className="z-10 w-full max-w-4xl space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Select Your Role</h1>
                    <p className="text-xl text-gray-400">How will you use Bytewave?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <Link
                            key={role.id}
                            href={`/login?role=${role.id}`}
                            onClick={() => triggerTransition()}
                            className={cn(
                                "group relative flex flex-col items-center text-center p-8 rounded-2xl border border-gray-800 bg-gray-950/50 backdrop-blur-sm transition-all duration-300",
                                role.color
                            )}
                        >
                            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors bg-gray-900", role.glow)}>
                                {role.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-white">{role.title}</h3>
                            <p className="text-sm text-gray-500 mb-6">{role.desc}</p>

                            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium flex items-center gap-2">
                                Continue to Login <LucideArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center text-sm text-gray-600">
                    Not sure? <Link href="/signup" onClick={() => triggerTransition()} className="text-indigo-500 hover:text-indigo-400">Create a new account</Link> instead.
                </div>
            </div>
        </div>
    );
}
