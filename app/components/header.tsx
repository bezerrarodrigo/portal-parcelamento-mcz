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
    <header className='site-header'>
      <div className='page-shell header-inner'>
        <Link
          className='brand'
          href='/'
          aria-label='Portal de Serviços da Prefeitura de Maceió'
        >
          <Image
            src='/logoAtual.svg'
            alt='Brasão da Prefeitura de Maceió'
            width={52}
            height={52}
          />
          <span>
            <strong>Portal de Serviços</strong>
            <small>Prefeitura de Maceió</small>
          </span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className='mobile-menu-button'
              variant='outline'
              aria-label='Abrir menu'
            >
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className='mobile-sheet'>
            <SheetHeader>
              <SheetTitle>Navegação</SheetTitle>
              <SheetDescription>Acesse as áreas do portal.</SheetDescription>
            </SheetHeader>
            <div className='mobile-nav'>
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                className='button button-primary'
                href='/servicos/cidadao/guia'
              >
                Entrar no portal
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <nav className='desktop-nav' aria-label='Navegação principal'>
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className='header-cta' href='/servicos/cidadao/guia'>
          Acessar portal
        </Link>
      </div>
    </header>
  );
}
