'use client';

import { MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-[#102f46] text-[#d7e4e9]'>
      <div className='mx-auto grid w-[min(1120px,calc(100%-48px))] grid-cols-1 gap-8.5 pt-14.5 pb-13 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)]'>
        <div>
          <Image
            src='/logoAtual.svg'
            alt='Brasão da Prefeitura de Maceió'
            height={64}
            width={64}
            className='mb-4 h-[54px] w-[54px] object-contain grayscale brightness-0 invert'
          />
          <strong className='block text-base text-white'>
            Portal de Serviços
          </strong>
          <p className='text-[0.84rem] leading-[1.65] text-[#a9c0cb]'>
            Prefeitura de Maceió
            <br />
            Secretaria Municipal de Fazenda
          </p>
        </div>
        <div className='flex flex-col gap-2.5'>
          <h3 className='mb-1 text-[0.8rem] tracking-[0.08em] text-white uppercase'>
            Atendimento
          </h3>
          <p className='flex items-start gap-2 text-[0.84rem]'>
            <MapPin size={17} /> Rua Sá e Albuquerque, 235
            <br />
            Jaraguá, Maceió - AL
          </p>
          <p className='flex items-start gap-2 text-[0.84rem]'>
            <Phone size={17} /> (82) 3312-5860
          </p>
        </div>
        <div className='flex flex-col gap-2.5'>
          <h3 className='mb-1 text-[0.8rem] tracking-[0.08em] text-white uppercase'>
            Links úteis
          </h3>
          <a
            href='https://www.maceio.al.gov.br/secretarias-e-orgaos/sefaz'
            target='_blank'
            rel='noreferrer'
            className='flex items-start gap-2 text-[0.84rem] text-inherit no-underline hover:text-white focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
          >
            SEFAZ Maceió
          </a>
          <a
            href='https://www.maceio.al.gov.br/'
            target='_blank'
            rel='noreferrer'
            className='flex items-start gap-2 text-[0.84rem] text-inherit no-underline hover:text-white focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
          >
            Portal da Prefeitura
          </a>
          <Link
            href='/#como-funciona'
            className='flex items-start gap-2 text-[0.84rem] text-inherit no-underline hover:text-white focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
          >
            Como funciona
          </Link>
        </div>
        <div className='flex flex-col gap-2.5'>
          <h3 className='mb-1 text-[0.8rem] tracking-[0.08em] text-white uppercase'>
            Ajuda
          </h3>
          <a
            href='mailto:atendimento@sefaz.maceio.al.gov.br'
            className='flex items-start gap-2 text-[0.84rem] text-inherit no-underline hover:text-white focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
          >
            Fale conosco
          </a>
          <Link
            href='/servicos/cidadao/guia'
            className='flex items-start gap-2 text-[0.84rem] text-inherit no-underline hover:text-white focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
          >
            Solicitar acesso
          </Link>
          <Link
            href='/servicos/cidadao/guia'
            className='flex items-start gap-2 text-[0.84rem] text-inherit no-underline hover:text-white focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
          >
            Acessar portal
          </Link>
        </div>
      </div>
      <div className='border-t border-white/[0.12] px-6 py-4.5 text-center text-[0.75rem] text-[#a9c0cb]'>
        © {new Date().getFullYear()} Prefeitura de Maceió. Todos os direitos
        reservados. Desenvolvido por DSF - Inteligência Fiscal.
      </div>
    </footer>
  );
}
