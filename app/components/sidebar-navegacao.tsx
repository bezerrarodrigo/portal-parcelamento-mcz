import {
  User,
  FileText,
  Receipt,
  FileSpreadsheet,
  Archive,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';

interface ItemNavegacao {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  habilitado?: boolean;
}

const itens: ItemNavegacao[] = [
  {
    label: 'Selecionar cadastro',
    href: '/selecao-cadastro',
    icon: User,
    habilitado: true,
  },
  { label: 'Guia / Extrato Débito', href: '/dashboard', icon: FileText },
  { label: 'Extrato de pagamento', href: '/dashboard', icon: Receipt },
  {
    label: 'Extrato de parcelamento',
    href: '/dashboard',
    icon: FileSpreadsheet,
  },
  {
    label: 'Parcelamento',
    href: '/negociacao',
    icon: Archive,
    habilitado: true,
  },
  { label: 'Sair', href: '/', icon: LogOut, habilitado: true },
];

export default function SidebarNavegacao() {
  return (
    <aside className='flex shrink-0 flex-wrap gap-4 border-b border-line bg-white px-4 py-3 md:w-32 md:flex-col md:flex-nowrap md:items-center md:gap-6 md:border-r md:border-b-0 md:py-8'>
      {itens.map((item) => {
        const Icon = item.icon;
        const conteudo = (
          <>
            <span className='flex size-10 items-center justify-center rounded-full bg-sand'>
              <Icon size={20} />
            </span>
            <span className='text-[0.7rem] font-semibold'>{item.label}</span>
          </>
        );

        if (!item.habilitado) {
          return (
            <span
              key={item.label}
              aria-disabled='true'
              className='flex cursor-not-allowed items-center gap-2 text-center text-ink-soft/40 md:flex-col md:gap-2'
            >
              {conteudo}
            </span>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className='flex items-center gap-2 text-center text-ink-soft no-underline hover:text-orange md:flex-col md:gap-2'
          >
            {conteudo}
          </Link>
        );
      })}
    </aside>
  );
}
