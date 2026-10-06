'use client';
import { track } from '@vercel/analytics';
export function trackEvent(name: string, props?: Record<string, string>) {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') track(name, props);
}
