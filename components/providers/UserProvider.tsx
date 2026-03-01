'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { auth, db } from '@/lib/firebase/config';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/* ─── helpers ──────────────────────────────── */
function buildInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase() ?? '')
        .join('');
}

/* ─── default guest shell (no data yet) ───── */
const GUEST: User = {
    id: '',
    name: '',
    email: '',
    role: 'student',
    createdAt: new Date(),
};

/* ─── context type ─────────────────────────── */
interface UserContextType {
    user: User;
    initials: string;
    setUser: (u: Partial<User>) => void;
    clearUser: () => void;
    isLoggedIn: boolean;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ─── provider ─────────────────────────────── */
export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<User>(GUEST);
    const [loading, setLoading] = useState(true);

    const syncUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserState({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: data.name || firebaseUser.displayName || 'Anonymous User',
                role: data.role || 'student',
                username: data.username || '',
                avatarUrl: data.avatarUrl || firebaseUser.photoURL || '',
                createdAt: data.createdAt?.toDate() || new Date(),
                ...data
            });
        } else {
            // Create a default profile if it doesn't exist
            const newProfile: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || 'Anonymous User',
                role: 'student', // Default role
                username: firebaseUser.email?.split('@')[0] || '',
                avatarUrl: firebaseUser.photoURL || '',
                createdAt: new Date(),
            };

            await setDoc(userDocRef, {
                ...newProfile,
                createdAt: serverTimestamp(),
            });
            setUserState(newProfile);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                try {
                    await syncUserProfile(firebaseUser);
                } catch (error) {
                    console.error("Error syncing user profile:", error);
                }
            } else {
                setUserState(GUEST);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [syncUserProfile]);

    const setUser = useCallback(async (updates: Partial<User>) => {
        setUserState(prev => {
            const next = { ...prev, ...updates };
            // If we have an ID, we should sync to Firestore
            if (next.id) {
                const userDocRef = doc(db, 'users', next.id);
                setDoc(userDocRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true })
                    .catch(err => console.error("Error updating firestore profile:", err));
            }
            return next;
        });
    }, []);

    const clearUser = useCallback(() => {
        setUserState(GUEST);
    }, []);

    const initials = buildInitials(user.name) || (user.role === 'student' ? 'S' : user.role === 'recruiter' ? 'R' : 'I');

    return (
        <UserContext.Provider value={{ user, initials, setUser, clearUser, isLoggedIn: !!user.id, loading }}>
            {children}
        </UserContext.Provider>
    );
}

/* ─── hook ─────────────────────────────────── */
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
    return ctx;
}
