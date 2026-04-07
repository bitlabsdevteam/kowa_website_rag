import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kowa Trade | AI-powered RAG Assistant',
  description: 'Kowa corporate website with a grounded RAG assistant.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
