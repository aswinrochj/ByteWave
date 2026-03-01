import HeroSection from '@/components/landing/HeroSection';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      {/* Other sections could go here */}
    </main>
  );
}
