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
}

export default function SimulacaoPanel({ selecionados }: SimulacaoPanelProps) {
  const [quantidadeParcelas, setQuantidadeParcelas] = useState(1);
  const [valorEntrada, setValorEntrada] = useState(0);
  const [resultadoVisivel, setResultadoVisivel] = useState(false);

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
    setResultadoVisivel(true);
  }

  return (
    <div className='simulacao-panel'>
      <div className='simulacao-inputs'>
        <div className='form-field'>
          <label htmlFor='quantidade-parcelas'>Quantidade de parcelas</label>
          <Input
            id='quantidade-parcelas'
            type='number'
            min={QUANTIDADE_MINIMA_PARCELAS}
            max={QUANTIDADE_MAXIMA_PARCELAS}
            value={quantidadeParcelas}
            onChange={(event) => {
              setResultadoVisivel(false);
              setQuantidadeParcelas(Number(event.target.value));
            }}
          />
        </div>
        <div className='form-field'>
          <label htmlFor='valor-entrada'>Valor da entrada (R$)</label>
          <Input
            id='valor-entrada'
            type='number'
            min={0}
            step='0.01'
            value={valorEntrada}
            onChange={(event) => {
              setResultadoVisivel(false);
              setValorEntrada(Number(event.target.value));
            }}
          />
        </div>
        <div className='simulacao-actions'>
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

      <div className='simulacao-condicoes'>
        <h3>Condições parcelamento</h3>
        <p>
          Quantidade de parcelas: {QUANTIDADE_MINIMA_PARCELAS} a{' '}
          {QUANTIDADE_MAXIMA_PARCELAS}.
        </p>
        <p>Valor mínimo da parcela: {formatCurrency(VALOR_MINIMO_PARCELA)}.</p>
      </div>

      {resultadoVisivel && (
        <div className='simulacao-resultado'>
          <h3>Parcelamento</h3>
          <table>
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

          <div className='simulacao-parcelas'>
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
