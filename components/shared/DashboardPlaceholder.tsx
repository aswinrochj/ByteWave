
import { LucideConstruction, LucideArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardPlaceholderProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionLink?: string;
}

export default function DashboardPlaceholder({ title, description, actionLabel, actionLink }: DashboardPlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-gray-950/50 rounded-3xl border border-gray-800 m-4">
            <div className="bg-gray-900 p-6 rounded-full mb-6 animate-pulse">
                <LucideConstruction className="w-12 h-12 text-indigo-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
            <p className="text-gray-400 max-w-lg mb-8 text-lg">{description}</p>

            {actionLabel && actionLink && (
                <Link href={actionLink}>
                    <Button variant="outline" className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300">
                        {actionLabel} <LucideArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            )}
        </div>
    );
}
