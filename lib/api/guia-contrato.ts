import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import type { Debito } from '@/lib/mock-debitos';

export const QUANTIDADE_MINIMA_PARCELAS = 1;
export const QUANTIDADE_MAXIMA_PARCELAS = 12;

export interface RegraGuia {
  id: number;
  nome: string;
  quantidadeParcelas?: number | null;
  valorMinimoParcela?: number | null;
  percentualMinimoEntrada?: number | null;
}

// Dados da regra escolhida usados para montar a requisição de guia/contrato.
// As parcelas ficam no formato original da API (ParcelaCreditoTributarioCalculadaRS),
// indexadas pelo id do Debito exibido na tela.
export interface DadosGuia {
  aVista: boolean;
  regra: RegraGuia;
  parcelasPorDebito: Record<string, unknown>;
}

export interface GuiaContratoRequest {
  aVista: boolean;
  valorEntrada: number;
  percentualEntrada: number | null;
  dataContrato: string;
  dataCalculo: string;
  quantidadeParcelasParcelamento: number;
  regraParcelamento: RegraGuia;
  parcelasCalculadas: unknown[];
}

interface ParametrosGuia {
  guia: DadosGuia;
  selecionados: Debito[];
  quantidadeParcelas: number;
  valorEntrada: number;
}

// Identifica os parâmetros usados na simulação; o resultado só vale enquanto eles não mudarem.
export function chaveSimulacao({
  selecionados,
  quantidadeParcelas,
  valorEntrada,
}: Omit<ParametrosGuia, 'guia'>): string {
  return JSON.stringify([
    selecionados.map((debito) => debito.id),
    quantidadeParcelas,
    valorEntrada,
  ]);
}

function formatarDataIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export function montarRequisicaoGuia({
  guia,
  selecionados,
  quantidadeParcelas,
  valorEntrada,
}: ParametrosGuia): GuiaContratoRequest {
  if (
    !Number.isInteger(quantidadeParcelas) ||
    quantidadeParcelas < QUANTIDADE_MINIMA_PARCELAS ||
    quantidadeParcelas > QUANTIDADE_MAXIMA_PARCELAS
  ) {
    throw new Error(
      `Informe de ${QUANTIDADE_MINIMA_PARCELAS} a ${QUANTIDADE_MAXIMA_PARCELAS} parcelas.`,
    );
  }

  const hoje = formatarDataIso(new Date());
  return {
    aVista: guia.aVista,
    valorEntrada,
    percentualEntrada: null,
    dataContrato: hoje,
    dataCalculo: hoje,
    quantidadeParcelasParcelamento: quantidadeParcelas,
    regraParcelamento: guia.regra,
    parcelasCalculadas: selecionados.map(
      (debito) => guia.parcelasPorDebito[debito.id],
    ),
  };
}

interface ArquivoResponse {
  mensagens?: string[];
  imagem?: string;
  tipo?: string;
  nome?: string;
  linkPagamento?: string | null;
}

export interface GuiaContrato {
  arquivo: Blob;
  nome: string;
  linkPagamento: string | null;
}

export async function gerarGuiaContrato(
  dados: GuiaContratoRequest,
): Promise<GuiaContrato> {
  let data: ArquivoResponse;

  try {
    const response = await internalApiClient.post<ArquivoResponse>(
      '/parcelamento/guiaContrato',
      dados,
      { timeout: 60000 },
    );
    data = response.data;
  } catch (error) {
    if (
      axios.isAxiosError<ArquivoResponse>(error) &&
      error.response?.data?.mensagens?.length
    ) {
      throw new Error(error.response.data.mensagens.join(' '));
    }

    throw error;
  }

  if (data.mensagens?.length) {
    throw new Error(data.mensagens.join(' '));
  }
  if (!data.imagem) {
    throw new Error('A API não retornou o arquivo da guia e do contrato.');
  }

  const bytes = Uint8Array.from(atob(data.imagem), (caractere) =>
    caractere.charCodeAt(0),
  );

  return {
    arquivo: new Blob([bytes], { type: data.tipo ?? 'application/pdf' }),
    nome: data.nome ?? 'Guia Dam e Contrato.pdf',
    linkPagamento: data.linkPagamento || null,
  };
}
