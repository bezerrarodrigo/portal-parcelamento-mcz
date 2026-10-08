'use client';

import { Suspense } from 'react';
import {
  User,
  FileText,
  Receipt,
  FileSpreadsheet,
  Archive,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

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
  {
    label: 'Guia / Extrato Débito',
    href: '/guia-extrato-debito',
    icon: FileText,
    habilitado: true,
  },
  { label: 'Extrato de pagamento', href: '/dashboard', icon: Receipt },
  {
    label: 'Extrato de parcelamento',
    href: '/dashboard',
    icon: FileSpreadsheet,
  },
  {
    label: 'Parcelamento',
    href: '/parcelamento',
    icon: Archive,
    habilitado: true,
  },
  { label: 'Sair', href: '/', icon: LogOut, habilitado: true },
];

export default function SidebarNavegacao() {
  return (
    <Suspense fallback={null}>
      <ConteudoSidebarNavegacao />
    </Suspense>
  );
}

function ConteudoSidebarNavegacao() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parametrosParcelamento = new URLSearchParams();
  const idCadastro = searchParams.get('id');
  const inscricao = searchParams.get('inscricao');

  if (idCadastro) {
    parametrosParcelamento.set('id', idCadastro);
  }
  if (inscricao) {
    parametrosParcelamento.set('inscricao', inscricao);
  }

  const hrefParcelamento = parametrosParcelamento.size
    ? `/parcelamento?${parametrosParcelamento.toString()}`
    : '/parcelamento';
  const hrefExtratoDebito = parametrosParcelamento.size
    ? `/guia-extrato-debito?${parametrosParcelamento.toString()}`
    : '/guia-extrato-debito';

  return (
    <aside className='flex shrink-0 flex-wrap gap-4 border-b border-line bg-white px-4 py-3 md:w-32 md:flex-col md:flex-nowrap md:items-center md:gap-6 md:border-r md:border-b-0 md:py-8'>
      {itens.map((item) => {
        const Icon = item.icon;
        const ativo = item.habilitado && pathname === item.href;
        const href =
          item.href === '/parcelamento'
            ? hrefParcelamento
            : item.href === '/guia-extrato-debito'
              ? hrefExtratoDebito
              : item.href;
        const conteudo = (
          <>
            <span
              className={cn(
                'flex size-10 items-center justify-center rounded-full bg-sand',
                ativo && 'bg-orange text-white',
              )}
            >
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
            href={href}
            aria-current={ativo ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 text-center text-ink-soft no-underline hover:text-orange md:flex-col md:gap-2',
              ativo && 'text-orange',
            )}
          >
            {conteudo}
          </Link>
        );
      })}
    </aside>
  );
}
