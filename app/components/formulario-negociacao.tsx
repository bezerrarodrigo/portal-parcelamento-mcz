'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LockKeyhole } from 'lucide-react';

interface FormularioNegociacaoProps {
  mode: 'vista' | 'parcelado';
}

export default function FormularioNegociacao({
  mode,
}: FormularioNegociacaoProps) {
  const isVista = mode === 'vista';
  const router = useRouter();
  const [cadastro, setCadastro] = useState('cpf-cnpj');
  const [inscricao, setInscricao] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Fluxo de pagamento à vista ainda não integrado neste protótipo.
    if (isVista) {
      return;
    }

    const params = new URLSearchParams({
      cadastro,
      inscricao,
      mode,
    });
    router.push(`/negociacao?${params.toString()}`);
  }

  const fieldClass =
    'w-full min-h-[43px] rounded-[3px] border border-[#cbd8dd] bg-[#fbfcfc] px-3 font-inherit text-[0.85rem] text-ink placeholder:text-[#8999a3] focus:border-blue focus:outline-[3px] focus:outline-[rgba(7,89,133,0.15)]';

  return (
    <form
      className='mt-6 grid gap-3.5 border-t border-line pt-5.5'
      onSubmit={handleSubmit}
    >
      <div className='grid gap-1.5'>
        <label
          htmlFor={`${mode}-cadastro`}
          className='text-[0.76rem] font-extrabold text-ink'
        >
          Cadastro
        </label>
        <select
          id={`${mode}-cadastro`}
          name='cadastro'
          value={cadastro}
          onChange={(event) => setCadastro(event.target.value)}
          className={`${fieldClass} cursor-pointer`}
        >
          <option value='cpf-cnpj'>CPF/CNPJ</option>
          <option value='imovel'>Imóvel</option>
          <option value='empresa-autonomo'>Empresa/Autônomo</option>
        </select>
      </div>
      <div className='grid gap-1.5'>
        <label
          htmlFor={`${mode}-inscricao`}
          className='text-[0.76rem] font-extrabold text-ink'
        >
          Inscrição municipal
        </label>
        <input
          id={`${mode}-inscricao`}
          name='inscricao'
          placeholder='Digite sua inscrição'
          inputMode='numeric'
          autoComplete='off'
          value={inscricao}
          onChange={(event) => setInscricao(event.target.value)}
          className={fieldClass}
        />
      </div>
      <button
        type='submit'
        className='mt-0.5 inline-flex min-h-[43px] items-center justify-center gap-2 rounded-[3px] border-0 bg-blue px-4 text-[0.84rem] font-extrabold text-white transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-blue-deep focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#f6b65b]'
      >
        Acessar {isVista ? 'pagamento à vista' : 'parcelamento'}
        <ArrowRight size={16} />
      </button>
      <p className='m-0! flex items-center gap-1.5 text-[0.72rem] leading-[1.4]! text-[#788b95]!'>
        <LockKeyhole size={13} />
        Acesso seguro. A integração estará disponível em breve.
      </p>
    </form>
  );
}
