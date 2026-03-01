'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Cpu, Users } from 'lucide-react';
import WaveBackground from '../ui/WaveBackground';

const HeroSection = () => {
    return (
        <section className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center text-center">
            <WaveBackground />

            <div className="z-10 container px-4 md:px-6 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="inline-flex items-center rounded-3xl border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-300 backdrop-blur-xl">
                        <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                        v1.0 Public Beta
                    </div>

                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white max-w-4xl mx-auto">
                        Ride the Wave of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Real Skill Intelligence</span>
                    </h1>

                    <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Measure logic. Track growth. Get hired for what you can actually do.
                        ByteWave uses AI to build your Skill DNA profile.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mt-8"
                >
                    <Link href="/role-selection" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-teal-500 px-8 font-medium text-white transition-all duration-300 hover:bg-teal-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                        <span className="mr-2">Get Started</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                    </Link>

                    <Link href="/demo" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-700 bg-slate-900/50 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 hover:text-teal-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 backdrop-blur-sm">
                        View Live Demo
                    </Link>
                </motion.div>

                {/* Floating Code Snippets Decoration */}
                <FloatingBadge icon={<Code className="h-6 w-6 text-blue-400" />} label="Logic Score: 98" className="absolute top-[-100px] left-[10%] hidden md:flex" delay={0.5} />
                <FloatingBadge icon={<Cpu className="h-6 w-6 text-purple-400" />} label="AI Analysis" className="absolute top-[20px] right-[15%] hidden md:flex" delay={0.7} />
                <FloatingBadge icon={<Users className="h-6 w-6 text-teal-400" />} label="Top 5% Talent" className="absolute bottom-[-150px] left-[20%] hidden md:flex" delay={0.9} />
            </div>
        </section>
    );
};

const FloatingBadge = ({ icon, label, className, delay }: { icon: any, label: string, className?: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{
            opacity: { duration: 0.5, delay },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-2xl flex items-center gap-3 shadow-xl ${className}`}
    >
        <div className="p-2 bg-slate-800 rounded-lg">
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Metric</span>
            <span className="text-sm font-semibold text-white">{label}</span>
        </div>
    </motion.div>
);

export default HeroSection;
