'use client';

import { useState } from 'react';
import type { Debito } from '@/lib/mock-debitos';
import { simularParcelamento } from '@/lib/simulacao-parcelamento';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const QUANTIDADE_MINIMA_PARCELAS = 1;
const QUANTIDADE_MAXIMA_PARCELAS = 12;
const VALOR_MINIMO_PARCELA = 0;

interface SimulacaoPanelProps {
  selecionados: Debito[];
  quantidadeParcelas: number;
  onQuantidadeParcelasChange: (valor: number) => void;
  resultadoVisivel: boolean;
  onResultadoVisivelChange: (valor: boolean) => void;
}

export default function SimulacaoPanel({
  selecionados,
  quantidadeParcelas,
  onQuantidadeParcelasChange,
  resultadoVisivel,
  onResultadoVisivelChange,
}: SimulacaoPanelProps) {
  const [valorEntrada, setValorEntrada] = useState(0);

  const valorLancadoSelecionado = selecionados.reduce(
    (total, debito) => total + debito.valorLancado,
    0,
  );
  const valorAtualizadoSelecionado = selecionados.reduce(
    (total, debito) => total + debito.valorAtualizado,
    0,
  );

  const resultado = simularParcelamento({
    valorLancadoSelecionado,
    valorAtualizadoSelecionado,
    quantidadeParcelas,
    valorEntrada,
  });

  function handleSimular() {
    onResultadoVisivelChange(true);
  }

  return (
    <div className='grid gap-5 border border-line bg-white p-6'>
      <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))_auto]'>
        <div className='grid gap-1.5'>
          <label
            htmlFor='quantidade-parcelas'
            className='text-[0.76rem] font-extrabold text-ink'
          >
            Quantidade de parcelas
          </label>
          <Input
            id='quantidade-parcelas'
            type='number'
            min={QUANTIDADE_MINIMA_PARCELAS}
            max={QUANTIDADE_MAXIMA_PARCELAS}
            value={quantidadeParcelas}
            onChange={(event) => {
              onResultadoVisivelChange(false);
              onQuantidadeParcelasChange(Number(event.target.value));
            }}
          />
        </div>
        <div className='grid gap-1.5'>
          <label
            htmlFor='valor-entrada'
            className='text-[0.76rem] font-extrabold text-ink'
          >
            Valor da entrada (R$)
          </label>
          <Input
            id='valor-entrada'
            type='number'
            min={0}
            step='0.01'
            value={valorEntrada}
            onChange={(event) => {
              onResultadoVisivelChange(false);
              setValorEntrada(Number(event.target.value));
            }}
          />
        </div>
        <div className='flex flex-col gap-2.5 md:flex-row [&_button]:w-full md:[&_button]:w-auto'>
          <Button
            type='button'
            onClick={handleSimular}
            disabled={selecionados.length === 0}
          >
            Simular
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => window.print()}
          >
            Imprimir
          </Button>
        </div>
      </div>

      <div className='[&_h3]:m-0 [&_h3]:mb-2 [&_h3]:text-[1.05rem] [&_h3]:text-ink [&_p]:my-0.5 [&_p]:text-[0.86rem] [&_p]:text-ink-soft'>
        <h3>Condições parcelamento</h3>
        <p>
          Quantidade de parcelas: {QUANTIDADE_MINIMA_PARCELAS} a{' '}
          {QUANTIDADE_MAXIMA_PARCELAS}.
        </p>
        <p>Valor mínimo da parcela: {formatCurrency(VALOR_MINIMO_PARCELA)}.</p>
      </div>

      {resultadoVisivel && (
        <div className='border-t border-line pt-5 [&_h3]:m-0 [&_h3]:mb-2 [&_h3]:text-[1.05rem] [&_h3]:text-ink'>
          <h3>Parcelamento</h3>
          <table className='w-full border-collapse bg-white [&_td]:border-b [&_td]:border-line [&_td]:p-3 [&_td]:text-left [&_td]:text-[0.86rem] [&_th]:border-b [&_th]:border-line [&_th]:p-3 [&_th]:text-left [&_th]:text-[0.86rem]'>
            <thead>
              <tr>
                <th>Condições</th>
                <th>Vlr Lançado</th>
                <th>Vlr Atualizado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Selecionado</td>
                <td>{formatCurrency(valorLancadoSelecionado)}</td>
                <td>{formatCurrency(valorAtualizadoSelecionado)}</td>
              </tr>
              <tr>
                <td>Descontos</td>
                <td>{formatCurrency(resultado.valorDescontoLancado)}</td>
                <td>{formatCurrency(resultado.valorDescontoAtualizado)}</td>
              </tr>
              <tr>
                <td>Descontos %</td>
                <td>{formatPercent(resultado.descontoPercentLancado)}</td>
                <td>{formatPercent(resultado.descontoPercentAtualizado)}</td>
              </tr>
              <tr>
                <td>Valor a parcelar</td>
                <td>{formatCurrency(resultado.valorAParcelarLancado)}</td>
                <td>{formatCurrency(resultado.valorAParcelarAtualizado)}</td>
              </tr>
            </tbody>
          </table>

          <div className='mt-4 flex flex-wrap gap-6 border-t border-line pt-4 text-ink'>
            <span>
              <strong>1ª Parcela:</strong>{' '}
              {formatCurrency(resultado.primeiraParcela)}
            </span>
            <span>
              <strong>Demais parcelas:</strong>{' '}
              {formatCurrency(resultado.demaisParcelas)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
