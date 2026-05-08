import { Metadata } from 'next';
import { getHreflangAlternates, baseUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: 'Page Not Found - tripcngo.com',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f7] px-6 py-20">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-black text-[#1b887a] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a
          href="/en"
          className="inline-block px-8 py-3 bg-[#1b887a] text-white font-bold rounded-lg hover:bg-[#15706a] transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
