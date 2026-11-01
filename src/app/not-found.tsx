import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This page is not on AussieTools.',
};
export default function NotFound() { return <div className="container prose-page"><div className="eyebrow green">404 · WRONG TURN</div><h1>This tool isn’t here.</h1><p>Let’s get you back to something useful.</p><Link className="button" href="/">Explore tools</Link></div>; }
