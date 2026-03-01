'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { LucideLock, LucideUser, LucideMail } from 'lucide-react';
import { useUser } from '@/components/providers/UserProvider';

import { loginWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { usePageTransition } from '@/components/providers/PageTransitionProvider';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: userLoading } = useUser();
    const role = searchParams.get('role') as 'student' | 'recruiter' | 'institution' | null;
    const [roleLabel, setRoleLabel] = useState<string>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (role === 'student') setRoleLabel('Developer');
        else if (role === 'recruiter') setRoleLabel('Recruiter');
        else if (role === 'institution') setRoleLabel('Institution');
    }, [role]);

    // Redirect if already logged in
    useEffect(() => {
        if (user.id && !userLoading) {
            const resolvedRole = user.role || role || 'student';
            if (resolvedRole === 'recruiter') router.push('/recruiter/talent');
            else if (resolvedRole === 'institution') router.push('/institution/assessments');
            else router.push('/student/dashboard');
        }
    }, [user, userLoading, role, router]);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loginWithEmail(email, password);
            // Redirection is handled by the useEffect above
        } catch (err: any) {
            console.error("Login error code:", err.code);

            // Map Firebase error codes to user-friendly messages
            switch (err.code) {
                case 'auth/invalid-credential':
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setError('Invalid email or password. Please try again or join the network.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed attempts. Please try again later.');
                    break;
                case 'auth/user-disabled':
                    setError('This account has been disabled.');
                    break;
                default:
                    setError(err.message || 'Failed to sign in. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
            // Redirection handled by useEffect
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="z-10 w-full max-w-md p-8 bg-gray-950/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl">
            <div className="text-center mb-8">
                <div className="bg-indigo-500/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                    <LucideLock className="w-6 h-6 text-indigo-400" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    {roleLabel ? `${roleLabel} Login` : 'Welcome Back'}
                </h1>
                <p className="text-sm text-gray-400 mt-2">Enter your credentials to access your intelligence dashboard.</p>
            </div>

            <div className="space-y-4">
                <Button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    variant="outline"
                    className="w-full h-12 bg-white/5 hover:bg-white/10 border-white/10 text-white flex items-center justify-center gap-3 transition-all"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </Button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-950 px-2 text-gray-500 italic">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                            <LucideMail className="w-3.5 h-3.5 text-indigo-400" /> Email
                        </label>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                <LucideLock className="w-3.5 h-3.5 text-indigo-400" /> Password
                            </label>
                            <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-tighter">Forgot?</Link>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
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
                        className="w-full bg-indigo-600 hover:bg-indigo-700 font-black py-6 rounded-lg text-lg transition-all shadow-lg shadow-indigo-500/20"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </Button>
                </form>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link
                    href={role ? `/signup?role=${role}` : '/select-role'}
                    className="text-indigo-400 hover:text-indigo-300 font-bold underline decoration-dotted"
                >
                    Join the network
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80 pointer-events-none" />

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
