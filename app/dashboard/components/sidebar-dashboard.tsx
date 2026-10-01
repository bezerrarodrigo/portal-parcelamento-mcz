import {
  User,
  FileText,
  Receipt,
  FileSpreadsheet,
  Archive,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ItemNavegacao {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  destaque?: boolean;
}

const itens: ItemNavegacao[] = [
  { label: 'Selecionar cadastro', href: '/selecao-cadastro', icon: User },
  { label: 'Guia / Extrato Débito', href: '/dashboard', icon: FileText },
  { label: 'Extrato de pagamento', href: '/dashboard', icon: Receipt },
  {
    label: 'Extrato de parcelamento',
    href: '/dashboard',
    icon: FileSpreadsheet,
    destaque: true,
  },
  { label: 'Parcelamento', href: '/negociacao', icon: Archive, destaque: true },
];

export default function SidebarDashboard() {
  return (
    <aside className='flex shrink-0 flex-wrap gap-4 border-b border-line bg-white px-4 py-3 md:w-32 md:flex-col md:flex-nowrap md:items-center md:gap-6 md:border-r md:border-b-0 md:py-8'>
      {itens.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-2 text-center no-underline md:flex-col md:gap-2',
              item.destaque
                ? 'text-red-500 hover:text-red-600'
                : 'text-ink-soft hover:text-orange',
            )}
          >
            <span className='flex size-10 items-center justify-center rounded-full bg-sand'>
              <Icon size={20} />
            </span>
            <span className='text-[0.7rem] font-semibold'>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
