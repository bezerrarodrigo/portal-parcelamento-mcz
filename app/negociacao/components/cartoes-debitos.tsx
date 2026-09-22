'use client';

import type { Debito } from '@/lib/mock-debitos';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Checkbox } from '@/components/ui/checkbox';

interface CartoesDebitosProps {
  debitos: Debito[];
  selecionados: Set<string>;
  onToggle: (id: string) => void;
}

export default function CartoesDebitos({
  debitos,
  selecionados,
  onToggle,
}: CartoesDebitosProps) {
  if (debitos.length === 0) {
    return (
      <p className='p-6 text-center text-ink-soft'>
        Nenhum débito encontrado para os filtros selecionados.
      </p>
    );
  }

  return (
    <div className='grid gap-3.5'>
      {debitos.map((debito) => (
        <article className='border border-line bg-white p-4.5' key={debito.id}>
          <header className='mb-3 flex items-center justify-between border-b border-line pb-3'>
            <label className='flex items-center gap-2.5 text-ink'>
              <Checkbox
                checked={selecionados.has(debito.id)}
                onCheckedChange={() => onToggle(debito.id)}
                aria-label={`Selecionar débito ${debito.tributo} parcela ${debito.parcela}`}
              />
              <strong>{debito.tributo}</strong>
            </label>
            <span className='rounded-[3px] bg-sand px-2 py-0.5 text-[0.76rem] font-extrabold text-blue-deep'>
              {debito.situacao}
            </span>
          </header>
          <dl className='m-0 grid grid-cols-2 gap-3 [&_dt]:text-[0.72rem] [&_dt]:tracking-[0.04em] [&_dt]:text-ink-soft [&_dt]:uppercase [&_dd]:mt-0.5 [&_dd]:text-[0.9rem] [&_dd]:text-ink'>
            <div>
              <dt>Exercício</dt>
              <dd>{debito.exercicio}</dd>
            </div>
            <div>
              <dt>Parcela</dt>
              <dd>{debito.parcela}</dd>
            </div>
            <div>
              <dt>Cód. Lacto</dt>
              <dd>{debito.codLacto}</dd>
            </div>
            <div>
              <dt>Vencimento</dt>
              <dd>{formatDate(debito.vencimento)}</dd>
            </div>
            <div>
              <dt>Vlr Lançado</dt>
              <dd>{formatCurrency(debito.valorLancado)}</dd>
            </div>
            <div>
              <dt>Vlr Atualizado</dt>
              <dd>{formatCurrency(debito.valorAtualizado)}</dd>
            </div>
            <div>
              <dt>Jur/Mul/Desc</dt>
              <dd>{formatCurrency(debito.jurosMultaDesconto)}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatCurrency(debito.total)}</dd>
            </div>
            <div>
              <dt>Atraso (dias)</dt>
              <dd>{debito.atrasoDias ?? '-'}</dd>
            </div>
            <div>
              <dt>Nº Auto de Infração</dt>
              <dd>{debito.numeroAutoInfracao ?? '-'}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
