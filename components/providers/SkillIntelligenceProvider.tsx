'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER_DNA } from '@/lib/mock-data';
import { SkillDNA } from '@/types/user';
import { useUser } from './UserProvider';

export interface SessionData {
    logicScore: number;
    patternStrength: number;
    optimizationRating: number;
    consistencyScore: number;
    skillScore: number;
    timestamp: number;
}

interface SkillIntelligenceContextType {
    dna: SkillDNA;
    updateDNA: (newDNA: Partial<SkillDNA>) => void;
    addSession: (session: {
        logicScore: number,
        patternStrength: number,
        optimizationRating: number,
        consistencyScore: number,
        skillScore: number
    }, difficulty?: 'Easy' | 'Medium' | 'Hard') => void;
    history: SessionData[];
}

const SkillIntelligenceContext = createContext<SkillIntelligenceContextType | undefined>(undefined);

export function SkillIntelligenceProvider({ children }: { children: React.ReactNode }) {
    const [dna, setDna] = useState<SkillDNA>({
        ...MOCK_USER_DNA,
        consistencyScore: MOCK_USER_DNA.logicScore - 5,
        skillScore: MOCK_USER_DNA.logicScore + 2,
    });
    const [history, setHistory] = useState<SessionData[]>([]);

    const { user, setUser } = useUser();

    useEffect(() => {
        // Hydrate history from localStorage
        const savedHistory = localStorage.getItem('skill_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        } else {
            const initialSession: SessionData = {
                logicScore: MOCK_USER_DNA.logicScore,
                patternStrength: MOCK_USER_DNA.patternStrength,
                optimizationRating: MOCK_USER_DNA.optimizationRating,
                consistencyScore: MOCK_USER_DNA.logicScore - 5,
                skillScore: MOCK_USER_DNA.logicScore + 2,
                timestamp: Date.now()
            };
            setHistory([initialSession]);
        }
    }, []);

    // Effect to sync DNA with User context bytecoins
    useEffect(() => {
        if (user.byteCoin !== undefined) {
            setDna(prev => ({ ...prev, byteCoin: user.byteCoin || 0 }));
        }
    }, [user.byteCoin]);

    const addSession = (session: {
        logicScore: number,
        patternStrength: number,
        optimizationRating: number,
        consistencyScore: number,
        skillScore: number
    }, difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium') => {
        const newSession: SessionData = { ...session, timestamp: Date.now() };

        setHistory(prevHistory => {
            const updatedHistory = [...prevHistory, newSession];
            const totalSessions = updatedHistory.length;

            const avgLogic = Math.round(updatedHistory.reduce((sum, s) => sum + s.logicScore, 0) / totalSessions);
            const avgPattern = Math.round(updatedHistory.reduce((sum, s) => sum + s.patternStrength, 0) / totalSessions);
            const avgOpt = Math.round(updatedHistory.reduce((sum, s) => sum + s.optimizationRating, 0) / totalSessions);
            const avgCons = Math.round(updatedHistory.reduce((sum, s) => sum + s.consistencyScore, 0) / totalSessions);
            const avgSkill = Math.round(updatedHistory.reduce((sum, s) => sum + s.skillScore, 0) / totalSessions);

            const baseline = updatedHistory[0];
            const growth = baseline.logicScore > 0
                ? Math.round(((avgLogic - baseline.logicScore) / baseline.logicScore) * 100)
                : 0;

            // Calculate ByteCoin Reward
            const rewardMap = { Easy: 20, Medium: 50, Hard: 100 };
            const reward = rewardMap[difficulty] || 50;

            const newDNA: SkillDNA = {
                logicScore: avgLogic,
                patternStrength: avgPattern,
                optimizationRating: avgOpt,
                consistencyScore: avgCons,
                skillScore: avgSkill,
                growthCurve: growth,
                streak: dna.streak + 1,
                byteCoin: (dna.byteCoin || 0) + reward,
                lastUpdated: new Date()
            };

            localStorage.setItem('skill_history', JSON.stringify(updatedHistory));
            setDna(newDNA);

            // Sync with User context if logged in
            if (user.id) {
                setUser({ byteCoin: newDNA.byteCoin });
            }

            return updatedHistory;
        });
    };

    const updateDNA = (updates: Partial<SkillDNA>) => {
        setDna(prev => {
            const newDNA = { ...prev, ...updates };
            localStorage.setItem('skill_dna', JSON.stringify(newDNA));
            return newDNA;
        });
    }

    return (
        <SkillIntelligenceContext.Provider value={{ dna, updateDNA, addSession, history }}>
            {children}
        </SkillIntelligenceContext.Provider>
    );
}

export function useSkillIntelligence() {
    const context = useContext(SkillIntelligenceContext);
    if (context === undefined) {
        throw new Error('useSkillIntelligence must be used within a SkillIntelligenceProvider');
    }
    return context;
}
