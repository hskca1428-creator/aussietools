import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Practical guides', alternates: { canonical: '/guides' } };
export default function Guides() { return <div className="container prose-page"><div className="eyebrow green">UNDERSTAND THE NUMBERS</div><h1>A little knowledge goes a long way.</h1><p>Plain-English guides to help you make sense of your results.</p><Link className="article-card" href="/guides/how-to-calculate-job-profit"><h2>How to calculate job profit before you quote</h2><p>Labour, overhead, margin and the costs that are easy to miss.</p></Link></div>; }
