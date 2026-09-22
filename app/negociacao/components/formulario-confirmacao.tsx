'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
  const [termosAbertos, setTermosAbertos] = useState(false);

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
      <div className='flex items-start gap-4 border border-line bg-white p-6 text-blue-deep'>
        <CheckCircle2 size={28} />
        <div>
          <strong>Solicitação registrada com sucesso.</strong>
          <p className='mt-1.5 text-[0.86rem] text-ink-soft'>
            Este é um protótipo — nenhuma solicitação real foi enviada. Em
            breve, esta etapa será integrada à API de parcelamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      className='grid gap-3.5 border border-line bg-white p-6'
      onSubmit={handleSubmit}
    >
      <div className='grid gap-1.5'>
        <label
          htmlFor='confirmacao-email'
          className='text-[0.76rem] font-extrabold text-ink'
        >
          E-mail*
        </label>
        <Input
          id='confirmacao-email'
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(erros.email)}
        />
        {erros.email && (
          <span className='text-[0.76rem] text-destructive'>{erros.email}</span>
        )}
      </div>
      <div className='grid gap-1.5'>
        <label
          htmlFor='confirmacao-telefone'
          className='text-[0.76rem] font-extrabold text-ink'
        >
          Telefone*
        </label>
        <Input
          id='confirmacao-telefone'
          type='tel'
          placeholder='Telefone'
          value={telefone}
          onChange={(event) => setTelefone(event.target.value)}
          aria-invalid={Boolean(erros.telefone)}
        />
        {erros.telefone && (
          <span className='text-[0.76rem] text-destructive'>
            {erros.telefone}
          </span>
        )}
      </div>
      <label className='flex items-center gap-2.5 text-[0.86rem] text-ink'>
        <Checkbox
          checked={aceitouTermos}
          onCheckedChange={(checked) => setAceitouTermos(checked === true)}
        />
        <button
          type='button'
          className='text-blue underline underline-offset-2 hover:text-blue-deep'
          onClick={() => setTermosAbertos(true)}
        >
          Concordo com os termos
        </button>
      </label>
      {erros.termos && (
        <span className='text-[0.76rem] text-destructive'>{erros.termos}</span>
      )}
      <Button type='submit' disabled={!podeEnviar}>
        Confirmar parcelamento
      </Button>

      <Dialog open={termosAbertos} onOpenChange={setTermosAbertos}>
        <DialogContent className='max-h-1/2 max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Termos do parcelamento</DialogTitle>
            <DialogDescription asChild>
              <div className='grid gap-3 text-left text-[0.86rem] text-ink'>
                <p>
                  Ao prosseguir com a adesão ao presente acordo, o contribuinte
                  acima identificado reconhece ser devedor do Município de Campo
                  Grande relativamente aos débitos por ele selecionados,
                  confessando-os de forma irrevogável e irretratável para todos
                  os fins de direito.
                </p>
                <ul className='list-disc pl-5'>
                  <li>
                    O contribuinte declara estar ciente de que a formalização
                    deste parcelamento ou pagamento à vista implica renúncia
                    expressa ao direito de discutir administrativa ou
                    judicialmente os débitos abrangidos pelo acordo, bem como
                    desistência de eventuais impugnações, defesas, recursos ou
                    ações já propostas, assumindo integral responsabilidade
                    pelos ônus decorrentes, nos termos do art. 90 da Lei Federal
                    n. 13.105/2015 (Código de Processo Civil).
                  </li>
                  <li>
                    O contribuinte solicita o parcelamento ou pagamento à vista
                    dos débitos constantes no demonstrativo vinculado a este
                    acordo, no quantitativo de parcelas selecionado, ficando
                    ciente de que as parcelas vincendas poderão sofrer
                    incidência de juros, multa e atualização monetária, conforme
                    previsto na Lei Complementar n. 129/2008 e demais normas
                    aplicáveis.
                  </li>
                  <li>
                    O contribuinte declara ciência de que o inadimplemento de
                    qualquer parcela por período superior a 60 (sessenta) dias
                    poderá implicar:
                    <ul className='list-disc pl-5'>
                      <li>o vencimento antecipado das parcelas vincendas;</li>
                      <li>rescisão automática do parcelamento;</li>
                      <li>a perda de eventuais benefícios concedidos;</li>
                      <li>
                        o prosseguimento das medidas administrativas e judiciais
                        cabíveis;
                      </li>
                      <li>
                        a inscrição ou manutenção do débito em Dívida Ativa e
                        eventual cobrança judicial.
                      </li>
                    </ul>
                  </li>
                  <li>
                    A adesão eletrônica ao presente termo possui validade
                    jurídica e eficácia de assinatura eletrônica, nos termos da
                    legislação aplicável, produzindo todos os efeitos legais
                    decorrentes.
                  </li>
                  <li>
                    O contribuinte reconhece, ainda, que a confissão da dívida
                    implica interrupção do prazo prescricional, bem como
                    suspensão de sua fluência enquanto o parcelamento estiver
                    regularmente sendo cumprido.
                  </li>
                  <li>
                    Por fim, o contribuinte autoriza expressamente o Município
                    de Campo Grande a realizar comunicações relacionadas a este
                    parcelamento ou a outros débitos municipais por meios
                    físicos ou eletrônicos, inclusive e-mail, SMS, telefone e
                    aplicativos de mensagens, como WhatsApp, utilizando os dados
                    constantes do cadastro municipal ou aqueles legitimamente
                    mantidos pela Administração Pública, observado o disposto na
                    Lei Geral de Proteção de Dados Pessoais (LGPD).
                  </li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </form>
  );
}
