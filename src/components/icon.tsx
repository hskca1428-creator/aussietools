import { Wallet, BriefcaseBusiness, Hammer, House, CarFront, TentTree, Zap, Users, Ruler, type LucideIcon } from 'lucide-react';
const icons: Record<string, LucideIcon> = { wallet: Wallet, briefcase: BriefcaseBusiness, hammer: Hammer, house: House, car: CarFront, tent: TentTree, zap: Zap, users: Users, ruler: Ruler };
export function Icon({ name, size = 24 }: { name: string; size?: number }) { const Component = icons[name] || Hammer; return <Component size={size} strokeWidth={1.7} aria-hidden="true" />; }
