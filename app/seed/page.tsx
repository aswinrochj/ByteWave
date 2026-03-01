'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { saveDocument } from '@/lib/firebase/db';
import * as mockData from '@/lib/mock-data';
import { LucideDatabase, LucideCheckCircle2, LucideLoader2, LucideAlertCircle } from 'lucide-react';

export default function SeedPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState('');

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const handleSeed = async () => {
        setStatus('loading');
        setLogs([]);
        setErrorMsg('');

        try {
            const { serverTimestamp } = await import('firebase/firestore');
            // 1. Seed Problems (Arena)
            addLog('Seeding Problems...');
            for (const problem of mockData.ARENA_PROBLEMS) {
                await saveDocument('problems', `problem_${problem.id}`, problem);
                addLog(`✅ Problem: ${problem.title}`);
            }

            // 2. Seed Users (Students + Leaderboard)
            addLog('Seeding Users...');
            const allUsers = [...mockData.MOCK_STUDENTS, ...mockData.LEADERBOARD_MEMBERS];
            for (const user of allUsers) {
                const userId = `user_${user.id}`;
                // Adapt fields slightly if needed to match User interface
                await saveDocument('users', userId, {
                    ...user,
                    role: (user as any).role?.toLowerCase() || 'student',
                });
                addLog(`✅ User: ${user.name}`);
            }

            // 3. Seed Jobs
            addLog('Seeding Jobs...');
            for (const job of mockData.activeJobs) {
                await saveDocument('jobs', `job_${job.id}`, {
                    ...job,
                    recruiterId: 'recruiter_demo',
                    createdAt: serverTimestamp()
                });
                addLog(`✅ Job: ${job.title}`);
            }

            // 4. Seed Applications
            addLog('Seeding Applications...');
            for (const app of mockData.MOCK_APPLICATIONS) {
                await saveDocument('applications', `app_${app.id}`, {
                    ...app,
                    studentName: app.candidate,
                    studentEmail: app.email,
                    appliedAt: serverTimestamp(),
                    recruiterId: 'recruiter_demo', // Standard ID for testing
                    studentId: 'user_demo_1' // Placeholder ID
                });
                addLog(`✅ Application for: ${app.candidate}`);
            }

            // 5. Seed Assessments
            addLog('Seeding Assessments...');
            for (const assessment of mockData.MOCK_ASSESSMENTS) {
                await saveDocument('assessments', `assessment_${assessment.id}`, {
                    ...assessment,
                    createdAt: serverTimestamp(),
                    institutionId: 'inst_demo_1',
                    institutionName: 'Bytewave Academy'
                });
                addLog(`✅ Assessment: ${assessment.title}`);
            }

            // 6. Seed Metrics/Stats
            addLog('Seeding Dashboard Metrics...');
            await saveDocument('metadata', 'institution_stats', { metrics: mockData.institutionMetrics });
            await saveDocument('metadata', 'recruiter_stats', { metrics: mockData.recruiterMetrics });
            addLog('✅ Dashboard Metrics Synced');

            setStatus('success');
            addLog('🎉 Database seeded successfully!');
        } catch (error: any) {
            console.error('Seeding failed:', error);
            setStatus('error');
            setErrorMsg(error.message || 'Unknown error during seeding');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full game-card p-12 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <LucideDatabase className="w-32 h-32" />
                </div>

                <div className="text-center space-y-4 relative z-10">
                    <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/30">
                        <LucideDatabase className="w-10 h-10 text-purple-400" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic">DATA_CORE_SYMLINK</h1>
                    <p className="text-muted-foreground text-sm font-medium">Initialise Bytewave Intelligence Network with high-fidelity mock data.</p>
                </div>

                <div className="space-y-4 relative z-10">
                    <Button
                        onClick={handleSeed}
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full py-8 text-xl font-black transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }}
                    >
                        {status === 'loading' ? (
                            <><LucideLoader2 className="mr-2 animate-spin" /> SYNCHRONISING...</>
                        ) : status === 'success' ? (
                            <><LucideCheckCircle2 className="mr-2" /> DATA SYNCED</>
                        ) : (
                            'EXECUTE SEED_DB'
                        )}
                    </Button>

                    <div className="h-64 overflow-y-auto bg-gray-900/50 border border-gray-800 rounded-xl p-4 font-mono text-[10px] space-y-1">
                        {logs.length === 0 && <div className="text-gray-600">// Awaiting instruction...</div>}
                        {logs.map((log, i) => (
                            <div key={i} className={log.startsWith('✅') ? 'text-emerald-400' : 'text-purple-300'}>
                                {log}
                            </div>
                        ))}
                        {status === 'error' && (
                            <div className="text-rose-500 flex items-center gap-2 mt-2">
                                <LucideAlertCircle className="w-3 h-3" /> ERROR: {errorMsg}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-800 text-[10px] text-gray-500 flex justify-between uppercase tracking-widest font-black">
                    <span>STATUS: {status.toUpperCase()}</span>
                    <span>BYTEWAVE INTELLIGENCE UNIT // v1.0</span>
                </div>
            </div>
        </div>
    );
}
