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

  return (
    <form className='negotiation-form' onSubmit={handleSubmit}>
      <div className='form-field'>
        <label htmlFor={`${mode}-cadastro`}>Cadastro</label>
        <select
          id={`${mode}-cadastro`}
          name='cadastro'
          value={cadastro}
          onChange={(event) => setCadastro(event.target.value)}
        >
          <option value='cpf-cnpj'>CPF/CNPJ</option>
          <option value='imovel'>Imóvel</option>
          <option value='empresa-autonomo'>Empresa/Autônomo</option>
        </select>
      </div>
      <div className='form-field'>
        <label htmlFor={`${mode}-inscricao`}>Inscrição municipal</label>
        <input
          id={`${mode}-inscricao`}
          name='inscricao'
          placeholder='Digite sua inscrição'
          inputMode='numeric'
          autoComplete='off'
          value={inscricao}
          onChange={(event) => setInscricao(event.target.value)}
        />
      </div>
      <button type='submit' className='form-submit'>
        Acessar {isVista ? 'pagamento à vista' : 'parcelamento'}
        <ArrowRight size={16} />
      </button>
      <p className='form-helper'>
        <LockKeyhole size={13} />
        Acesso seguro. A integração estará disponível em breve.
      </p>
    </form>
  );
}
