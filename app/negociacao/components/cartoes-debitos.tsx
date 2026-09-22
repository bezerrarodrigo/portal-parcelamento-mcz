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
      <p className='debitos-empty'>
        Nenhum débito encontrado para os filtros selecionados.
      </p>
    );
  }

  return (
    <div className='debitos-cards'>
      {debitos.map((debito) => (
        <article className='debitos-card' key={debito.id}>
          <header className='debitos-card-header'>
            <label className='debitos-card-select'>
              <Checkbox
                checked={selecionados.has(debito.id)}
                onCheckedChange={() => onToggle(debito.id)}
                aria-label={`Selecionar débito ${debito.tributo} parcela ${debito.parcela}`}
              />
              <strong>{debito.tributo}</strong>
            </label>
            <span className='debitos-card-situacao'>{debito.situacao}</span>
          </header>
          <dl className='debitos-card-grid'>
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
