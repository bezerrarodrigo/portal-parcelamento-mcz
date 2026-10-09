'use client';

import axios from 'axios';
import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  buscarExtratoParcelamento,
  type ContratoParcelamento,
} from '@/lib/api/extrato-parcelamento';
import { emitirRelatorioExtratoParcelamento } from '@/lib/api/extrato-parcelamento-relatorio';

const colunas = [
  'Selecione',
  'Contrato',
  'Data cálculo',
  'Data contrato',
  'Parcelas',
  'Valor',
  '1º vencimento',
  'Último vencimento',
];

interface ConsultaExtratoParcelamentoProps {
  idCadastro: string;
  voltarHref: string;
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
  return Number.isNaN(data.getTime())
    ? texto
    : data.toLocaleDateString('pt-BR');
}

function formatarValor(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-';
  const numero = Number(value);
  if (!Number.isFinite(numero)) return String(value);
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function eLongValido(valor: string): boolean {
  if (!/^\d{1,19}$/.test(valor)) return false;
  const normalizado = valor.replace(/^0+(?=\d)/, '');
  const limiteLong = '9223372036854775807';
  return (
    normalizado.length < limiteLong.length ||
    (normalizado.length === limiteLong.length &&
      normalizado <= limiteLong)
  );
}

function mensagemErroConsulta(error: unknown): string {
  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.mensagens === 'undefined'
  ) {
    return 'Não foi possível consultar os contratos. Tente novamente.';
  }
  return error instanceof Error
    ? error.message
    : 'Não foi possível consultar os contratos. Tente novamente.';
}

export default function ConsultaExtratoParcelamento({
  idCadastro,
  voltarHref,
}: ConsultaExtratoParcelamentoProps) {
  const [contratos, setContratos] = useState<ContratoParcelamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [contratoSelecionado, setContratoSelecionado] = useState<string | null>(
    null,
  );
  const [quantidadePorPagina, setQuantidadePorPagina] = useState(10);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [imprimindo, setImprimindo] = useState(false);
  const [urlPdf, setUrlPdf] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (urlPdf) URL.revokeObjectURL(urlPdf);
    },
    [urlPdf],
  );

  useEffect(() => {
    let consultaAtiva = true;

    void buscarExtratoParcelamento(idCadastro)
      .then((resultado) => {
        if (!consultaAtiva) return;
        setContratos(resultado);
      })
      .catch((error: unknown) => {
        if (!consultaAtiva) return;
        setErro(mensagemErroConsulta(error));
      })
      .finally(() => {
        if (consultaAtiva) setCarregando(false);
      });

    return () => {
      consultaAtiva = false;
    };
  }, [idCadastro]);

  const contratosFiltrados = useMemo(() => {
    const termo = filtro.trim().toLocaleLowerCase('pt-BR');
    if (!termo) return contratos;

    return contratos.filter((contrato) =>
      `${contrato.codigoContrato ?? ''} ${contrato.id ?? ''}`
        .toLocaleLowerCase('pt-BR')
        .includes(termo),
    );
  }, [contratos, filtro]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(contratosFiltrados.length / quantidadePorPagina),
  );
  const paginaSegura = Math.min(paginaAtual, totalPaginas);
  const inicioPagina = (paginaSegura - 1) * quantidadePorPagina;
  const contratosPagina = contratosFiltrados.slice(
    inicioPagina,
    inicioPagina + quantidadePorPagina,
  );

  function atualizarFiltro(value: string) {
    setFiltro(value);
    setPaginaAtual(1);
  }

  async function handleImprimir() {
    if (
      !contratoSelecionado ||
      !eLongValido(contratoSelecionado) ||
      imprimindo
    ) {
      return;
    }

    const janela = window.open('', '_blank');
    if (!janela) {
      toast.error('Permita a abertura de pop-ups para visualizar o extrato.');
      return;
    }

    janela.opener = null;
    janela.document.title = 'Preparando extrato de parcelamento...';
    setImprimindo(true);

    try {
      const relatorio =
        await emitirRelatorioExtratoParcelamento(contratoSelecionado);
      const novaUrlPdf = URL.createObjectURL(relatorio.arquivo);
      janela.location.href = novaUrlPdf;
      setUrlPdf(novaUrlPdf);
    } catch (error) {
      janela.close();
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível emitir o extrato de parcelamento. Tente novamente.',
      );
    } finally {
      setImprimindo(false);
    }
  }

  return (
    <>
      <label htmlFor='contrato' className='sr-only'>
        Contrato
      </label>
      <input
        id='contrato'
        type='search'
        value={filtro}
        onChange={(event) => atualizarFiltro(event.target.value)}
        placeholder='Contrato'
        className='mb-9 h-10 w-full max-w-60 rounded-sm border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
      />

      <div className='overflow-x-auto'>
        <table className='w-full min-w-[900px] border-collapse text-left text-xs text-ink'>
          <thead className='bg-[#e9ecef] text-ink-soft'>
            <tr>
              {colunas.map((coluna) => (
                <th
                  key={coluna}
                  scope='col'
                  className={`border border-line px-3 py-2 font-medium ${
                    coluna === 'Parcelas'
                      ? 'text-center'
                      : coluna === 'Valor'
                        ? 'text-right'
                        : ''
                  }`}
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
                  className='border border-line bg-[#f2f2f2] px-3 py-2'
                >
                  Consultando contratos...
                </td>
              </tr>
            ) : erro ? (
              <tr>
                <td
                  colSpan={colunas.length}
                  role='alert'
                  className='border border-line bg-[#f2f2f2] px-3 py-2 text-red-700'
                >
                  {erro}
                </td>
              </tr>
            ) : contratosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={colunas.length}
                  className='border border-line bg-[#f2f2f2] px-3 py-2'
                >
                  Não existem registros
                </td>
              </tr>
            ) : (
              contratosPagina.map((contrato, index) => {
                const contratoId = String(contrato.id ?? contrato.codigoContrato ?? index);
                const idContrato =
                  contrato.id === null || contrato.id === undefined
                    ? ''
                    : String(contrato.id);
                const codigoContrato =
                  contrato.codigoContrato ?? contrato.id ?? '-';

                return (
                  <tr
                    key={contratoId}
                    className='odd:bg-white even:bg-[#f2f2f2]'
                  >
                    <td className='border border-line px-3 py-2 text-center'>
                      <input
                        type='radio'
                        name='contrato-selecionado'
                        value={idContrato}
                        checked={contratoSelecionado === idContrato}
                        disabled={!eLongValido(idContrato)}
                        onChange={() => setContratoSelecionado(idContrato)}
                        aria-label={`Selecionar contrato ${codigoContrato}`}
                      />
                    </td>
                    <td className='border border-line px-3 py-2'>
                      {codigoContrato}
                    </td>
                    <td className='border border-line px-3 py-2'>
                      {formatarData(contrato.dataCalculo)}
                    </td>
                    <td className='border border-line px-3 py-2'>
                      {formatarData(contrato.dataContrato)}
                    </td>
                    <td className='border border-line px-3 py-2 text-center'>
                      {contrato.quantidadeParcelas ?? '-'}
                    </td>
                    <td className='border border-line px-3 py-2 text-right tabular-nums'>
                      {formatarValor(
                        contrato.valorRegraPagtoemDiaMaisHonorarios,
                      )}
                    </td>
                    <td className='border border-line px-3 py-2'>
                      {formatarData(contrato.dataPrimeiroVencimento)}
                    </td>
                    <td className='border border-line px-3 py-2'>
                      {formatarData(contrato.dataUltimoVencimento)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className='mt-1 flex items-center justify-center gap-6 text-sm text-ink'>
        {totalPaginas > 1 && (
          <button
            type='button'
            disabled={paginaSegura === 1}
            onClick={() => setPaginaAtual((pagina) => pagina - 1)}
            className='rounded border border-line bg-white px-2 py-1 disabled:opacity-50'
            aria-label='Página anterior'
          >
            Anterior
          </button>
        )}
        <span>
          ({paginaSegura} de {totalPaginas})
        </span>
        <label className='sr-only' htmlFor='registros-por-pagina'>
          Registros por página
        </label>
        <select
          id='registros-por-pagina'
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
            disabled={paginaSegura === totalPaginas}
            onClick={() => setPaginaAtual((pagina) => pagina + 1)}
            className='rounded border border-line bg-white px-2 py-1 disabled:opacity-50'
            aria-label='Próxima página'
          >
            Próxima
          </button>
        )}
      </div>

      <div className='mt-7 flex gap-3'>
        <Button asChild variant='outline'>
          <Link href={voltarHref}>Voltar</Link>
        </Button>
        <Button
          type='button'
          onClick={handleImprimir}
          disabled={!contratoSelecionado || imprimindo || carregando || !!erro}
        >
          {imprimindo && (
            <LoaderCircle size={16} className='animate-spin' aria-hidden='true' />
          )}
          {imprimindo ? 'Preparando...' : 'Imprimir'}
        </Button>
      </div>
    </>
  );
}
