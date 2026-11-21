import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://80.fhr.ru'),
  title: '80 лет отечественному хоккею — Хоккей объединяет',
  description: '80 лет великой истории отечественного хоккея: от первого чемпионата СССР до наших дней.',
  robots: { index: false, follow: false },
  openGraph: {
    title: '80 лет Отечественному хоккею',
    description: 'Хоккей объединяет. 1946–2026.',
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '80 лет отечественному хоккею' }],
  },
  twitter: { card: 'summary_large_image', title: '80 лет Отечественному хоккею', images: ['/og-image.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><head>
    <link rel="preload" href="/fonts/onest-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/onest-medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/fhr80.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
  </head><body>{children}</body></html>;
}
