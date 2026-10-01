'use client';

import type { Cadastro } from '@/lib/mock-cadastros';
import { cn } from '@/lib/utils';

interface CardCadastroProps {
  cadastro: Cadastro;
  selecionado: boolean;
  onSelecionar: (id: string) => void;
}

export default function CardCadastro({
  cadastro,
  selecionado,
  onSelecionar,
}: CardCadastroProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer flex-col gap-2 border border-line bg-white p-4',
        selecionado && 'border-blue ring-1 ring-blue',
      )}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <input
            type='radio'
            name='cadastro-selecionado-mobile'
            checked={selecionado}
            onChange={() => onSelecionar(cadastro.id)}
            aria-label={`Selecionar cadastro ${cadastro.nomeRazaoSocial}`}
            className='size-4 accent-blue'
          />
          <span className='text-[0.78rem] font-extrabold text-ink'>
            {cadastro.cadastro}
          </span>
        </div>
        <span className='rounded-full bg-sand px-2.5 py-1 text-[0.7rem] font-bold text-ink-soft'>
          {cadastro.situacao}
        </span>
      </div>

      <p className='m-0 text-[0.92rem] font-bold text-ink'>
        {cadastro.nomeRazaoSocial}
      </p>

      <dl className='m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[0.82rem] text-ink-soft'>
        <dt className='font-semibold text-ink'>CPF/CNPJ</dt>
        <dd className='m-0'>{cadastro.cpfCnpj ?? '-'}</dd>

        <dt className='font-semibold text-ink'>Insc. municipal</dt>
        <dd className='m-0'>{cadastro.inscricaoMunicipal}</dd>

        <dt className='font-semibold text-ink'>Endereço</dt>
        <dd className='m-0'>{cadastro.endereco}</dd>

        <dt className='font-semibold text-ink'>Vínculo cadastral</dt>
        <dd className='m-0'>{cadastro.vinculoCadastral}</dd>
      </dl>
    </label>
  );
}
