'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  QUANTIDADE_MAXIMA_PARCELAS,
  QUANTIDADE_MINIMA_PARCELAS,
  chaveSimulacao,
  montarRequisicaoGuia,
  type DadosGuia,
} from '@/lib/api/guia-contrato';
import {
  simularParcelamentoApi,
  type ParcelamentoSimulado,
} from '@/lib/api/parcelamento-simulado';
import type { Debito } from '@/lib/mock-debitos';
import { simularParcelamento } from '@/lib/simulacao-parcelamento';
import { formatCurrency, formatDate, formatPercent } from '@/lib/formatters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VALOR_MINIMO_PARCELA = 0;

interface SimulacaoPanelProps {
  selecionados: Debito[];
  guia?: DadosGuia;
  valorEntrada: number;
  onValorEntradaChange: (valor: number) => void;
  onSimulada: (chave: string) => void;
  quantidadeParcelas: number;
  onQuantidadeParcelasChange: (valor: number) => void;
  resultadoVisivel: boolean;
  onResultadoVisivelChange: (valor: boolean) => void;
}

function formatarDataApi(valor: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(valor) ? formatDate(valor) : valor;
}

export default function SimulacaoPanel({
  selecionados,
  guia,
  valorEntrada,
  onValorEntradaChange,
  onSimulada,
  quantidadeParcelas,
  onQuantidadeParcelasChange,
  resultadoVisivel,
  onResultadoVisivelChange,
}: SimulacaoPanelProps) {
  const [simulando, setSimulando] = useState(false);
  const [simulacao, setSimulacao] = useState<{
    chave: string;
    dados: ParcelamentoSimulado;
  } | null>(null);

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

  const chaveAtual = chaveSimulacao({
    selecionados,
    quantidadeParcelas,
    valorEntrada,
  });
  const simulacaoAtual =
    simulacao?.chave === chaveAtual ? simulacao.dados : null;

  async function handleSimular() {
    if (!guia) {
      onResultadoVisivelChange(true);
      return;
    }

    const chave = chaveAtual;
    setSimulando(true);

    try {
      const dados = await simularParcelamentoApi(
        montarRequisicaoGuia({
          guia,
          selecionados,
          quantidadeParcelas,
          valorEntrada,
        }),
      );
      setSimulacao({ chave, dados });
      onSimulada(chave);
      onResultadoVisivelChange(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível simular o parcelamento. Tente novamente.',
      );
    } finally {
      setSimulando(false);
    }
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
              onValorEntradaChange(Number(event.target.value));
            }}
          />
        </div>
        <div className='flex flex-col gap-2.5 md:flex-row [&_button]:w-full md:[&_button]:w-auto'>
          <Button
            type='button'
            onClick={handleSimular}
            disabled={selecionados.length === 0 || simulando}
          >
            {simulando ? 'Simulando...' : 'Simular'}
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
        <p>
          Valor mínimo da parcela:{' '}
          {formatCurrency(
            guia?.regra.valorMinimoParcela ?? VALOR_MINIMO_PARCELA,
          )}
          .
        </p>
      </div>

      {guia && resultadoVisivel && simulacaoAtual && (
        <div className='border-t border-line pt-5 [&_h3]:m-0 [&_h3]:mb-2 [&_h3]:text-[1.05rem] [&_h3]:text-ink'>
          <h3>Parcelamento</h3>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse bg-white [&_td]:border-b [&_td]:border-line [&_td]:p-3 [&_td]:text-left [&_td]:text-[0.86rem] [&_th]:border-b [&_th]:border-line [&_th]:p-3 [&_th]:text-left [&_th]:text-[0.86rem]'>
              <thead>
                <tr>
                  <th>Condições</th>
                  <th>Vlr Lançado</th>
                  <th>Atualização monetária</th>
                  <th>Juros</th>
                  <th>Multa</th>
                  <th>Desconto</th>
                  <th>Honorário</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {simulacaoAtual.parcelasSimuladas.map((parcela) => (
                  <tr key={parcela.descricao}>
                    <td>{parcela.descricao}</td>
                    <td>{formatCurrency(parcela.valorLancado)}</td>
                    <td>{formatCurrency(parcela.valorAtualizacaoMonetaria)}</td>
                    <td>{formatCurrency(parcela.jurosMora)}</td>
                    <td>{formatCurrency(parcela.multaMora)}</td>
                    <td>{formatCurrency(parcela.desconto)}</td>
                    <td>{formatCurrency(parcela.honorario)}</td>
                    <td>{formatCurrency(parcela.valorTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-4 text-ink'>
            <span>
              <strong>1ª Parcela:</strong>{' '}
              {formatCurrency(simulacaoAtual.valorPrimeiraParcela)}
            </span>
            {simulacaoAtual.quantidadeParcelas > 1 && (
              <span>
                <strong>2ª Parcela:</strong>{' '}
                {formatCurrency(simulacaoAtual.valorSegundaParcela)}
              </span>
            )}
            {simulacaoAtual.quantidadeParcelas > 2 && (
              <span>
                <strong>Demais parcelas:</strong>{' '}
                {formatCurrency(simulacaoAtual.valorDemaisParcelas)}
              </span>
            )}
            <span>
              <strong>1º vencimento:</strong>{' '}
              {formatarDataApi(simulacaoAtual.dataPrimeiroVencimento)}
            </span>
            {simulacaoAtual.quantidadeParcelas > 1 && (
              <span>
                <strong>Último vencimento:</strong>{' '}
                {formatarDataApi(simulacaoAtual.dataUltimoVencimento)}
              </span>
            )}
          </div>
        </div>
      )}

      {!guia && resultadoVisivel && (
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
