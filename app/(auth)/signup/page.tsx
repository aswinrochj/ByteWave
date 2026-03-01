'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LucideCode2, LucideBriefcase, LucideBuilding2, LucideArrowRight } from 'lucide-react';
import { cn } from '@/components/ui/button';

import { registerWithEmail } from '@/lib/firebase/auth';
import { useUser } from '@/components/providers/UserProvider';
import { usePageTransition } from '@/components/providers/PageTransitionProvider';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: userLoading, setUser: setLocalUser } = useUser();
    const initialRole = searchParams.get('role');
    const [role, setRole] = useState<'student' | 'recruiter' | 'institution' | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialRole === 'student' || initialRole === 'recruiter' || initialRole === 'institution') {
            setRole(initialRole);
        }
    }, [initialRole]);

    // Redirect if already logged in
    useEffect(() => {
        if (user.id && !userLoading) {
            const resolvedRole = user.role || role || 'student';
            if (resolvedRole === 'recruiter') router.push('/recruiter/talent');
            else if (resolvedRole === 'institution') router.push('/institution/assessments');
            else router.push('/student/dashboard');
        }
    }, [user, userLoading, role, router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!role) {
            setError('Please select a role first.');
            setLoading(false);
            return;
        }

        try {
            const firebaseUser = await registerWithEmail(email, password);

            // Create the profile in Firestore with the selected role and name
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const name = `${firstName} ${lastName}`.trim();
            const username = '@' + firstName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);

            const profileData = {
                id: firebaseUser.uid,
                email,
                name,
                role,
                username,
                avatarUrl: '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Save to master users collection
            await setDoc(userDocRef, profileData);

            // Save to role-specific collection (Hiring Manager or Institution)
            if (role === 'recruiter') {
                const recruiterDocRef = doc(db, 'recruiters', firebaseUser.uid);
                await setDoc(recruiterDocRef, {
                    ...profileData,
                    companyName: '',
                    industry: '',
                });
            } else if (role === 'institution') {
                const institutionDocRef = doc(db, 'institutions', firebaseUser.uid);
                await setDoc(institutionDocRef, {
                    ...profileData,
                    institutionName: '',
                    institutionType: 'college',
                });
            }

            // Local redirection is handled by the useEffect
        } catch (err: any) {
            console.error("Signup error code:", err.code);

            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Try logging in instead.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address format.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak. Please use at least 6 characters.');
                    break;
                case 'auth/operation-not-allowed':
                    setError('Email/Password accounts are not enabled. Please contact support.');
                    break;
                default:
                    setError(err.message || 'Signup failed. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="z-10 w-full max-w-5xl p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side: Context / Marketing */}
            <div className="hidden md:block space-y-8">
                <div className="bg-purple-500/10 inline-flex items-center gap-2 px-3 py-1 rounded-full text-purple-400 text-sm border border-purple-500/20">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    Live Intelligence Network
                </div>
                <h1 className="text-5xl font-black tracking-tight leading-tight text-white">
                    Stop proving yourself<br />
                    <span className="text-muted-foreground">start verifying your skill.</span>
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                    The platform that quantifies your cognitive ability and matches you directly with top-tier roles based on pure data. Zero bias.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="game-card p-5">
                        <div className="text-3xl font-black text-white mb-1">98%</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Placement Rate</div>
                    </div>
                    <div className="game-card p-5">
                        <div className="text-3xl font-black text-white mb-1">15m+</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Lines Analyzed</div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full max-w-md mx-auto game-card p-8 rounded-2xl shadow-2xl relative" style={{ background: 'rgba(15, 10, 34, 0.8)', backdropFilter: 'blur(12px)' }}>
                {!role ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-center mb-8">Choose your identity</h2>
                        <div className="grid gap-4">
                            {[
                                { id: 'student', label: 'I am a Developer', desc: 'I want to prove my skills & get hired.', icon: LucideCode2, color: '#c084fc' },
                                { id: 'recruiter', label: 'I am Hiring', desc: 'I want verified talent data.', icon: LucideBriefcase, color: '#a855f7' },
                                { id: 'institution', label: 'I represent a College', desc: 'I want to assess students.', icon: LucideBuilding2, color: '#e9d5ff' },
                            ].map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setRole(r.id as any)}
                                    className="flex items-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl transition-all group text-left"
                                >
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                        <r.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{r.label}</div>
                                        <div className="text-xs text-muted-foreground">{r.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <button
                            onClick={() => setRole(null)}
                            disabled={loading}
                            className="text-xs text-muted-foreground hover:text-white mb-6 flex items-center gap-1 font-bold"
                        >
                            ← Change Role
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-white mb-2">
                                {role === 'student' ? 'Claim your Developer Profile' :
                                    role === 'recruiter' ? 'Access Talent Intelligence' : 'Institutional Access'}
                            </h2>
                            <p className="text-sm text-muted-foreground font-medium">
                                {role === 'student' ? 'Start your assessment journey.' : 'Create your organization account.'}
                            </p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4 font-sans">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">First Name</label>
                                    <Input
                                        placeholder="John"
                                        className="bg-white/5 border-white/10 h-11"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Last Name</label>
                                    <Input
                                        placeholder="Doe"
                                        className="bg-white/5 border-white/10 h-11"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Email</label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="bg-white/5 border-white/10 h-11"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 h-11"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-red-400 font-medium px-1 bg-red-400/5 py-2 rounded border border-red-400/10 italic">⚠️ {error}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 text-base font-black mt-4 transition-all hover:scale-[1.02] shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none' }}>
                                {loading ? 'Creating Profile...' : 'Create Account'} <LucideArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>

                        <p className="text-[10px] text-center text-muted-foreground mt-6 font-medium">
                            By joining, you agree to our <span className="text-purple-400 font-bold">Terms of Intelligence</span> & <span className="text-purple-400 font-bold">Privacy Policy</span>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden text-white font-sans">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, rgba(168, 85, 247, 0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(124, 58, 237, 0.1), transparent 60%)' }} />

            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

            <Suspense fallback={<div className="text-white text-center font-black">Initialising...</div>}>
                <SignupContent />
            </Suspense>
        </div>
    );
}
