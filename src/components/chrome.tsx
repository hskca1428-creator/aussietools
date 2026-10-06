'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Wrench } from 'lucide-react';
import { categories } from '@/tools/registry';
export function Header() {
  const [open, setOpen] = useState(false); const path = usePathname();
  return <header className="header"><div className="container header-inner"><Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="AussieTools home"><span className="brand-mark"><Wrench size={23} strokeWidth={2.4}/></span>Aussie<span>Tools</span><small>.au</small></Link><nav className="desktop-nav" aria-label="Main navigation"><Link href="/" className={path === '/' ? 'active' : ''}>Explore tools</Link><Link href="/guides">Guides</Link><Link href="/about">Our approach</Link></nav><Link href="/business/job-profit-calculator" className="header-cta">Check a job</Link><button className="mobile-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>{open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation"><Link href="/" onClick={() => setOpen(false)}>Explore tools</Link><Link href="/guides" onClick={() => setOpen(false)}>Guides</Link><Link href="/about" onClick={() => setOpen(false)}>Our approach</Link>{categories.map(c => <Link key={c.slug} href={`/${c.slug}`} onClick={() => setOpen(false)}>{c.title}</Link>)}</nav>}</header>;
}
export function Footer() { return <footer className="footer"><div className="container footer-top"><div><Link href="/" className="brand light">Aussie<span>Tools</span><small>.au</small></Link><p>Practical tools for real Australian decisions.</p></div><div className="footer-links"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">Disclaimer</Link></div></div><div className="container footer-bottom"><span>Built for Australian life.</span><span>© {new Date().getFullYear()} AussieTools · v0.1</span></div></footer>; }
