'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const navigation = [
  { label: 'Início', href: '/' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Como funciona', href: '/#como-funciona' },
  {
    label: 'Legislação',
    href: 'https://www.maceio.al.gov.br/legislacao',
    external: true,
  },
];

export default function Header() {
  return (
    <header className='relative z-10 border-b border-line bg-white/[0.94]'>
      <div className='mx-auto flex min-h-[82px] w-[min(1120px,calc(100%-48px))] items-center gap-9'>
        <Link
          className='mr-auto flex items-center gap-3 no-underline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
          href='/'
          aria-label='Portal de Serviços da Prefeitura de Maceió'
        >
          <Image
            src='/logoAtual.svg'
            alt='Brasão da Prefeitura de Maceió'
            width={52}
            height={52}
            className='h-12 w-12 object-contain'
          />
          <span>
            <strong className='block text-base tracking-[0.01em] text-blue-deep'>
              Portal de Serviços
            </strong>
            <small className='mt-0.5 block text-[0.72rem] text-ink-soft'>
              Prefeitura de Maceió
            </small>
          </span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className='border-line text-blue md:hidden'
              variant='outline'
              aria-label='Abrir menu'
            >
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className='bg-sand'>
            <SheetHeader>
              <SheetTitle>Navegação</SheetTitle>
              <SheetDescription>Acesse as áreas do portal.</SheetDescription>
            </SheetHeader>
            <div className='flex flex-col gap-2 p-6'>
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className='border-b border-line py-3.5 font-semibold text-inherit no-underline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
                >
                  {item.label}
                </Link>
              ))}
              <Link
                className='mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded border-0 bg-orange px-4.5 text-[0.84rem] font-bold text-white no-underline transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-[#cf5f21] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
                href='/servicos/cidadao/guia'
              >
                Entrar no portal
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <nav
          className='hidden items-center gap-6 text-[0.86rem] text-ink-soft md:flex'
          aria-label='Navegação principal'
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className='text-inherit no-underline transition-colors duration-200 hover:text-orange focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          className='hidden min-h-11 items-center justify-center gap-2 rounded bg-orange px-4.5 text-[0.84rem] font-bold text-white no-underline transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-[#cf5f21] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b] md:inline-flex'
          href='/servicos/cidadao/guia'
        >
          Acessar portal
        </Link>
      </div>
    </header>
  );
}
