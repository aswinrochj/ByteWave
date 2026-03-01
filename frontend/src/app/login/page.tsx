'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

const LoginContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const role = searchParams.get('role') || 'student';
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate AI Authentication delay -> Redirect
        setTimeout(() => {
            let target = '/dashboard/student';
            if (role === 'hr') target = '/dashboard/hr';
            if (role === 'institution') target = '/dashboard/institution';
            router.push(target);
        }, 1500);
    };

    const getGradientStart = (r: string) => {
        if (r === 'hr') return 'from-blue-600';
        if (r === 'institution') return 'from-purple-600';
        return 'from-teal-500';
    }

    const gradientClass = role === 'hr' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
        role === 'institution' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
            'bg-gradient-to-r from-teal-500 to-emerald-500';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl relative z-10"
        >
            <div className="text-center mb-8">
                <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                    <span className={`text-3xl font-bold bg-clip-text text-transparent ${gradientClass}`}>
                        ByteWave
                    </span>
                </Link>
                <h2 className="text-2xl font-bold text-white mb-2 capitalize">{role} Login</h2>
                <p className="text-slate-400 text-sm">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="email"
                            defaultValue="demo@bytewave.ai"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="password"
                            defaultValue="password"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-slate-400 cursor-pointer">
                        <input type="checkbox" className="mr-2 rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500" />
                        Remember me
                    </label>
                    <a href="#" className="text-teal-400 hover:text-teal-300">Forgot password?</a>
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-bold text-white ${gradientClass} shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Verifying Logic DNA...</span>
                        </div>
                    ) : (
                        <>Sign In <ArrowRight className="ml-2 w-5 h-5" /></>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-800 px-2 text-slate-500">Or continue with</span></div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"><Github className="w-5 h-5" /></button>
                    <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"><Chrome className="w-5 h-5" /></button>
                </div>

                <p className="mt-6 text-sm text-slate-400">
                    Don't have an account? <Link href={`/signup?role=${role}`} className="text-teal-400 hover:text-teal-300 font-medium">Sign up</Link>
                </p>
            </div>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-teal-500/20 animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-blue-500/20 animate-pulse" />

            <Suspense fallback={<div className="text-white">Loading Interface...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
