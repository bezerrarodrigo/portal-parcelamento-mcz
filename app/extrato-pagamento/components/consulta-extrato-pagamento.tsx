'use client';

import axios from 'axios';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  buscarExtratoPagamento,
  type FiltrosExtratoPagamento,
  type PagamentoExtrato,
} from '@/lib/api/extrato-pagamento';

const colunas = [
  'Tributo',
  'Exercício',
  'Parcela',
  'Cód Lacto',
  'Data pagamento',
  'Valor a pagar',
  'Valor pago',
  'Pagamento à vista',
  'Nosso número',
  'Número do DAM',
  'Número do processo judicial',
  'Certidão de Dívida Ativa',
];

const classeCampo =
  'h-10 min-w-0 rounded-sm border border-line bg-white px-3 text-sm text-ink-soft outline-none placeholder:text-ink-soft focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/20';

interface ConsultaExtratoPagamentoProps {
  idCadastro: string;
}

function obterTimestamp(data: string, fimDoDia = false): number | undefined {
  if (!data) return undefined;

  const horario = fimDoDia ? 'T23:59:59.999' : 'T00:00:00';
  const timestamp = new Date(`${data}${horario}`).getTime();
  return Number.isNaN(timestamp) ? undefined : timestamp;
}

function formatarData(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-';

  const texto = String(value);
  const dataIso = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dataIso) return `${dataIso[3]}/${dataIso[2]}/${dataIso[1]}`;

  const timestamp =
    typeof value === 'string' && /^\d{10,13}$/.test(value)
      ? Number(value)
      : value;
  const data = new Date(timestamp);
  return Number.isNaN(data.getTime()) ? texto : data.toLocaleDateString('pt-BR');
}

function formatarValor(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarPagamentoVista(value: string | null | undefined): string {
  if (value === 'S') return 'Sim';
  if (value === 'N') return 'Não';
  return value || '-';
}

function mensagemErroConsulta(error: unknown): string {
  if (axios.isAxiosError(error) && typeof error.response?.data?.mensagens === 'undefined') {
    return 'Não foi possível consultar os pagamentos. Tente novamente.';
  }
  return error instanceof Error
    ? error.message
    : 'Não foi possível consultar os pagamentos. Tente novamente.';
}

export default function ConsultaExtratoPagamento({
  idCadastro,
}: ConsultaExtratoPagamentoProps) {
  const [pagamentos, setPagamentos] = useState<PagamentoExtrato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [quantidadePorPagina, setQuantidadePorPagina] = useState(10);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const sequenciaConsulta = useRef(0);

  const buscar = useCallback(
    (filtros: FiltrosExtratoPagamento) =>
      buscarExtratoPagamento(idCadastro, filtros),
    [idCadastro],
  );

  useEffect(() => {
    const consultaAtual = ++sequenciaConsulta.current;
    void buscar({})
      .then((resultado) => {
        if (consultaAtual !== sequenciaConsulta.current) return;
        setPagamentos(resultado);
        setPaginaAtual(1);
      })
      .catch((error: unknown) => {
        if (consultaAtual !== sequenciaConsulta.current) return;
        setPagamentos([]);
        setErro(mensagemErroConsulta(error));
      })
      .finally(() => {
        if (consultaAtual === sequenciaConsulta.current) {
          setCarregando(false);
        }
      });

    return () => {
      sequenciaConsulta.current += 1;
    };
  }, [buscar]);

  function handlePesquisar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    const valor = (nome: string) => String(dados.get(nome) ?? '').trim();
    const dataPagamentoIni = obterTimestamp(valor('dataPagamentoIni'));
    const dataPagamentoFim = obterTimestamp(valor('dataPagamentoFim'), true);
    const filtros: FiltrosExtratoPagamento = {
      anoExercicio: valor('anoExercicio') || undefined,
      idLancamento: valor('idLancamento') || undefined,
      dataPagamentoIni,
      dataPagamentoFim,
      nossoNumero: valor('nossoNumero') || undefined,
      idDocumentoArrecadacao: valor('idDocumentoArrecadacao') || undefined,
      numeroProcessoExecucao: valor('numeroProcessoExecucao') || undefined,
      idCertidao: valor('idCertidao') || undefined,
    };

    setCarregando(true);
    setErro(null);
    setPagamentos([]);
    const consultaAtual = ++sequenciaConsulta.current;
    void buscar(filtros)
      .then((resultado) => {
        if (consultaAtual !== sequenciaConsulta.current) return;
        setPagamentos(resultado);
        setPaginaAtual(1);
      })
      .catch((error: unknown) => {
        if (consultaAtual !== sequenciaConsulta.current) return;
        setPagamentos([]);
        setErro(mensagemErroConsulta(error));
      })
      .finally(() => {
        if (consultaAtual === sequenciaConsulta.current) {
          setCarregando(false);
        }
      });
  }

  const totalPaginas = Math.max(
    1,
    Math.ceil(pagamentos.length / quantidadePorPagina),
  );
  const inicioPagina = (paginaAtual - 1) * quantidadePorPagina;
  const pagamentosPagina = pagamentos.slice(
    inicioPagina,
    inicioPagina + quantidadePorPagina,
  );

  return (
    <>
      <form
        onSubmit={handlePesquisar}
        className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12'
      >
        <input
          aria-label='Exercício'
          name='anoExercicio'
          placeholder='Exercício'
          inputMode='numeric'
          maxLength={4}
          className={`${classeCampo} xl:col-span-2`}
        />
        <input
          aria-label='Lançamento'
          name='idLancamento'
          placeholder='Lançamento'
          inputMode='numeric'
          className={`${classeCampo} xl:col-span-3`}
        />
        <input
          aria-label='Data inicial'
          name='dataPagamentoIni'
          type='date'
          className={`${classeCampo} xl:col-span-3`}
        />
        <input
          aria-label='Data final'
          name='dataPagamentoFim'
          type='date'
          className={`${classeCampo} xl:col-span-3`}
        />
        <input
          aria-label='Nosso número'
          name='nossoNumero'
          placeholder='Nosso número'
          className={`${classeCampo} xl:col-span-3`}
        />
        <input
          aria-label='Número do DAM'
          name='idDocumentoArrecadacao'
          placeholder='Número do DAM'
          inputMode='numeric'
          className={`${classeCampo} xl:col-span-3`}
        />
        <input
          aria-label='Número do processo judicial'
          name='numeroProcessoExecucao'
          placeholder='Número do processo judicial'
          className={`${classeCampo} xl:col-span-3`}
        />
        <input
          aria-label='Certidão de Dívida Ativa'
          name='idCertidao'
          placeholder='Certidão de Dívida Ativa'
          inputMode='numeric'
          className={`${classeCampo} xl:col-span-3 xl:col-start-1`}
        />
        <div className='xl:col-span-2'>
          <Button
            type='submit'
            disabled={carregando}
            className='w-full bg-blue text-white hover:bg-blue-deep sm:w-auto'
          >
            {carregando ? 'Pesquisando...' : 'Pesquisar'}
          </Button>
        </div>
      </form>

      <div className='mt-9 overflow-x-auto border border-line'>
        <table className='w-full min-w-[1050px] table-fixed border-collapse text-[0.7rem] leading-tight text-ink'>
          <thead className='bg-[#e9edef] text-ink-soft'>
            <tr>
              {colunas.map((coluna) => (
                <th
                  key={coluna}
                  scope='col'
                  className='border border-line px-2 py-2 text-center font-medium'
                >
                  {coluna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td
                  colSpan={colunas.length}
                  role='status'
                  className='border border-line bg-[#f2f2f2] px-2 py-3 text-center'
                >
                  Consultando pagamentos...
                </td>
              </tr>
            ) : erro ? (
              <tr>
                <td
                  colSpan={colunas.length}
                  role='alert'
                  className='border border-line bg-[#f2f2f2] px-2 py-3 text-left text-red-700'
                >
                  {erro}
                </td>
              </tr>
            ) : pagamentos.length === 0 ? (
              <tr>
                <td
                  colSpan={colunas.length}
                  className='border border-line bg-[#f2f2f2] px-2 py-1.5 text-left'
                >
                  Não existem registros
                </td>
              </tr>
            ) : (
              pagamentosPagina.map((pagamento) => (
                <PagamentoLinha key={pagamento.id} pagamento={pagamento} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className='mt-1 flex items-center justify-center gap-6 text-sm text-ink'>
        {totalPaginas > 1 && (
          <button
            type='button'
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual((pagina) => pagina - 1)}
            className='rounded border border-line bg-white px-2 py-1 disabled:opacity-50'
            aria-label='Página anterior'
          >
            Anterior
          </button>
        )}
        <span>
          ({paginaAtual} de {totalPaginas})
        </span>
        <label className='sr-only' htmlFor='quantidade-registros'>
          Registros por página
        </label>
        <select
          id='quantidade-registros'
          value={quantidadePorPagina}
          onChange={(event) => {
            setQuantidadePorPagina(Number(event.target.value));
            setPaginaAtual(1);
          }}
          className='h-6 border border-line bg-white px-1 text-xs'
        >
          <option value='10'>10</option>
          <option value='25'>25</option>
          <option value='50'>50</option>
        </select>
        {totalPaginas > 1 && (
          <button
            type='button'
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual((pagina) => pagina + 1)}
            className='rounded border border-line bg-white px-2 py-1 disabled:opacity-50'
            aria-label='Próxima página'
          >
            Próxima
          </button>
        )}
      </div>
    </>
  );
}

function PagamentoLinha({ pagamento }: { pagamento: PagamentoExtrato }) {
  const exercicio = pagamento.anoExercicioLancamento
    ? String(pagamento.anoExercicioLancamento).slice(0, 4)
    : '-';

  return (
    <tr className='odd:bg-white even:bg-[#f2f2f2]'>
      <td className='border border-line px-2 py-1.5'>
        {pagamento.tributo?.descricaoResumida ??
          pagamento.tributo?.descricaoReduzida ??
          pagamento.tributo?.tipoTributo ??
          '-'}
      </td>
      <td className='border border-line px-2 py-1.5 text-center'>
        {exercicio}
      </td>
      <td className='border border-line px-2 py-1.5 text-center'>
        {pagamento.numeroParcela ?? '-'}
      </td>
      <td className='border border-line px-2 py-1.5'>
        {pagamento.codigoLancamento ?? '-'}
      </td>
      <td className='border border-line px-2 py-1.5 text-center'>
        {formatarData(pagamento.dataPagamento)}
      </td>
      <td className='border border-line px-2 py-1.5 text-right tabular-nums'>
        {formatarValor(pagamento.valorPagar)}
      </td>
      <td className='border border-line px-2 py-1.5 text-right tabular-nums'>
        {formatarValor(pagamento.valorPago)}
      </td>
      <td className='border border-line px-2 py-1.5 text-center'>
        {formatarPagamentoVista(pagamento.pagamentoVistaLancamento)}
      </td>
      <td className='border border-line px-2 py-1.5'>
        {pagamento.nossoNumero ?? '-'}
      </td>
      <td className='border border-line px-2 py-1.5'>
        {pagamento.idDocumentoArrecadacao ?? '-'}
      </td>
      <td className='border border-line px-2 py-1.5'>
        {pagamento.numperoProcesso ?? pagamento.numeroProcesso ?? '-'}
      </td>
      <td className='border border-line px-2 py-1.5'>
        {pagamento.idCertidao ?? '-'}
      </td>
    </tr>
  );
}
