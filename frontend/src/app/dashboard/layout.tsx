import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-slate-900 min-h-screen">
            <DashboardLayout>{children}</DashboardLayout>
        </div>
    );
}
