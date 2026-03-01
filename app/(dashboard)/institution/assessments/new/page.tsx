'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LucideSparkles, LucideBrain, LucideCheckCircle, LucideLayers, LucideClock, LucideCode2, LucideLoader2 } from 'lucide-react';
import { MOCK_CHALLENGES } from '@/lib/mock-data';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@/components/providers/UserProvider';
import Link from 'next/link';

export default function NewAssessmentPage() {
    const router = useRouter();
    const { user } = useUser();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState<typeof MOCK_CHALLENGES | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('Data Structures & Algorithms');
    const [difficulty, setDifficulty] = useState('Adaptive (Recommended)');

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            setGeneratedQuestions(MOCK_CHALLENGES);
            setIsGenerating(false);
        }, 2000);
    };

    const handlePublish = async () => {
        if (!generatedQuestions || !title) return;
        setIsPublishing(true);
        try {
            await addDoc(collection(db, 'assessments'), {
                title,
                subject,
                difficulty,
                institutionId: user.id,
                institutionName: user.name,
                questions: generatedQuestions,
                status: 'Active',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                department: user.department || 'Computer Science', // Use dept from user profile if available
                createdAt: serverTimestamp(),
            });
            router.push('/institution/assessments');
        } catch (error) {
            console.error("Error publishing assessment:", error);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
                    <LucideSparkles className="w-8 h-8 text-indigo-400" />
                    AI Assessment Generator
                </h1>
                <p className="text-gray-400">Describe your requirements and let our AI construct a balanced, skill-verified exam.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Assessment Title</label>
                            <Input
                                placeholder="e.g. Mid-Term Data Structures"
                                className="bg-gray-950 border-gray-800"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Core Subject</label>
                            <select
                                className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                <option>Data Structures & Algorithms</option>
                                <option>Frontend Development (React)</option>
                                <option>Backend Systems (Node/Go)</option>
                                <option>Machine Learning Basics</option>
                                <option>System Design</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Difficulty Curve</label>
                            <select
                                className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option>Adaptive (Recommended)</option>
                                <option>Linear - Increasing</option>
                                <option>Flat - Hard</option>
                                <option>Flat - Easy</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Skill Signals to Measure</label>
                            <div className="space-y-2">
                                {['Code Optimization', 'Pattern Recognition', 'Edge Case Handling', 'Time Complexity'].map((skill) => (
                                    <label key={skill} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                                        <input type="checkbox" className="rounded bg-gray-950 border-gray-800 text-indigo-500 focus:ring-indigo-500" defaultChecked />
                                        {skill}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 py-6 text-lg font-semibold relative overflow-hidden"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2 animate-pulse">
                                    <LucideBrain className="w-5 h-5 animate-pulse" /> Generating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LucideSparkles className="w-5 h-5" /> Generate Assessment
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-2">
                    {generatedQuestions ? (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <LucideCheckCircle className="w-5 h-5 text-green-500" /> Generated Preview
                                </h2>
                                <span className="text-sm text-gray-400">Total Duration: ~105 mins</span>
                            </div>

                            <div className="space-y-4">
                                {generatedQuestions.map((q, i) => (
                                    <div key={q.id} className="bg-gray-900/50 border border-gray-800 p-5 rounded-xl hover:border-indigo-500/30 transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-xs font-bold text-gray-400">
                                                    {i + 1}
                                                </span>
                                                <h3 className="font-bold text-white">{q.title}</h3>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${q.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' :
                                                q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-green-500/10 text-green-400'
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <div className="pl-9 flex gap-6 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><LucideClock className="w-3 h-3" /> {q.time_est}</span>
                                            <span className="flex items-center gap-1"><LucideCode2 className="w-3 h-3" /> {q.tags.join(', ')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-800">
                                <Button
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
                                >
                                    {isPublishing ? (
                                        <><LucideLoader2 className="w-5 h-5 animate-spin mr-2" /> Publishing...</>
                                    ) : (
                                        'Publish & Assign'
                                    )}
                                </Button>
                                <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white py-6 text-lg">
                                    Regenerate specific questions
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-gray-900/20">
                            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                <LucideLayers className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-500 mb-2">Ready to generate</h3>
                            <p className="text-gray-600 max-w-sm">
                                Configure your assessment parameters on the left and click "Generate" to let our AI construct the perfect exam.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
