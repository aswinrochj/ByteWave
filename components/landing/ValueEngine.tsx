'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePageTransition } from '@/components/providers/PageTransitionProvider';

export default function ValueEngine() {
    const { triggerTransition } = usePageTransition();
    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none" />

            {/* Animated Color Orb */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 text-center max-w-4xl space-y-8 relative"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-4 backdrop-blur-sm"
                >
                    The Future of Hiring is Here
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-100 to-gray-400 pb-2"
                    initial={{ opacity: 0, letterSpacing: "-0.05em" }}
                    animate={{ opacity: 1, letterSpacing: "0em" }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                >
                    Stop Hiring Resumes.<br />
                    <span className="text-indigo-400 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Start Hiring Intelligence.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                >
                    We measure developer cognition, problem-solving style, and adaptive learning speed.
                    Forget GitHub streaks. See how they actually think.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
                >
                    <Link href="/select-role" onClick={() => triggerTransition()}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button size="lg" className="group relative w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 py-7 text-xl rounded-2xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.6)] transition-all duration-300 border-0 overflow-hidden">
                                <span className="relative z-10 flex items-center gap-2 font-bold tracking-tight">
                                    Get Started
                                    <svg
                                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Quick Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 text-sm font-medium text-gray-500"
                >
                    <motion.div whileHover={{ scale: 1.05, color: "#a5b4fc" }} className="cursor-default transition-colors">VERIFIED SKILL DNA</motion.div>
                    <motion.div whileHover={{ scale: 1.05, color: "#a5b4fc" }} className="cursor-default transition-colors">ANTI-CHEAT ENGINE</motion.div>
                    <motion.div whileHover={{ scale: 1.05, color: "#a5b4fc" }} className="cursor-default transition-colors">COGNITIVE ANALYSIS</motion.div>
                    <motion.div whileHover={{ scale: 1.05, color: "#a5b4fc" }} className="cursor-default transition-colors">PREDICTIVE HIRING</motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
