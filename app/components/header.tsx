'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

export default function Hero() {
  return (
    <header className='border-b border-orange-400 py-4 bg-gray-50'>
      <div className='flex h-16 items-center justify-between gap-6 px-6'>
        <Image
          src='/logoAtual.svg'
          alt='Brasão'
          width={80}
          height={80}
          style={{ marginLeft: 10 }}
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button className='lg:hidden mr-auto' variant='outline'>
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side='bottom'>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Principais serviços</SheetDescription>
            </SheetHeader>
            <div className='p-4 space-y-6'>
              <Link
                href='https://cartadeservicos.campogrande.ms.gov.br'
                target='_blank'
                rel='noreferrer'
              >
                Inicial
              </Link>
              <Separator className='mt-2' />
              <Link
                href='https://maceio.al.gov.br/secretarias-e-orgaos/sefaz'
                target='_blank'
                rel='noreferrer'
              >
                SEFAZ
              </Link>
              <Separator className='mt-2' />
              <Link
                href='https://leis.org/prefeitura/al/maceio'
                target='_blank'
                rel='noreferrer'
              >
                Leis Municipais
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <nav className='hidden gap-8 lg:flex'>
          <Link
            href='https://cartadeservicos.campogrande.ms.gov.br'
            target='_blank'
            rel='noreferrer'
          >
            Inicial
          </Link>
          <Separator style={{ height: 24 }} orientation='vertical' />
          <Link
            href='https://maceio.al.gov.br/secretarias-e-orgaos/sefaz'
            target='_blank'
            rel='noreferrer'
          >
            SEFAZ
          </Link>
          <Separator style={{ height: 24 }} orientation='vertical' />
          <Link
            href='https://leis.org/prefeitura/al/maceio'
            target='_blank'
            rel='noreferrer'
          >
            Leis Municipais
          </Link>
        </nav>
        <Button className='cursor-pointer rounded-md px-4 font-light bg-sky-800'>
          Entrar
        </Button>
      </div>
    </header>
  );
}
