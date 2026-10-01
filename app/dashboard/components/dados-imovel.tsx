'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Cadastro } from '@/lib/mock-cadastros';

interface DadosImovelProps {
  cadastro: Cadastro;
}

export default function DadosImovel({ cadastro }: DadosImovelProps) {
  const [visivel, setVisivel] = useState(true);

  return (
    <section className='border border-line bg-white'>
      <header className='flex items-center justify-between bg-gray-100 px-4 py-2.5'>
        <h2 className='m-0 text-[0.86rem] font-bold text-ink'>
          Dados {cadastro.cadastro}
        </h2>
        <button
          type='button'
          onClick={() => setVisivel((atual) => !atual)}
          className='text-[0.8rem] font-semibold text-blue hover:text-orange'
        >
          {visivel ? 'Ocultar' : 'Mostrar'}
        </button>
      </header>

      {visivel && (
        <div className='p-4'>
          <div className='border border-line p-4 text-[0.86rem] text-ink'>
            <p className='m-0'>
              Inscrição municipal: {cadastro.inscricaoMunicipal}
            </p>
            <p className='m-0'>Vínculo: {cadastro.vinculoCadastral}</p>

            <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
              <Button
                type='button'
                className='w-full bg-gray-500 hover:bg-gray-600 sm:w-auto'
              >
                Imprimir Ficha
              </Button>
              <Button
                type='button'
                className='w-full bg-gray-500 hover:bg-gray-600 sm:w-auto'
              >
                Imprimir Certidão
              </Button>
            </div>

            <hr className='my-4 border-line' />

            <p className='m-0 font-semibold'>{cadastro.nomeRazaoSocial}</p>
            <p className='mt-3 mb-0'>Endereço: {cadastro.endereco}</p>
          </div>
        </div>
      )}
    </section>
  );
}
