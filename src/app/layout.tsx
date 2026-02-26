import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'WatchPick — Deixe a gente escolher o que assistir',
  description:
    'Não sabe o que assistir? Selecione seus streamings, filtros de gênero e duração, e receba uma sugestão perfeita de filme ou série.',
  keywords: [
    'filmes',
    'séries',
    'streaming',
    'sugestão',
    'o que assistir',
    'Netflix',
    'Disney+',
    'Prime Video',
  ],
  openGraph: {
    title: 'WatchPick — Deixe a gente escolher o que assistir',
    description:
      'Selecione seus streamings e receba a sugestão perfeita de filme ou série.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'WatchPick',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WatchPick — Deixe a gente escolher o que assistir',
    description:
      'Selecione seus streamings e receba a sugestão perfeita de filme ou série.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} font-sans antialiased bg-gray-950 text-white min-h-screen flex flex-col`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
