'use client';

import { useState, useRef, useEffect, useCallback, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    LucidePlay, LucideMaximize2, LucideTerminal, LucideFileCode,
    LucideMessageSquare, LucideSend, LucideBrain, LucideZap,
    LucideCpu, LucideAlertTriangle, LucideArrowLeft, LucideClock,
    LucideTrophy, LucideCheckCircle, LucideUpload, LucideLayout,
    LucideShieldCheck, LucideLineChart, LucideDatabase, LucideType,
    LucideLightbulb, LucideChevronDown, LucideClock3, LucideTrash2,
    LucideCopy, LucideChevronUp, LucideInfo,
} from 'lucide-react';
import { analyzeCodeWithGroq } from '@/app/actions/analyze-code';
import { getChatResponse } from '@/app/actions/chat-tutor';
import { AnalysisResult } from '@/lib/ai-analyzer/core';

// CodeMirror imports
import { EditorView, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, keymap } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from "@codemirror/language";
import { history, defaultKeymap, historyKeymap, indentWithTab } from "@codemirror/commands";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentUnit } from "@codemirror/language";
import { linter, lintKeymap } from "@codemirror/lint";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useSkillIntelligence } from '@/components/providers/SkillIntelligenceProvider';
import { ARENA_PROBLEMS, ArenaProblem } from '@/lib/mock-data';
import Link from 'next/link';

type Language = 'python' | 'c' | 'cpp' | 'java';

const LANG_META: Record<Language, { emoji: string; color: string; glow: string }> = {
    python: { emoji: '🐍', color: '#fbbf24', glow: 'rgba(251,191,36,0.25)' },
    c: { emoji: '⚙️', color: '#60a5fa', glow: 'rgba(96,165,250,0.25)' },
    java: { emoji: '☕', color: '#f87171', glow: 'rgba(248,113,113,0.25)' },
    cpp: { emoji: '🧊', color: '#3b82f6', glow: 'rgba(59,130,246,0.25)' },
};

const JUDGE0_LANG_MAP: Record<Language, number> = {
    python: 71,
    java: 62,
    c: 50,
    cpp: 54,
};

const DIFF_COLOR: Record<string, { text: string; bg: string; border: string }> = {
    Easy: { text: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    Medium: { text: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
    Hard: { text: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
};

/* ── helpers ───────────────────────────────────── */
function fmt(s: number) {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
}

function DNABar({ label, icon: Icon, value, from, to }: { label: string; icon: any; value: number; from: string; to: string }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5" style={{ color: to }}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-black uppercase tracking-wide">{label}</span>
                </div>
                <span className="font-black font-mono text-foreground">{value}<span className="text-muted-foreground">/100</span></span>
            </div>
            <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${from}, ${to})` }} />
            </div>
        </div>
    );
}

/* ── Time's Up Modal ─────────────────────────────── */
function TimesUpModal({ result, problem, onClose }: {
    result: AnalysisResult | null;
    problem: ArenaProblem;
    onClose: () => void;
}) {
    const xp = problem.difficulty === 'Hard' ? 40 : problem.difficulty === 'Medium' ? 25 : 15;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <div
                className="w-full max-w-md rounded-2xl p-7 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                style={{ background: 'linear-gradient(135deg, #0f0c24, #120a2e)', border: '1px solid rgba(168,85,247,0.4)', boxShadow: '0 0 60px rgba(168,85,247,0.2)' }}
            >
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.3) 0%, transparent 70%)', filter: 'blur(20px)' }} />

                <div className="relative z-10 text-center">
                    <div className="text-5xl mb-3">{result ? '🎯' : '⏰'}</div>
                    <h2 className="text-2xl font-black text-white mb-1">
                        {result ? 'Time Expired — Results In!' : "Time's Up!"}
                    </h2>
                    <p className="text-purple-300/60 text-sm mb-6">
                        {result ? 'Your code was auto-submitted when the timer ended.' : 'The timer ran out before analysis completed.'}
                    </p>

                    {result ? (
                        <div className="space-y-4 text-left">
                            {/* Scores */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Time', val: result.metrics.timeComplexity, color: '#34d399' },
                                    { label: 'Space', val: result.metrics.spaceComplexity, color: '#60a5fa' },
                                ].map(m => (
                                    <div key={m.label} className="text-center p-3 rounded-xl"
                                        style={{ background: `${m.color}15`, border: `1px solid ${m.color}30` }}>
                                        <div className="font-black text-sm" style={{ color: m.color }}>{m.val}</div>
                                        <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{m.label}</div>
                                    </div>
                                ))}
                            </div>
                            {result.analysis && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)' }}>
                                        <div className="text-xl font-black text-emerald-400">{result.analysis.correctnessScore}%</div>
                                        <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Correctness</div>
                                    </div>
                                    <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}>
                                        <div className="text-xl font-black text-amber-400">{result.analysis.codeQualityScore}%</div>
                                        <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Quality</div>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-center gap-2 p-3 rounded-xl"
                                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
                                <LucideZap className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-400 font-black">+{xp} XP awarded (partial credit)</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)' }}>
                            <p className="text-red-300 text-sm text-center">No analysis result — code was not submitted in time.</p>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <Button onClick={onClose} className="flex-1 font-bold"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none' }}>
                            Try Again
                        </Button>
                        <Link href="/student/dashboard" className="flex-1">
                            <Button variant="outline" className="w-full font-bold border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                                Back to Missions
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Main Arena Inner (reads searchParams) ──────── */
function ArenaInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addSession } = useSkillIntelligence();

    // Resolve problem from ?id= param (default to problem 1)
    const problemId = parseInt(searchParams.get('id') ?? '1', 10);
    const problem = ARENA_PROBLEMS.find(p => p.id === problemId) ?? ARENA_PROBLEMS[0];

    const [language, setLanguage] = useState<Language>('python');
    const [code, setCode] = useState(problem.boilerplates[language]);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(problem.time_seconds);
    const [timerRunning, setTimerRunning] = useState(true);
    const [timerExpired, setTimerExpired] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Analysis state
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [showTimesUp, setShowTimesUp] = useState(false);
    const [timesUpResult, setTimesUpResult] = useState<AnalysisResult | null>(null);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' } | null>(null);
    const showToast = (message: string, type: 'info' | 'error' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const isAssessment = true; // Competitive mode active by default

    // Test Case Results state
    const [testResults, setTestResults] = useState<{
        id: number;
        input: string;
        expected: string;
        actual: string;
        status: 'passed' | 'failed' | 'pending' | 'running';
        isVisible: boolean;
        explanation?: string;
        time?: string;
        memory?: string;
    }[]>([]);
    const [showTestPanel, setShowTestPanel] = useState(false);
    const [executionStats, setExecutionStats] = useState<{ time: string; memory: string } | null>(null);

    // Chat state
    const [activeTab, setActiveTab] = useState<'analysis' | 'chat'>('analysis');
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: `Hi! I'm your AI coding mentor. You're working on "${problem.title}". Analyze your code, then ask me anything!` },
    ]);
    const [isChatting, setIsChatting] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Refs for editor
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const languageConf = useRef(new Compartment());
    const readonlyConf = useRef(new Compartment());

    // Resizing logic
    const [leftWidth, setLeftWidth] = useState(30);
    const [panelHeight, setPanelHeight] = useState(40); // Percentage of vertical height
    const [isDesktop, setIsDesktop] = useState(false);
    const [isResizingH, setIsResizingH] = useState(false);
    const [isResizingV, setIsResizingV] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Test Panel Tabs
    const [activePanelTab, setActivePanelTab] = useState<'testcases' | 'console'>('testcases');

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // Initialize CodeMirror
    useEffect(() => {
        if (!editorContainerRef.current) return;

        const getLanguageExtension = (lang: Language) => {
            if (lang === 'python') return python();
            if (lang === 'java') return java();
            if (lang === 'cpp' || lang === 'c') return cpp();
            return python();
        };

        const state = EditorState.create({
            doc: code,
            extensions: [
                lineNumbers(),
                highlightActiveLineGutter(),
                highlightSpecialChars(),
                history(),
                foldGutter(),
                drawSelection(),
                dropCursor(),
                EditorState.allowMultipleSelections.of(true),
                indentOnInput(),
                syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                bracketMatching(),
                closeBrackets(),
                autocompletion(),
                rectangularSelection(),
                crosshairCursor(),
                highlightActiveLine(),
                highlightSelectionMatches(),
                indentUnit.of("    "),
                languageConf.current.of(getLanguageExtension(language)),
                readonlyConf.current.of(EditorState.readOnly.of(timerExpired)),
                keymap.of([
                    {
                        key: "Mod-c",
                        run: () => {
                            if (isAssessment) {
                                showToast("Copy is disabled during assessment.", "error");
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        key: "Mod-v",
                        run: () => {
                            if (isAssessment) {
                                showToast("Paste is disabled in this environment.", "error");
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        key: "Mod-x",
                        run: () => {
                            if (isAssessment) {
                                showToast("Cut is disabled during assessment.", "error");
                                return true;
                            }
                            return false;
                        }
                    },
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...searchKeymap,
                    ...historyKeymap,
                    ...foldKeymap,
                    ...completionKeymap,
                    ...lintKeymap,
                    indentWithTab
                ]),
                EditorView.domEventHandlers({
                    paste(event, view) {
                        if (isAssessment) {
                            event.preventDefault();
                            showToast("Paste is disabled in this environment.", "error");
                            return true;
                        }
                        return false;
                    },
                    copy(event, view) {
                        if (isAssessment) {
                            event.preventDefault();
                            showToast("Copy is disabled during assessment.", "error");
                            return true;
                        }
                        return false;
                    },
                    cut(event, view) {
                        if (isAssessment) {
                            event.preventDefault();
                            showToast("Cut is disabled during assessment.", "error");
                            return true;
                        }
                        return false;
                    },
                    drop(event, view) {
                        if (isAssessment) {
                            event.preventDefault();
                            showToast("Drag-and-drop is disabled.", "error");
                            return true;
                        }
                        return false;
                    }
                }),
                oneDark,
                EditorView.theme({
                    "&": {
                        height: "100%",
                        fontSize: "14px",
                        backgroundColor: "transparent"
                    },
                    "&.cm-focused": {
                        outline: "none"
                    },
                    ".cm-scroller": {
                        overflow: "auto",
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    },
                    ".cm-gutters": {
                        backgroundColor: "#0d1117",
                        color: "#3b4261",
                        borderRight: "none",
                        paddingLeft: "12px",
                        minWidth: "40px"
                    },
                    ".cm-activeLineGutter": {
                        backgroundColor: "transparent",
                        color: "#89ddff"
                    },
                    ".cm-activeLine": {
                        backgroundColor: "rgba(168,85,247,0.02)"
                    },
                    ".cm-content": {
                        whiteSpace: "pre-wrap",
                        padding: "24px 0"
                    },
                    ".cm-line": {
                        paddingLeft: "12px"
                    }
                }),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        setCode(update.view.state.doc.toString());
                    }
                })
            ]
        });

        const view = new EditorView({
            state,
            parent: editorContainerRef.current
        });

        editorViewRef.current = view;

        return () => {
            view.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update language extension when language changes
    useEffect(() => {
        if (editorViewRef.current) {
            const getLanguageExtension = (lang: Language) => {
                if (lang === 'python') return python();
                if (lang === 'java') return java();
                return cpp();
            };
            editorViewRef.current.dispatch({
                effects: languageConf.current.reconfigure(getLanguageExtension(language))
            });
        }
    }, [language]);

    // Update readonly state when timer expires
    useEffect(() => {
        if (editorViewRef.current) {
            editorViewRef.current.dispatch({
                effects: readonlyConf.current.reconfigure(EditorState.readOnly.of(timerExpired))
            });
        }
    }, [timerExpired]);

    // Sync code content externally (e.g. from boilerplate reset)
    useEffect(() => {
        if (editorViewRef.current && editorViewRef.current.state.doc.toString() !== code) {
            editorViewRef.current.dispatch({
                changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: code }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    const startResizingH = useCallback(() => setIsResizingH(true), []);
    const startResizingV = useCallback(() => setIsResizingV(true), []);
    const stopResizing = useCallback(() => {
        setIsResizingH(false);
        setIsResizingV(false);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizingH && !isResizingV) return;
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();

        if (isResizingH) {
            const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
            if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
        }

        if (isResizingV) {
            const newHeight = ((rect.bottom - e.clientY) / rect.height) * 100;
            if (newHeight > 10 && newHeight < 80) setPanelHeight(newHeight);
        }
    }, [isResizingH, isResizingV]);

    useEffect(() => {
        if (isResizingH || isResizingV) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizingH, isResizingV, handleMouseMove, stopResizing]);

    // Reset everything when problem changes
    useEffect(() => {
        // Recovery from localStorage
        const storageKey = `arena_timer_${problem.id}`;
        const savedTime = localStorage.getItem(storageKey);

        if (savedTime) {
            setTimeLeft(parseInt(savedTime, 10));
        } else {
            setTimeLeft(problem.time_seconds);
        }

        setCode(problem.boilerplates[language]);
        setTimerRunning(true);
        setTimerExpired(false);
        setAnalysisResult(null);
        setShowTimesUp(false);
        if (timerRef.current) clearInterval(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [problem.id]);

    // Save timer to localStorage
    useEffect(() => {
        if (timeLeft > 0 && !timerExpired) {
            localStorage.setItem(`arena_timer_${problem.id}`, timeLeft.toString());
        }
    }, [timeLeft, problem.id, timerExpired]);

    // Update code when language changes
    useEffect(() => {
        setCode(problem.boilerplates[language]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, activeTab]);

    // Countdown timer
    const triggerAutoSubmit = useCallback(async (currentCode: string) => {
        setTimerExpired(true);
        setTimerRunning(false);
        setActiveTab('analysis');
        setIsAnalyzing(true);
        try {
            const result = await analyzeCodeWithGroq(currentCode, problem.title);
            setTimesUpResult(result);
            if (result?.dna) {
                addSession({
                    logicScore: result.dna.logicScore,
                    patternStrength: result.dna.patternStrength,
                    optimizationRating: result.dna.optimizationRating,
                    consistencyScore: result.dna.consistencyScore,
                    skillScore: result.dna.skillScore,
                }, problem.difficulty);
            }
        } catch {
            setTimesUpResult(null);
        } finally {
            setIsAnalyzing(false);
            setShowTimesUp(true);
        }
    }, [problem.title, problem.difficulty, addSession]);

    useEffect(() => {
        if (!timerRunning) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current!);
    }, [timerRunning]);

    useEffect(() => {
        if (timeLeft === 0 && timerRunning) {
            setTimerRunning(false);
            triggerAutoSubmit(code);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    const copyLogs = useCallback(() => {
        const text = testResults.map((r, i) => `Test Case #${i + 1}: ${r.status}\nInput: ${r.input}\nExpected: ${r.expected}\nActual: ${r.actual}\n`).join('\n---\n');
        navigator.clipboard.writeText(text);
    }, [testResults]);

    const handleRun = async () => {
        setIsAnalyzing(true);
        setShowTestPanel(true);
        setActivePanelTab('testcases');

        const visibleCases = problem.test_cases.filter(tc => tc.isVisible);
        setTestResults(visibleCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected_output,
            actual: '',
            status: 'running',
            isVisible: true,
            explanation: tc.explanation
        })));

        try {
            const results = await Promise.all(visibleCases.map(async (tc) => {
                const res = await fetch('/api/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source_code: code,
                        language_id: JUDGE0_LANG_MAP[language],
                        stdin: tc.input,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Execution server returned an error');
                }
                const data = await res.json();

                // Judge0 returns stdout, stderr, compile_output
                const actual = data.stdout?.trim() || data.stderr || data.compile_output || data.message || '(no output)';
                const passed = data.stdout?.trim() === tc.expected_output.trim();

                return {
                    id: tc.id,
                    input: tc.input,
                    expected: tc.expected_output,
                    actual,
                    status: (passed ? 'passed' : 'failed') as 'passed' | 'failed',
                    isVisible: true,
                    explanation: tc.explanation,
                    time: data.time,
                    memory: data.memory,
                };
            }));

            setTestResults(results);

            if (results.length > 0) {
                setExecutionStats({
                    time: `${(parseFloat(results[0].time || '0') * 1000).toFixed(0)}ms`,
                    memory: `${(parseFloat(results[0].memory || '0') / 1024).toFixed(1)}MB`
                });
            }
        } catch (err: any) {
            console.error('Run Error:', err);
            setTestResults(prev => prev.map(r => ({ ...r, actual: `Error: ${err.message}`, status: 'failed' })));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setShowTestPanel(true);
        setActiveTab('analysis');
        setActivePanelTab('testcases');

        setTestResults(problem.test_cases.map(tc => ({
            id: tc.id,
            input: tc.isVisible ? tc.input : '[HIDDEN]',
            expected: tc.isVisible ? tc.expected_output : '[HIDDEN]',
            actual: '',
            status: 'running',
            isVisible: tc.isVisible,
            explanation: tc.explanation
        })));

        try {
            const results = await Promise.all(problem.test_cases.map(async (tc) => {
                const res = await fetch('/api/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source_code: code,
                        language_id: JUDGE0_LANG_MAP[language],
                        stdin: tc.input,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Execution server returned an error');
                }
                const data = await res.json();

                const actualOutput = data.stdout?.trim() || data.stderr || data.compile_output || data.message || '';
                const passed = data.stdout?.trim() === tc.expected_output.trim();

                return {
                    id: tc.id,
                    input: tc.isVisible ? tc.input : '[HIDDEN]',
                    expected: tc.isVisible ? tc.expected_output : '[HIDDEN]',
                    actual: tc.isVisible ? actualOutput : (passed ? 'Passed Hidden Test Case' : 'Failed Hidden Test Case'),
                    status: (passed ? 'passed' : 'failed') as 'passed' | 'failed',
                    isVisible: tc.isVisible,
                    explanation: tc.explanation,
                    time: data.time,
                    memory: data.memory,
                };
            }));

            setTestResults(results);

            const totalPassed = results.filter(r => r.status === 'passed').length;
            const totalCases = results.length;

            setExecutionStats({
                time: `${(parseFloat(results[0].time || '0') * 1000).toFixed(0)}ms`,
                memory: `${(parseFloat(results[0].memory || '0') / 1024).toFixed(1)}MB`
            });

            // Trigger AI Logic Analysis
            const aiResult = await analyzeCodeWithGroq(code, problem.title);
            setAnalysisResult(aiResult);
            if (aiResult?.dna) {
                addSession({
                    logicScore: aiResult.dna.logicScore,
                    patternStrength: aiResult.dna.patternStrength,
                    optimizationRating: aiResult.dna.optimizationRating,
                    consistencyScore: aiResult.dna.consistencyScore,
                    skillScore: aiResult.dna.skillScore,
                }, problem.difficulty);
            }
        } catch (err) {
            console.error('Submit Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const newUserMsg = { role: 'user' as const, content: chatInput };
        setChatMessages(prev => [...prev, newUserMsg]);
        setChatInput('');
        setIsChatting(true);
        try {
            const history = chatMessages.slice(-6);
            const response = await getChatResponse([...history, newUserMsg], code, problem.title);
            setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch {
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally { setIsChatting(false); }
    };

    const lang = LANG_META[language];
    const diff = DIFF_COLOR[problem.difficulty];
    const timePercent = (timeLeft / problem.time_seconds) * 100;
    const timerDanger = timeLeft <= 60 && timeLeft > 0;
    const timerWarning = timeLeft <= 300 && timeLeft > 60;
    const timerColor = timerDanger ? '#f87171' : timerWarning ? '#fbbf24' : '#a855f7';
    const xpReward = problem.difficulty === 'Hard' ? 120 : problem.difficulty === 'Medium' ? 75 : 40;

    return (
        <>
            {showTimesUp && (
                <TimesUpModal
                    result={timesUpResult}
                    problem={problem}
                    onClose={() => {
                        setShowTimesUp(false);
                        setTimeLeft(problem.time_seconds);
                        setTimerExpired(false);
                        setTimerRunning(false);
                        setCode(problem.boilerplates[language]);
                        setAnalysisResult(null);
                    }}
                />
            )}

            <div className="flex flex-col gap-4 h-[calc(100vh-6rem)] pb-4">

                {/* ── HEADER ─────────────────────────── */}
                <div
                    className="rounded-2xl px-6 py-4 relative overflow-hidden flex flex-wrap items-center justify-between gap-3 shrink-0"
                    style={{
                        background: 'linear-gradient(135deg, #0b0f1e 0%, #130a2a 50%, #0a1525 100%)',
                        border: '1px solid rgba(168,85,247,0.25)',
                    }}
                >
                    <div className="absolute -top-6 left-24 w-32 h-32 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.2) 0%, transparent 70%)', filter: 'blur(20px)' }} />

                    {/* Back + title */}
                    <div className="relative z-10 flex items-center gap-4">
                        <Link href="/student/dashboard">
                            <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.2)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.1)')}
                            >
                                <LucideArrowLeft className="w-4 h-4 text-purple-400" />
                            </button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <h1 className="text-base font-black text-white tracking-tight">{problem.title}</h1>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest"
                                    style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
                                    ⚔ {problem.difficulty}
                                </span>
                                <span className="text-[10px] font-bold text-amber-400">⚡ +{xpReward} XP</span>
                            </div>
                            <div className="flex gap-1.5 flex-wrap">
                                {problem.tags.map(t => (
                                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                                        style={{ background: 'rgba(168,85,247,0.08)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Timer + Run button */}
                    <div className="relative z-10 flex items-center gap-3">
                        {/* Countdown */}
                        <div
                            className={cn(
                                "flex flex-col items-center px-4 py-2 rounded-xl transition-all relative",
                                timerRunning && !timerExpired && "animate-pulse"
                            )}
                            style={{
                                background: timerDanger ? 'rgba(248,113,113,0.15)' : 'rgba(168,85,247,0.08)',
                                border: `1px solid ${timerColor}40`,
                                boxShadow: timerDanger ? '0 0 16px rgba(248,113,113,0.3)' : 'none',
                            }}
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    timerRunning && !timerExpired ? "bg-emerald-500 animate-ping" : "bg-muted"
                                )} />
                                <LucideClock className="w-3 h-3" style={{ color: timerColor }} />
                                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: timerColor }}>
                                    {timerExpired ? 'EXPIRED' : 'LIVE'}
                                </span>
                            </div>
                            <span
                                className={cn("font-black font-mono text-xl tabular-nums")}
                                style={{ color: timerColor }}
                            >
                                {fmt(timeLeft)}
                            </span>
                            {/* Timer bar */}
                            <div className="w-full mt-1.5 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${timePercent}%`, background: timerColor }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleRun}
                                disabled={isAnalyzing || isSubmitting || timerExpired}
                                className="font-black px-6 h-11 gap-2 border-2 transition-all hover:scale-105 active:scale-95"
                                style={{
                                    background: 'rgba(168,85,247,0.1)',
                                    color: '#c084fc',
                                    borderColor: 'rgba(168,85,247,0.3)',
                                }}
                            >
                                {isAnalyzing ? <span className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" /> : <LucidePlay className="w-4 h-4" />}
                                Run
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isAnalyzing || isSubmitting || timerExpired}
                                className="font-black px-8 h-11 gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/20"
                                style={{
                                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                    color: '#fff',
                                    border: 'none',
                                }}
                            >
                                {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LucideUpload className="w-4 h-4" />}
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── MAIN GRID ───────────────────────── */}
                <div ref={containerRef} className="flex flex-col lg:flex-row flex-1 min-h-0 relative">

                    {/* ── LEFT ── */}
                    <div
                        className="flex flex-col gap-4 overflow-hidden order-2 lg:order-1 h-full"
                        style={{ width: isDesktop ? `${leftWidth}%` : '100%' }}
                    >

                        {/* Problem statement */}
                        <div className="rounded-2xl p-6 shrink-0 overflow-y-auto"
                            style={{
                                background: 'var(--card)',
                                border: '1px solid rgba(168,85,247,0.2)',
                                maxHeight: '45%',
                                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.3)'
                            }}>
                            <h3 className="font-black text-sm text-purple-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                                <LucideFileCode className="w-4 h-4" /> Problem Statement
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-3">{problem.description}</p>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Example:</div>
                            <pre className="text-xs font-mono p-3 rounded-xl leading-relaxed mb-3"
                                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                                {`Input:  ${problem.example_input}
Output: ${problem.example_output}`}
                            </pre>
                            {problem.constraints.length > 0 && (
                                <>
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Constraints:</div>
                                    <ul className="space-y-0.5">
                                        {problem.constraints.map((c, i) => (
                                            <li key={i} className="text-xs text-muted-foreground font-mono flex items-start gap-1.5">
                                                <span className="text-purple-500 mt-0.5">▸</span>{c}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* Console / Chat */}
                        <div className="flex flex-col flex-1 overflow-hidden rounded-2xl"
                            style={{
                                background: 'var(--card)',
                                border: '1px solid rgba(168,85,247,0.2)',
                                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.3)'
                            }}>
                            {/* Tabs */}
                            <div className="flex shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
                                {([
                                    { id: 'analysis', icon: LucideTerminal, label: 'Analysis Console' },
                                    { id: 'chat', icon: LucideMessageSquare, label: 'AI Mentor' },
                                ] as const).map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all"
                                        style={activeTab === tab.id
                                            ? { color: '#c084fc', borderBottom: '2px solid #a855f7', background: 'rgba(168,85,247,0.06)' }
                                            : { color: 'var(--muted-foreground)', borderBottom: '2px solid transparent' }
                                        }>
                                        <tab.icon className="w-3.5 h-3.5" />{tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab content */}
                            <div className="flex-1 overflow-hidden relative">

                                {/* ANALYSIS */}
                                {activeTab === 'analysis' && (
                                    <div className="absolute inset-0 p-4 overflow-y-auto font-mono text-sm space-y-5">
                                        {!analysisResult && !isSubmitting && (
                                            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                                                    style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                                                    🧠
                                                </div>
                                                <div>
                                                    <div className="font-black text-foreground mb-1 text-sm">Logic DNA Analysis</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                                                        Submit your code to generate <br /> a deep AI logic assessment.
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {isSubmitting && (
                                            <div className="space-y-4 animate-in fade-in duration-300">
                                                <div className="flex items-center gap-2 text-purple-400 animate-pulse font-black text-xs">
                                                    <LucideBrain className="w-4 h-4" /> ANALYZING LOGIC PATTERNS…
                                                </div>
                                                <div className="space-y-3 pl-5" style={{ borderLeft: '2px solid rgba(168,85,247,0.25)' }}>
                                                    {['Deconstructing Control Flow…', 'Measuring Optimization Gravity…', 'Identifying Edge Case Holes…', 'Calculating Final Skill Score…'].map((s, i) => (
                                                        <div key={i} className="flex items-center gap-2" style={{ opacity: 1 - i * 0.2 }}>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                                            <span className="text-[11px] text-muted-foreground">{s}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {analysisResult && (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                                <div className="p-4 rounded-2xl relative overflow-hidden group"
                                                    style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)' }}>
                                                    <div className="absolute top-0 right-0 p-3">
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">AI ANALYSIS</span>
                                                    </div>
                                                    <p className="text-xs leading-relaxed text-muted-foreground mt-6">{analysisResult.feedback}</p>

                                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                                        <div className="p-4 rounded-xl text-center bg-background/40 border border-border">
                                                            <div className="text-2xl font-black text-purple-400">{analysisResult.dna.skillScore}%</div>
                                                            <div className="text-[9px] font-black uppercase text-muted-foreground mt-1">Skill Score</div>
                                                        </div>
                                                        <div className="p-4 rounded-xl text-center bg-background/40 border border-border">
                                                            <div className="text-2xl font-black text-emerald-400">{analysisResult.analysis?.correctnessScore}%</div>
                                                            <div className="text-[9px] font-black uppercase text-muted-foreground mt-1">Correctness</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                        <LucideCpu className="w-3.5 h-3.5" /> Logic DNA Components
                                                    </h4>
                                                    <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                                                        <DNABar label="Logical Thinking" icon={LucideBrain} value={analysisResult.dna.logicScore} from="#7c3aed" to="#a855f7" />
                                                        <DNABar label="Pattern Strength" icon={LucideLayout} value={analysisResult.dna.patternStrength} from="#0891b2" to="#22d3ee" />
                                                        <DNABar label="Optimization" icon={LucideZap} value={analysisResult.dna.optimizationRating} from="#d97706" to="#fbbf24" />
                                                        <DNABar label="Consistency" icon={LucideShieldCheck} value={analysisResult.dna.consistencyScore} from="#059669" to="#34d399" />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                        <LucideLineChart className="w-3.5 h-3.5" /> Performance Metrics
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { label: 'Time Complexity', val: analysisResult.metrics.timeComplexity, icon: LucideClock, color: '#60a5fa' },
                                                            { label: 'Space Complexity', val: analysisResult.metrics.spaceComplexity, icon: LucideDatabase, color: '#c084fc' },
                                                            { label: 'Variable Naming', val: analysisResult.analysis?.namingQuality, icon: LucideType, color: '#fbbf24' },
                                                            { label: 'Redundant Logic', val: analysisResult.analysis?.redundantLogicDetected ? 'Detected' : 'None', icon: LucideAlertTriangle, color: analysisResult.analysis?.redundantLogicDetected ? '#f87171' : '#34d399' },
                                                        ].map(m => (
                                                            <div key={m.label} className="p-4 rounded-2xl bg-card border border-border">
                                                                <m.icon className="w-3.5 h-3.5 mb-2" style={{ color: m.color }} />
                                                                <div className="text-[9px] font-black uppercase text-muted-foreground mb-1">{m.label}</div>
                                                                <div className="font-bold text-xs truncate" style={{ color: m.color }}>{m.val}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                        <LucideLightbulb className="w-3.5 h-3.5" /> Optimization Routes
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {analysisResult.analysis?.optimizationSuggestions.map((s, i) => (
                                                            <div key={i} className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
                                                                <span className="text-purple-400 mt-0.5">•</span>
                                                                {s}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* CHAT */}
                                {activeTab === 'chat' && (
                                    <div className="absolute inset-0 flex flex-col">
                                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                            {chatMessages.map((msg, i) => (
                                                <div key={i} className={cn('flex gap-3 text-sm', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] shrink-0"
                                                        style={msg.role === 'user'
                                                            ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }
                                                            : { background: 'linear-gradient(135deg, #059669, #34d399)', color: '#fff' }}>
                                                        {msg.role === 'user' ? 'ME' : '🤖'}
                                                    </div>
                                                    <div className="p-3 rounded-xl max-w-[80%] text-xs leading-relaxed"
                                                        style={msg.role === 'user'
                                                            ? { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: 'var(--foreground)' }
                                                            : { background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            ))}
                                            {isChatting && (
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px]"
                                                        style={{ background: 'linear-gradient(135deg, #059669, #34d399)', color: '#fff' }}>🤖</div>
                                                    <div className="px-4 py-3 rounded-xl text-xs text-muted-foreground"
                                                        style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                                                        <span className="animate-pulse">Thinking…</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>
                                        <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
                                            <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                                                <Input value={chatInput} onChange={e => setChatInput(e.target.value)}
                                                    placeholder="Ask about your code or errors…"
                                                    className="bg-background border-border text-foreground text-xs" />
                                                <Button type="submit" size="icon" disabled={isChatting}
                                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none' }}>
                                                    <LucideSend className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── DRAGGABLE DIVIDER (VERTICAL) ──── */}
                    <div
                        onMouseDown={startResizingH}
                        className="hidden lg:flex w-2 group items-center justify-center cursor-col-resize z-20 transition-all"
                    >
                        <div className="w-[1px] h-4/5 bg-white/5 group-hover:bg-purple-500/40 transition-colors relative" />
                    </div>

                    {/* ── RIGHT: Editor ── */}
                    <div
                        className="flex flex-col overflow-hidden rounded-2xl order-1 lg:order-2 h-full lg:flex-1 relative transition-all duration-300 focus-within:border-purple-500/50 focus-within:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                        style={{
                            width: isDesktop ? 'auto' : '100%',
                            border: '1px solid rgba(168,85,247,0.2)',
                            background: '#0d1117',
                            boxShadow: '0 4px 24px -5px rgba(0,0,0,0.4)'
                        }}>
                        {/* Editor Section */}
                        <div className="flex flex-col overflow-hidden" style={{ height: showTestPanel ? `${100 - panelHeight}%` : '100%' }}>
                            {/* Lang bar */}
                            <div className="flex items-center gap-1 px-3 py-2 shrink-0"
                                style={{ borderBottom: '1px solid rgba(168,85,247,0.15)', background: 'rgba(13,17,23,0.95)' }}>
                                <div className="flex items-center gap-1.5 mr-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                                </div>
                                <span className="text-[9px] font-black text-purple-400/50 uppercase tracking-[0.2em] mr-2">ENV</span>
                                {(['python', 'c', 'cpp', 'java'] as Language[]).map(l => {
                                    const m = LANG_META[l];
                                    return (
                                        <button key={l} onClick={() => setLanguage(l)}
                                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all"
                                            style={language === l
                                                ? { background: m.glow, border: `1px solid ${m.color}55`, color: m.color, boxShadow: `0 0 10px ${m.glow}` }
                                                : { background: 'transparent', border: '1px solid transparent', color: '#64748b' }}>
                                            <span>{m.emoji}</span>{l.toUpperCase()}
                                        </button>
                                    );
                                })}
                                <div className="flex-1" />
                                <button className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ color: '#64748b' }}>
                                    <LucideMaximize2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Editor Wrapper */}
                            <div className="flex-1 overflow-hidden relative">
                                <div ref={editorContainerRef} className="absolute inset-0 h-full" />
                            </div>
                        </div>

                        {/* ── DRAGGABLE DIVIDER (HORIZONTAL) ── */}
                        {showTestPanel && (
                            <div
                                onMouseDown={startResizingV}
                                className="h-1.5 bg-border/50 hover:bg-purple-500/30 cursor-row-resize z-30 transition-colors flex items-center justify-center group"
                            >
                                <div className="w-12 h-1 rounded-full bg-white/5 group-hover:bg-purple-500/40 transition-colors" />
                            </div>
                        )}

                        {/* Test Cases / Output Panel */}
                        {showTestPanel && (
                            <div className="shrink-0 flex flex-col bg-[#060a10]"
                                style={{ height: `${panelHeight}%`, borderTop: '1px solid rgba(168,85,247,0.1)' }}>

                                {/* Panel Header Tabs */}
                                <div className="flex items-center justify-between px-2 bg-[#090e16] border-b border-white/5">
                                    <div className="flex items-center gap-1">
                                        {[
                                            { id: 'testcases', icon: LucideTerminal, label: 'Test Cases' },
                                            { id: 'console', icon: LucideFileCode, label: 'Console' },
                                        ].map(tab => (
                                            <button
                                                key={tab.id}
                                                // @ts-ignore
                                                onClick={() => setActivePanelTab(tab.id)}
                                                className={cn(
                                                    "px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all relative border-b-2",
                                                    activePanelTab === tab.id
                                                        ? "text-purple-400 border-purple-500 bg-purple-500/5"
                                                        : "text-muted-foreground border-transparent hover:text-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <tab.icon className="w-3 h-3" />
                                                    {tab.label}
                                                </div>
                                            </button>
                                        ))}
                                        {testResults.length > 0 && activePanelTab === 'testcases' && (
                                            <div className="ml-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                                                <span className="text-[9px] font-black uppercase text-muted-foreground mr-1">Result:</span>
                                                <span className="text-[10px] font-black text-emerald-400">
                                                    {testResults.filter(r => r.status === 'passed').length}
                                                </span>
                                                <span className="text-[10px] text-white/20">/</span>
                                                <span className="text-[10px] font-black text-muted-foreground">
                                                    {testResults.length}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 px-3">
                                        <button
                                            onClick={() => setPanelHeight(panelHeight > 80 ? 40 : 90)}
                                            className="p-1.5 text-muted-foreground hover:text-white transition-colors"
                                            title={panelHeight > 80 ? "Contract" : "Expand"}
                                        >
                                            {panelHeight > 80 ? <LucideChevronDown className="w-4 h-4" /> : <LucideChevronUp className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => setTestResults([])} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors" title="Clear Logs">
                                            <LucideTrash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => setShowTestPanel(false)} className="p-1.5 text-muted-foreground hover:text-white transition-colors" title="Close Panel">
                                            <span className="text-xl leading-none">&times;</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                    {activePanelTab === 'testcases' && (
                                        <div className="space-y-4">
                                            {testResults.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40 py-12">
                                                    <LucideTerminal className="w-12 h-12 mb-3" />
                                                    <p className="text-xs uppercase tracking-widest font-black">No results yet. Run your code!</p>
                                                </div>
                                            ) : (
                                                testResults.map((res, i) => (
                                                    <div key={i} className="animate-in fade-in slide-in-from-left duration-300">
                                                        <div className={cn(
                                                            "rounded-xl border overflow-hidden transition-all",
                                                            res.status === 'passed' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'
                                                        )}>
                                                            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                                        Test Case #{i + 1}
                                                                        {res.status === 'passed' ? <LucideCheckCircle className="w-3 h-3 text-emerald-400" /> : <LucideAlertTriangle className="w-3 h-3 text-red-400" />}
                                                                    </span>
                                                                    {res.time && (
                                                                        <span className="text-[9px] text-white/20 font-mono">
                                                                            {(parseFloat(res.time) * 1000).toFixed(0)}ms
                                                                        </span>
                                                                    )}
                                                                    {res.memory && (
                                                                        <span className="text-[9px] text-white/20 font-mono">
                                                                            {(parseFloat(res.memory) / 1024).toFixed(1)}MB
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className={cn(
                                                                    "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                                                                    res.status === 'passed' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
                                                                )}>
                                                                    {res.status.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                                                                <div>
                                                                    <div className="text-[8px] font-black text-muted-foreground/60 uppercase mb-1.5 flex items-center gap-1.5"><LucideInfo className="w-2.5 h-2.5" /> Input</div>
                                                                    <pre className="text-[11px] font-mono p-2.5 rounded bg-black/40 border border-white/5 text-foreground whitespace-pre-wrap break-words custom-scrollbar">{res.input}</pre>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[8px] font-black text-muted-foreground/60 uppercase mb-1.5 flex items-center gap-1.5"><LucideCheckCircle className="w-2.5 h-2.5" /> Expected</div>
                                                                    <pre className="text-[11px] font-mono p-2.5 rounded bg-black/40 border border-white/5 text-purple-300 whitespace-pre-wrap break-words custom-scrollbar">{res.expected}</pre>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[8px] font-black text-muted-foreground/60 uppercase mb-1.5 flex items-center gap-1.5"><LucideTerminal className="w-2.5 h-2.5" /> Your Output</div>
                                                                    <pre className={cn(
                                                                        "text-[11px] font-mono p-2.5 rounded bg-black/40 border whitespace-pre-wrap break-words custom-scrollbar",
                                                                        res.status === 'passed' ? 'text-emerald-400 border-emerald-500/10' : 'text-red-400 border-red-500/10'
                                                                    )}>
                                                                        {res.status === 'running' ? 'Executing…' : res.actual || '(no output)'}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                            {res.explanation && res.status === 'failed' && (
                                                                <div className="px-4 py-2.5 bg-black/20 border-t border-white/5 text-[10px] text-muted-foreground leading-relaxed italic flex items-start gap-2">
                                                                    <span className="text-purple-400 mt-0.5">💡</span>
                                                                    <span>Hint: {res.explanation}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {activePanelTab === 'console' && (
                                        <div className="font-mono text-[11px] space-y-2 text-muted-foreground">
                                            <div className="flex items-center gap-2 text-purple-400/60 mb-4 border-b border-purple-500/10 pb-2">
                                                <LucideTerminal className="w-3.5 h-3.5" />
                                                <span className="uppercase tracking-[0.2em] font-black text-[9px]">Standard Output (stdout)</span>
                                            </div>
                                            {testResults.some(r => r.actual) ? (
                                                testResults.map((r, i) => r.actual && (
                                                    <div key={i} className="group relative">
                                                        <div className="absolute -left-2 top-0 w-0.5 h-full bg-purple-500/20 group-hover:bg-purple-500/50 transition-colors" />
                                                        <div className="text-[9px] text-purple-500/40 mb-0.5 uppercase tracking-tighter">[Case #{i + 1}]</div>
                                                        <div className="text-foreground leading-relaxed bg-white/5 p-2 rounded-r-md border-l border-white/10">{r.actual}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center opacity-30 italic">Console is empty. Run code to see stdout.</div>
                                            )}
                                        </div>
                                    )}

                                </div>

                                {/* Status bar (Mini) */}
                                <div className="flex items-center justify-between px-4 py-1.5 text-[9px] font-mono shrink-0"
                                    style={{ background: '#090e16', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#4b5563' }}>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> READY</span>
                                        {executionStats && <span>{executionStats.time} | {executionStats.memory}</span>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={copyLogs}
                                            className="hover:text-purple-400 transition-colors flex items-center gap-1"
                                        >
                                            <LucideCopy className="w-2.5 h-2.5" /> COPY LOGS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between px-4 py-1.5 text-[10px] font-mono shrink-0"
                    style={{ background: '#060a10', borderTop: '1px solid rgba(168,85,247,0.1)', color: '#4b5563' }}>
                    <div className="flex items-center gap-3">
                        <span style={{ color: lang.color }}>{lang.emoji} {language.toUpperCase()}</span>
                        <span>#{problem.id} {problem.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={timerExpired ? 'text-red-500' : 'text-emerald-500/60'}>
                            {timerExpired ? '⏰ EXPIRED' : timerRunning ? '⏱ RUNNING' : '● READY'}
                        </span>
                        <span>{code.split('\n').length} lines</span>
                    </div>
                </div>
            </div>

            {/* ── TOAST NOTIFICATION ──────────────── */}
            {toast && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className={cn(
                        "px-6 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3",
                        toast.type === 'error'
                            ? "bg-red-500/10 border-red-500/30 text-red-400"
                            : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    )}>
                        {toast.type === 'error' ? <LucideAlertTriangle className="w-4 h-4" /> : <LucideInfo className="w-4 h-4" />}
                        <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
                    </div>
                </div>
            )}
        </>
    );
}

/* ── Page export (wraps in Suspense for useSearchParams) */
export default function StudentArenaPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
                <div className="text-center space-y-3">
                    <div className="text-4xl animate-spin">⚔️</div>
                    <div className="font-black text-purple-400">Loading Arena…</div>
                </div>
            </div>
        }>
            <ArenaInner />
        </Suspense>
    );
}
