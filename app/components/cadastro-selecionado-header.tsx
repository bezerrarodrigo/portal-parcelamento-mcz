'use client';

import { useSyncExternalStore } from 'react';
import {
  interpretarCadastroSelecionado,
  obterValorCadastroSelecionado,
} from '@/lib/cadastro-selecionado';
import type { Cadastro } from '@/lib/mock-cadastros';

function assinarArmazenamento(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export default function CadastroSelecionadoHeader() {
  const valorCadastro = useSyncExternalStore(
    assinarArmazenamento,
    obterValorCadastroSelecionado,
    () => null,
  );
  const cadastro: Cadastro | null =
    interpretarCadastroSelecionado(valorCadastro);

  if (!cadastro) return null;

  return (
    <section
      aria-label='Cadastro selecionado'
      className='mb-6 border border-line bg-white p-4 md:p-5'
    >
      <h2 className='m-0 mb-3 text-sm font-bold text-ink'>
        Cadastro selecionado
      </h2>
      <dl className='m-0 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3'>
        <div>
          <dt className='text-xs text-ink-soft'>Nome/Razão social</dt>
          <dd className='m-0 font-semibold text-ink'>
            {cadastro.nomeRazaoSocial || '-'}
          </dd>
        </div>
        <div>
          <dt className='text-xs text-ink-soft'>Tipo de cadastro</dt>
          <dd className='m-0 font-semibold text-ink'>{cadastro.cadastro}</dd>
        </div>
        <div>
          <dt className='text-xs text-ink-soft'>CPF/CNPJ</dt>
          <dd className='m-0 font-semibold text-ink'>
            {cadastro.cpfCnpj || '-'}
          </dd>
        </div>
        <div>
          <dt className='text-xs text-ink-soft'>Inscrição municipal</dt>
          <dd className='m-0 font-semibold text-ink'>
            {cadastro.inscricaoMunicipal || '-'}
          </dd>
        </div>
        <div>
          <dt className='text-xs text-ink-soft'>Vínculo cadastral</dt>
          <dd className='m-0 font-semibold text-ink'>
            {cadastro.vinculoCadastral || '-'}
          </dd>
        </div>
        <div>
          <dt className='text-xs text-ink-soft'>Situação</dt>
          <dd className='m-0 font-semibold text-ink'>
            {cadastro.situacao || '-'}
          </dd>
        </div>
        <div className='sm:col-span-2 lg:col-span-3'>
          <dt className='text-xs text-ink-soft'>Endereço</dt>
          <dd className='m-0 font-semibold text-ink'>
            {cadastro.endereco || '-'}
          </dd>
        </div>
      </dl>
    </section>
  );
}
