import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SharkD — Autonomous Trading Intelligence',
  description: 'Deploy your personal AI trading agent. Skill-powered autonomous Solana trading with a conversational interface.',
  openGraph: {
    title: 'SharkD — Autonomous Trading Intelligence',
    description: 'Deploy your personal AI trading agent. Skill-powered. Conversational. Battle-tested.',
    siteName: 'SharkD',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="noise">{children}</body>
    </html>
  );
}
