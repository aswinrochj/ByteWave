'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    LucidePlay, LucideMaximize2, LucideTerminal, LucideFileCode,
    LucideMessageSquare, LucideSend, LucideBrain, LucideZap,
    LucideCpu, LucideAlertTriangle, LucideArrowLeft, LucideClock,
    LucideCheckCircle, LucideUpload, LucideLayout,
    LucideShieldCheck, LucideLineChart, LucideDatabase, LucideType,
    LucideLightbulb, LucideChevronDown, LucideClock3, LucideTrash2,
    LucideCopy, LucideChevronUp, LucideInfo, LucideX
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
import { lintKeymap } from "@codemirror/lint";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useSkillIntelligence } from '@/components/providers/SkillIntelligenceProvider';
import { ARENA_PROBLEMS, MOCK_ASSESSMENTS } from '@/lib/mock-data';

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

function fmt(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
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

export default function AssessmentRoom() {
    const params = useParams();
    const router = useRouter();
    const { addSession } = useSkillIntelligence();
    const assessmentId = parseInt(params.id as string, 10);

    // Resolve assessment/problem
    const assessment = MOCK_ASSESSMENTS.find(a => a.id === assessmentId) || MOCK_ASSESSMENTS[0];
    const problem = ARENA_PROBLEMS.find(p => p.id === (assessmentId % 4 + 1)) || ARENA_PROBLEMS[0];

    const [language, setLanguage] = useState<Language>('python');
    const [code, setCode] = useState(problem.boilerplates[language]);
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour for assessment
    const [isTerminated, setIsTerminated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [timerExpired, setTimerExpired] = useState(false);

    // Layout
    const [leftWidth, setLeftWidth] = useState(35);
    const [panelHeight, setPanelHeight] = useState(40);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isResizingH, setIsResizingH] = useState(false);
    const [isResizingV, setIsResizingV] = useState(false);
    const [showTestPanel, setShowTestPanel] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Tabs
    const [activeTab, setActiveTab] = useState<'problem' | 'analysis' | 'chat'>('problem');
    const [activePanelTab, setActivePanelTab] = useState<'testcases' | 'console'>('testcases');

    // Data
    const [testResults, setTestResults] = useState<any[]>([]);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: `Welcome to the secure assessment environment. I'm here to support your technical journey. Focus on "${problem.title}".` },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatting, setIsChatting] = useState(false);
    const [executionStats, setExecutionStats] = useState<{ time: string; memory: string } | null>(null);

    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const languageConf = useRef(new Compartment());
    const readonlyConf = useRef(new Compartment());
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Resizing logic
    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const startResizingH = useCallback(() => setIsResizingH(true), []);
    const startResizingV = useCallback(() => setIsResizingV(true), []);
    const stopResizing = useCallback(() => { setIsResizingH(false); setIsResizingV(false); }, []);

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

    // Exit Prevention
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isTerminated) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isTerminated]);

    // Timer
    useEffect(() => {
        if (isTerminated) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setTimerExpired(true);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isTerminated]);

    const handleAutoSubmit = async () => {
        setIsSubmitting(true);
        setActiveTab('analysis');
        try {
            const result = await analyzeCodeWithGroq(code, problem.title);
            setAnalysisResult(result);
        } finally {
            setIsSubmitting(false);
            setIsTerminated(true);
        }
    };

    // Editor Init
    useEffect(() => {
        if (!editorContainerRef.current) return;
        const state = EditorState.create({
            doc: code,
            extensions: [
                lineNumbers(), highlightActiveLineGutter(), highlightSpecialChars(), history(), foldGutter(), drawSelection(), dropCursor(),
                indentOnInput(), syntaxHighlighting(defaultHighlightStyle, { fallback: true }), bracketMatching(), closeBrackets(), autocompletion(),
                rectangularSelection(), crosshairCursor(), highlightActiveLine(), highlightSelectionMatches(), indentUnit.of("    "),
                languageConf.current.of(python()),
                readonlyConf.current.of(EditorState.readOnly.of(false)),
                keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap, ...completionKeymap, ...lintKeymap, indentWithTab]),
                oneDark,
                EditorView.theme({
                    "&": { height: "100%", fontSize: "14px", backgroundColor: "transparent" },
                    "&.cm-focused": { outline: "none" },
                    ".cm-gutters": { backgroundColor: "#0d1117", color: "#3b4261", borderRight: "none", paddingLeft: "12px", minWidth: "40px" },
                    ".cm-content": { padding: "24px 0" }
                }),
                EditorView.updateListener.of((update) => { if (update.docChanged) setCode(update.view.state.doc.toString()); })
            ]
        });
        const view = new EditorView({ state, parent: editorContainerRef.current });
        editorViewRef.current = view;
        return () => view.destroy();
    }, []);

    // Sync language and readonly
    useEffect(() => {
        if (editorViewRef.current) {
            const newCode = problem.boilerplates[language] || '';

            // Update editor view content
            editorViewRef.current.dispatch({
                changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: newCode },
                effects: languageConf.current.reconfigure(language === 'python' ? python() : language === 'java' ? java() : cpp())
            });

            // Update local state
            setCode(newCode);
        }
    }, [language, problem.boilerplates]);

    useEffect(() => {
        if (editorViewRef.current) {
            editorViewRef.current.dispatch({ effects: readonlyConf.current.reconfigure(EditorState.readOnly.of(isTerminated || timerExpired)) });
        }
    }, [isTerminated, timerExpired]);

    const handleRun = async () => {
        setIsAnalyzing(true);
        setShowTestPanel(true);
        setActivePanelTab('testcases');
        const visibleCases = problem.test_cases.filter(tc => tc.isVisible);
        setTestResults(visibleCases.map(tc => ({ ...tc, status: 'running', actual: '' })));
        try {
            const results = await Promise.all(visibleCases.map(async (tc) => {
                const res = await fetch('/api/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source_code: code, language_id: JUDGE0_LANG_MAP[language], stdin: tc.input }),
                });
                const data = await res.json();
                const actual = data.stdout?.trim() || data.stderr || data.compile_output || '(no output)';
                const passed = data.stdout?.trim() === tc.expected_output.trim();
                return { ...tc, actual, status: passed ? 'passed' : 'failed', time: data.time, memory: data.memory, expected: tc.expected_output };
            }));
            setTestResults(results);
            if (results.length > 0) {
                setExecutionStats({
                    time: `${(parseFloat(results[0].time || '0') * 1000).toFixed(0)}ms`,
                    memory: `${(parseFloat(results[0].memory || '0') / 1024).toFixed(1)}MB`
                });
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setActiveTab('analysis');
        try {
            const aiResult = await analyzeCodeWithGroq(code, problem.title);
            setAnalysisResult(aiResult);
            if (aiResult?.dna) {
                addSession({
                    logicScore: aiResult.dna.logicScore,
                    patternStrength: aiResult.dna.patternStrength,
                    optimizationRating: aiResult.dna.optimizationRating,
                    consistencyScore: aiResult.dna.consistencyScore,
                    skillScore: aiResult.dna.skillScore,
                });
            }
        } finally {
            setIsSubmitting(false);
            setIsTerminated(true);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const msg = { role: 'user' as const, content: chatInput };
        setChatMessages(prev => [...prev, msg]);
        setChatInput('');
        setIsChatting(true);
        try {
            const resp = await getChatResponse(chatMessages.slice(-5).concat(msg), code, problem.title);
            setChatMessages(prev => [...prev, { role: 'assistant', content: resp }]);
        } finally { setIsChatting(false); }
    };

    const diff = DIFF_COLOR[problem.difficulty];
    const langMeta = LANG_META[language];

    if (isTerminated && !isSubmitting) {
        return (
            <div className="min-h-screen bg-[#060a10] flex items-center justify-center p-6 bg-glow-mesh">
                <div className="max-w-xl w-full game-card p-10 text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                        <LucideCheckCircle className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white tracking-tight">Assessment Completed</h1>
                        <p className="text-purple-300/60 font-medium">Your submission has been finalized and processed.</p>
                    </div>

                    {analysisResult && (
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Logic Efficiency</div>
                                <div className="text-2xl font-black text-white">{analysisResult.dna.logicScore}%</div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Final Skill Rating</div>
                                <div className="text-2xl font-black text-white">{analysisResult.dna.skillScore}%</div>
                            </div>
                        </div>
                    )}

                    <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-sm text-muted-foreground leading-relaxed">
                        Data from this session has been securely recorded for institutional review. You may close this tab or return to your dashboard.
                    </div>

                    <Button onClick={() => router.push('/student/assessments')} className="w-full h-14 font-black transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
                        Return to Assessments Hub
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#060a10] text-foreground flex flex-col overflow-hidden">
            {/* ── HEADER ─────────────────────────── */}
            <header className="h-20 shrink-0 px-6 flex items-center justify-between relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0b0f1e 0%, #130a2a 50%, #0a1525 100%)', borderBottom: '1px solid rgba(168,85,247,0.2)' }}>
                <div className="absolute top-0 right-0 w-96 h-full bg-purple-600/5 blur-[80px] pointer-events-none" />

                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-11 h-11 rounded-2xl bg-purple-600 flex items-center justify-center font-black italic text-xl shadow-[0_0_20px_rgba(124,58,237,0.4)]">BW</div>
                    <div className="h-10 w-px bg-white/10" />
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-lg font-black text-white tracking-tight">{assessment.title}</h1>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider"
                                style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
                                {problem.difficulty}
                            </span>
                        </div>
                        <p className="text-[9px] text-purple-400/60 uppercase font-black tracking-[0.2em]">Institutional Secure Environment</p>
                    </div>
                </div>

                <div className="flex items-center gap-8 relative z-10">
                    {/* Timer */}
                    <div className={cn(
                        "flex flex-col items-center px-6 py-2.5 rounded-2xl border transition-all",
                        timeLeft < 300 ? "border-rose-500/50 bg-rose-500/10 animate-pulse" : "border-white/10 bg-white/5"
                    )}>
                        <div className="flex items-center gap-2 mb-1">
                            <LucideClock className={cn("w-3.5 h-3.5", timeLeft < 300 ? "text-rose-500" : "text-purple-400")} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session Ends In</span>
                        </div>
                        <span className={cn("font-mono font-black text-2xl tabular-nums leading-none", timeLeft < 300 ? "text-rose-500" : "text-white")}>
                            {fmt(timeLeft)}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={handleRun} disabled={isAnalyzing || isSubmitting} className="font-black px-6 h-12 gap-2 border-2 transition-all hover:scale-105 active:scale-95 bg-white/5 border-white/10 text-white hover:bg-white/10">
                            {isAnalyzing ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <LucidePlay className="w-4 h-4" />}
                            Run Code
                        </Button>
                        <Button onClick={handleSubmit} disabled={isAnalyzing || isSubmitting} className="font-black px-8 h-12 gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/20"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none' }}>
                            {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LucideUpload className="w-4 h-4" />}
                            Submit Final
                        </Button>
                        <div className="h-10 w-px bg-white/10 mx-2" />
                        <button onClick={() => { if (confirm('Exit assessment? Your progress will be lost.')) router.push('/student/assessments'); }} className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                            <LucideX className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── MAIN GRID ───────────────────────── */}
            <main ref={containerRef} className="flex-1 flex flex-col lg:flex-row min-h-0 relative p-4 gap-4">

                {/* ── LEFT: Problem / Analysis / Chat ── */}
                <div
                    className="flex flex-col gap-4 overflow-hidden h-full"
                    style={{ width: isDesktop ? `${leftWidth}%` : '100%' }}
                >
                    {/* Problem Statement Card (Fixed) */}
                    <div className="flex-1 flex flex-col overflow-hidden rounded-2xl bg-[#0d1117] border border-white/10 shadow-2xl">
                        <div className="flex shrink-0 bg-black/20 border-b border-white/5 px-6 py-4">
                            <h3 className="font-black text-xs text-purple-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <LucideFileCode className="w-4 h-4" /> Assessment Problem
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-2xl font-black text-white mb-3">{problem.title}</h2>
                                <div className="flex gap-2 mb-6">
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider"
                                        style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
                                        {problem.difficulty}
                                    </span>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-white/5 text-muted-foreground">TAG: {problem.tags[0]}</span>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-8">{problem.description}</p>

                                <div className="space-y-6">
                                    <div>
                                        <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Standard Input
                                        </div>
                                        <pre className="text-xs font-mono p-4 rounded-xl bg-black/40 border border-white/5 text-purple-200 whitespace-pre-wrap break-words">{problem.example_input}</pre>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Expected Output
                                        </div>
                                        <pre className="text-xs font-mono p-4 rounded-xl bg-black/40 border border-white/5 text-emerald-200 whitespace-pre-wrap break-words">{problem.example_output}</pre>
                                    </div>

                                    <div className="pt-4">
                                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Constraints</div>
                                        <ul className="space-y-3">
                                            {problem.constraints.map((c, i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40 mt-1.5" />
                                                    {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div onMouseDown={startResizingH} className="hidden lg:flex w-1.5 group items-center justify-center cursor-col-resize z-20 hover:bg-purple-500/10 transition-colors">
                    <div className="w-[1px] h-3/4 bg-white/5 group-hover:bg-purple-500/40" />
                </div>

                {/* ── RIGHT: Editor ── */}
                <div
                    className="flex flex-col flex-1 overflow-hidden rounded-2xl bg-[#09090b] border border-white/10 relative shadow-2xl"
                    style={{ width: isDesktop ? 'auto' : '100%' }}
                >
                    <div className="flex flex-col overflow-hidden" style={{ height: showTestPanel ? `${100 - panelHeight}%` : '100%' }}>
                        {/* Editor Lang Bar */}
                        <div className="h-12 bg-black/60 border-b border-white/5 flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-1 mr-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                </div>
                                {(['python', 'c', 'cpp', 'java'] as Language[]).map(l => (
                                    <button key={l} onClick={() => setLanguage(l)}
                                        className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                            language === l ? "text-white bg-white/10 shadow-lg" : "text-muted-foreground hover:text-white")}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-[10px] text-white/20 font-mono italic">Secure Source Terminal v4.2</div>
                                <LucideMaximize2 className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                        </div>
                        <div ref={editorContainerRef} className="flex-1 overflow-hidden" />
                    </div>

                    {/* Horizontal Divider */}
                    <div onMouseDown={startResizingV} className="h-1.5 cursor-row-resize bg-white/5 hover:bg-purple-500/20 transition-colors flex items-center justify-center group">
                        <div className="w-16 h-[1px] bg-white/10 group-hover:bg-purple-400/40" />
                    </div>

                    {/* Bottom Panel: Test Cases / Console */}
                    <div className="shrink-0 bg-[#060a10]" style={{ height: `${panelHeight}%` }}>
                        <div className="h-11 border-b border-white/5 flex items-center justify-between px-2 bg-black/20">
                            <div className="flex gap-1 h-full">
                                {['testcases', 'console'].map(id => (
                                    <button key={id} onClick={() => setActivePanelTab(id as any)}
                                        className={cn("px-5 h-full text-[10px] font-black uppercase tracking-widest transition-all relative",
                                            activePanelTab === id ? "text-purple-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-purple-500 bg-purple-500/5" : "text-muted-foreground hover:text-white")}
                                    >
                                        {id}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 px-3">
                                <button onClick={() => setTestResults([])} className="p-2 text-muted-foreground hover:text-rose-500 transition-all"><LucideTrash2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => setShowTestPanel(!showTestPanel)} className="p-2 text-muted-foreground hover:text-white transition-all"><LucideChevronDown className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="h-[calc(100%-2.75rem)] overflow-y-auto p-5 custom-scrollbar">
                            {activePanelTab === 'testcases' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    {testResults.length > 0 ? (
                                        testResults.map((res, i) => (
                                            <div key={i} className={cn("p-5 rounded-2xl border transition-all",
                                                res.status === 'passed' ? "bg-emerald-500/5 border-emerald-500/10" : "bg-rose-500/5 border-rose-500/10")}>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Case ID 0{i + 1}</span>
                                                    <span className={cn("text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                                                        res.status === 'passed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20")}>
                                                        {res.status}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px]">
                                                    <div className="space-y-1.5"><div className="text-[8px] uppercase font-black text-muted-foreground/60">Input</div><div className="p-2.5 rounded-xl bg-black/40 text-foreground break-words whitespace-pre-wrap">{res.input}</div></div>
                                                    <div className="space-y-1.5"><div className="text-[8px] uppercase font-black text-muted-foreground/60">Expected</div><div className="p-2.5 rounded-xl bg-black/40 text-purple-300 break-words whitespace-pre-wrap">{res.expected}</div></div>
                                                    <div className="space-y-1.5"><div className="text-[8px] uppercase font-black text-muted-foreground/60">Actual</div><div className={cn("p-2.5 rounded-xl bg-black/40 break-words whitespace-pre-wrap", res.status === 'failed' ? "text-rose-400" : "text-emerald-400")}>{res.actual}</div></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center py-10 opacity-20">
                                            <LucideTerminal className="w-12 h-12 mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest">Execute environment to see logs</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activePanelTab === 'console' && (
                                <div className="font-mono text-[11px] space-y-3 custom-scrollbar">
                                    <div className="text-purple-400/50 mb-4 border-b border-purple-500/10 pb-2 flex items-center gap-2">
                                        <LucideTerminal className="w-3.5 h-3.5" /> STDOUT STREAM
                                    </div>
                                    {testResults.length > 0 ? (
                                        testResults.map((r, i) => r.actual && (
                                            <div key={i} className="p-3 rounded-xl bg-white/5 border-l-2 border-purple-500/30 font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                                                <span className="text-[9px] text-purple-500 font-black mr-2">[CASE {i + 1}]</span>
                                                {r.actual}
                                            </div>
                                        ))
                                    ) : <div className="opacity-20 italic p-4 text-center">No terminal stream detected.</div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* ── FOOTER ─────────────────────────── */}
            <footer className="h-10 shrink-0 px-6 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2 text-emerald-500/60"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Environment Secure</span>
                    <span>{code.split('\n').length} Lines Processed</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2"><LucideShieldCheck className="w-3.5 h-3.5" /> Encrypted Transmission</span>
                    <span className="text-purple-400/50">ByteWave Institutional Auth v1.0</span>
                </div>
            </footer>
        </div>
    );
}
