import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Header, Footer } from '@/components/chrome';
import { siteUrl } from '@/lib/site';
import './globals.css';
export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: { default: 'AussieTools — Practical tools for Australian life', template: '%s | AussieTools' }, description: 'Simple, transparent tools for real Australian decisions. Calculate job profit, compare your options and make a better call.', openGraph: { title: 'AussieTools', description: 'Practical tools for real Australian decisions.', locale: 'en_AU', type: 'website' } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en-AU"><body><a href="#main" className="skip-link">Skip to content</a><Header/><main id="main">{children}</main><Footer/>{process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && <Analytics/>}</body></html>; }
