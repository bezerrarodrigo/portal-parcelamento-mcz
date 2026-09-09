'use client';

import { Separator } from '@/components/ui/separator';
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  MapPinIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from '@phosphor-icons/react';
import { Phone } from 'lucide-react';
import Image from 'next/image';

const yearNow = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className='bg-orange-500 text-white'>
      <div className='max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 items-start'>
        {/* Logo */}
        <div className='flex items-center justify-center md:justify-start'>
          <Image
            src='/logoAtual.svg'
            alt='Brasão da Prefeitura de Maceió'
            height={60}
            width={160}
            className='opacity-90'
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
        {/* Endereço */}
        <div className='space-y-2 '>
          <h3 className='text-sm font-semibold uppercase tracking-wider text-white/80'>
            Atendimento
          </h3>
          <div className='flex items-start gap-2 text-sm text-white/90'>
            <MapPinIcon
              className='mt-0.5 shrink-0'
              size={16}
              weight='regular'
            />
            <span>
              Rua Sá e Albuquerque, 235, Jaraguá, CEP 57022-180
              <br />
              Maceió – AL
            </span>
          </div>
        </div>

        {/* Contatos */}
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold uppercase tracking-wider text-white/80'>
            Contato
          </h3>
          <ul className='space-y-2 text-sm text-white/90'>
            <li className='flex gap-2'>
              <Phone size={16} />
              (82) 3312-5860
            </li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold uppercase tracking-wider text-white/80'>
            Redes Sociais
          </h3>
          <div className='flex items-center gap-4'>
            <a
              href='https://www.facebook.com/PrefeituraDeMaceio'
              target='_blank'
              rel='noreferrer'
              aria-label='Facebook da Prefeitura de Maceió'
              className='hover:text-white text-white/90 transition-colors'
            >
              <FacebookLogoIcon size={22} />
            </a>
            <a
              href='https://www.instagram.com/prefeiturademaceio/'
              target='_blank'
              rel='noreferrer'
              aria-label='Instagram da Prefeitura de Maceió'
              className='hover:text-white text-white/90 transition-colors'
            >
              <InstagramLogoIcon size={22} />
            </a>
            <a
              href='https://twitter.com/prefmaceio'
              target='_blank'
              rel='noreferrer'
              aria-label='Twitter da Prefeitura de Maceió'
              className='hover:text-white text-white/90 transition-colors'
            >
              <XLogoIcon size={22} />
            </a>
            <a
              href='https://www.youtube.com/prefeiturademaceio'
              target='_blank'
              rel='noreferrer'
              aria-label='YouTube da Prefeitura de Maceió'
              className='hover:text-white text-white/90 transition-colors'
            >
              <YoutubeLogoIcon size={22} />
            </a>
          </div>
        </div>
      </div>

      <Separator className='bg-white/20' />

      <div className='py-4 px-6 text-center bg-sky-900 text-xs text-white'>
        © {yearNow} Prefeitura de Maceió. Todos os direitos reservados.{' '}
        Desenvolvido por DSF – Inteligência Tributária Municipal.
      </div>
    </footer>
  );
}
