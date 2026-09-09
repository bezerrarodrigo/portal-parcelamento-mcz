'use client';

import { ArrowRight, LockKeyhole } from 'lucide-react';

interface FormularioNegociacaoProps {
  mode: 'vista' | 'parcelado';
}

export default function FormularioNegociacao({
  mode,
}: FormularioNegociacaoProps) {
  const isVista = mode === 'vista';

  return (
    <form
      className='negotiation-form'
      onSubmit={(event) => event.preventDefault()}
    >
      <div className='form-field'>
        <label htmlFor={`${mode}-cadastro`}>Cadastro</label>
        <select id={`${mode}-cadastro`} name='cadastro' defaultValue='cpf-cnpj'>
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
