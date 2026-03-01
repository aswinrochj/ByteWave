'use client';

import StudentArenaPage from '@/app/(dashboard)/student/arena/page';

export default function InstitutionArenaPreviewPage() {
    return (
        <div className="relative">
            <div className="absolute top-0 right-0 z-10 bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-bl-xl text-xs font-bold border-l border-b border-yellow-500/20">
                PREVIEW MODE
            </div>
            <StudentArenaPage />
        </div>
    );
}
