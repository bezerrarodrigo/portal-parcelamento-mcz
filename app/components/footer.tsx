'use client';

import { Separator } from '@/components/ui/separator';
import { MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className='site-footer'>
      <div className='page-shell footer-grid'>
        <div className='footer-brand'>
          <Image
            src='/logoAtual.svg'
            alt='Brasão da Prefeitura de Maceió'
            height={64}
            width={64}
          />
          <strong>Portal de Serviços</strong>
          <p>
            Prefeitura de Maceió
            <br />
            Secretaria Municipal de Fazenda
          </p>
        </div>
        <div className='footer-column'>
          <h3>Atendimento</h3>
          <p>
            <MapPin size={17} /> Rua Sá e Albuquerque, 235
            <br />
            Jaraguá, Maceió - AL
          </p>
          <p>
            <Phone size={17} /> (82) 3312-5860
          </p>
        </div>
        <div className='footer-column'>
          <h3>Links úteis</h3>
          <a
            href='https://www.maceio.al.gov.br/secretarias-e-orgaos/sefaz'
            target='_blank'
            rel='noreferrer'
          >
            SEFAZ Maceió
          </a>
          <a
            href='https://www.maceio.al.gov.br/'
            target='_blank'
            rel='noreferrer'
          >
            Portal da Prefeitura
          </a>
          <a href='/#como-funciona'>Como funciona</a>
        </div>
        <div className='footer-column'>
          <h3>Ajuda</h3>
          <a href='mailto:atendimento@sefaz.maceio.al.gov.br'>Fale conosco</a>
          <a href='/servicos/cidadao/guia'>Solicitar acesso</a>
          <a href='/servicos/cidadao/guia'>Acessar portal</a>
        </div>
      </div>
      <div className='footer-bottom'>
        © {new Date().getFullYear()} Prefeitura de Maceió. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
