import ValueEngine from '@/components/landing/ValueEngine';
import TrustBuilder from '@/components/landing/TrustBuilder';
import ConversionTrigger from '@/components/landing/ConversionTrigger';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <ValueEngine />
      <TrustBuilder />
      <ConversionTrigger />

      <footer className="py-8 text-center text-gray-700 text-sm border-t border-gray-900">
        <p>&copy; {new Date().getFullYear()} Bytewave. All Intelligence Verified.</p>
      </footer>
    </main>
  );
}
