import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories } from '@/tools/registry';
import { Directory } from '@/components/directory';
import { categoryDescription, pageMetadata } from '@/lib/seo';
export function generateStaticParams() { return categories.map(c => ({ category: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const match = categories.find((item) => item.slug === category);
  if (!match) return { title: 'Category' };
  return pageMetadata({
    title: match.title,
    description: categoryDescription(match.slug),
    path: `/${match.slug}`,
  });
}
export default async function Category({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; const c = categories.find(c => c.slug === category); if (!c) notFound(); return <Directory initialCategory={c.slug}/>; }
