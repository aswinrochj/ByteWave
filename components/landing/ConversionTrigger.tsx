'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePageTransition } from '@/components/providers/PageTransitionProvider';

export default function ConversionTrigger() {
    const { triggerTransition } = usePageTransition();
    return (
        <section className="bg-gray-900 border-t border-gray-800 py-24 px-4 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                    Ready to verify your intelligence?
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Start building your Skill DNA today. Recruitment happens based on logic, not resumes.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link href="/select-role" onClick={() => triggerTransition()}>
                        <Button size="lg" className="group relative w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-12 py-8 text-xl rounded-full shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 font-bold tracking-wide overflow-hidden border-0">
                            <span className="relative z-10 flex items-center gap-3">
                                Get Started
                                <svg
                                    className="w-6 h-6 group-hover:translate-x-1.5 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-gray-600 mt-8 uppercase tracking-widest font-medium">
                    Used by 50+ Tech Companies for Verified Hiring
                </p>
            </div>
        </section>
    );
}
