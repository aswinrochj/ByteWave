'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

const roles = [
    {
        id: 'student',
        title: 'Student',
        icon: <User className="h-12 w-12 text-teal-400" />,
        description: 'Build your Skill DNA, track growth, and get matched with top opportunities.',
        color: 'from-teal-400 to-emerald-600',
        link: '/dashboard/student',
    },
    {
        id: 'hr',
        title: 'HR / Recruiter',
        icon: <Briefcase className="h-12 w-12 text-blue-400" />,
        description: 'Find candidates with verified skills, not just keywords. AI-powered hiring.',
        color: 'from-blue-400 to-indigo-600',
        link: '/dashboard/hr',
    },
    {
        id: 'institution',
        title: 'Institution',
        icon: <GraduationCap className="h-12 w-12 text-purple-400" />,
        description: 'Monitor batch performance, generate AI assessments, and track engagement.',
        color: 'from-purple-400 to-pink-600',
        link: '/dashboard/institution',
    },
];

export default function RoleSelectionPage() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradient Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 z-10"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Path</h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Select your role to access the personalized ByteWave dashboard.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 z-10 w-full max-w-6xl">
                {roles.map((role, index) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        className="group relative"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none`} />

                        <div className="relative z-10 h-full bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center text-center hover:border-slate-600 transition-colors shadow-xl">
                            <div className={`mb-6 p-4 rounded-full bg-slate-900/50 border border-slate-700/50 group-hover:scale-110 transition-transform duration-300`}>
                                {role.icon}
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">{role.title}</h2>
                            <p className="text-slate-400 mb-8 flex-grow">{role.description}</p>

                            <div className="w-full grid grid-cols-2 gap-3">
                                <Link
                                    href={`/login?role=${role.id}`} // Mock auth flow
                                    className="w-full py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={`/signup?role=${role.id}`} // Mock auth flow
                                    className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${role.color} text-white font-medium shadow-lg hover:shadow-xl hover:brightness-110 transition-all flex items-center justify-center`}
                                >
                                    Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 text-slate-500 text-sm">
                <Link href="/" className="hover:text-teal-400 transition-colors">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    );
}
