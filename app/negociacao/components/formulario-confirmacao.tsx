'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface FormularioConfirmacaoProps {
  podeEnviar: boolean;
}

interface Erros {
  email?: string;
  telefone?: string;
  termos?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FormularioConfirmacao({
  podeEnviar,
}: FormularioConfirmacaoProps) {
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novosErros: Erros = {};
    if (!EMAIL_REGEX.test(email)) {
      novosErros.email = 'Informe um e-mail válido.';
    }
    if (telefone.trim().length < 10) {
      novosErros.telefone = 'Informe um telefone válido.';
    }
    if (!aceitouTermos) {
      novosErros.termos = 'É necessário concordar com os termos.';
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      // Envio mockado: a integração com a API de parcelamento será feita futuramente.
      setEnviado(true);
    }
  }

  if (enviado) {
    return (
      <div className='confirmacao-panel confirmacao-sucesso'>
        <CheckCircle2 size={28} />
        <div>
          <strong>Solicitação registrada com sucesso.</strong>
          <p>
            Este é um protótipo — nenhuma solicitação real foi enviada. Em
            breve, esta etapa será integrada à API de parcelamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      className='confirmacao-panel negotiation-form'
      onSubmit={handleSubmit}
    >
      <div className='form-field'>
        <label htmlFor='confirmacao-email'>E-mail*</label>
        <Input
          id='confirmacao-email'
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(erros.email)}
        />
        {erros.email && <span className='form-error'>{erros.email}</span>}
      </div>
      <div className='form-field'>
        <label htmlFor='confirmacao-telefone'>Telefone*</label>
        <Input
          id='confirmacao-telefone'
          type='tel'
          placeholder='Telefone'
          value={telefone}
          onChange={(event) => setTelefone(event.target.value)}
          aria-invalid={Boolean(erros.telefone)}
        />
        {erros.telefone && <span className='form-error'>{erros.telefone}</span>}
      </div>
      <label className='confirmacao-termos'>
        <Checkbox
          checked={aceitouTermos}
          onCheckedChange={(checked) => setAceitouTermos(checked === true)}
        />
        Concordo com estes termos*
      </label>
      {erros.termos && <span className='form-error'>{erros.termos}</span>}
      <Button type='submit' disabled={!podeEnviar}>
        Confirmar parcelamento
      </Button>
    </form>
  );
}
