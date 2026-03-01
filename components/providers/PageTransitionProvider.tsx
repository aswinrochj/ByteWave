'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import LoadingScreen from '@/components/ui/LoadingScreen';

const PageTransitionContext = createContext<{
    isTransitioning: boolean;
    triggerTransition: () => void;
}>({
    isTransitioning: false,
    triggerTransition: () => { },
});

export const usePageTransition = () => useContext(PageTransitionContext);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [initialRender, setInitialRender] = useState(true);

    const triggerTransition = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 3000);
    }, []);

    const [prevPath, setPrevPath] = useState(pathname);

    useEffect(() => {
        if (initialRender) {
            setInitialRender(false);
            setPrevPath(pathname);
            return;
        }

        // Define landing and authentication entry points
        const isEntryPath = (path: string) =>
            path === '/' ||
            path === '/login' ||
            path === '/signup' ||
            path === '/select-role';

        // An internal app navigation is defined as moving between any pages that are NOT entry points
        const isInternalAppNav = !isEntryPath(prevPath) && !isEntryPath(pathname);

        // Capture current pathname for the next comparison before potential early returns
        const currentPath = pathname;

        // Only show transition if we are coming from or going to an entry point (Landing/Login/Signup)
        if (!isInternalAppNav) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 3000);

            setPrevPath(currentPath);
            return () => clearTimeout(timer);
        } else {
            // Ensure no lingering transition states for internal movement
            setIsTransitioning(false);
        }

        setPrevPath(currentPath);
    }, [pathname, searchParams]);

    return (
        <PageTransitionContext.Provider value={{ isTransitioning, triggerTransition }}>
            {isTransitioning && <LoadingScreen />}
            <div className={isTransitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-700'}>
                {children}
            </div>
        </PageTransitionContext.Provider>
    );
}
