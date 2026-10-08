import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import type { GuiaContratoRequest } from '@/lib/api/guia-contrato';
import { normalizarMensagens } from '@/lib/api/mensagens';

export interface ParcelaSimulada {
  descricao: string;
  valorLancado: number;
  valorAtualizacaoMonetaria: number;
  jurosMora: number;
  multaMora: number;
  desconto: number;
  honorario: number;
  valorTotal: number;
}

export interface ParcelamentoSimulado {
  idContrato?: number | null;
  dataPrimeiroVencimento: string;
  dataUltimoVencimento: string;
  valorPrimeiraParcela: number;
  valorSegundaParcela: number;
  valorDemaisParcelas: number;
  quantidadeParcelas: number;
  parcelasSimuladas: ParcelaSimulada[];
  mensagens?: unknown;
}

export async function simularParcelamentoApi(
  dados: GuiaContratoRequest,
): Promise<ParcelamentoSimulado> {
  let data: ParcelamentoSimulado;

  try {
    const response = await internalApiClient.post<ParcelamentoSimulado>(
      '/parcelamento/simular',
      dados,
      { timeout: 60000 },
    );
    data = response.data;
  } catch (error) {
    const mensagens = axios.isAxiosError<ParcelamentoSimulado>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }

    throw error;
  }

  const mensagens = normalizarMensagens(data.mensagens);
  if (mensagens.length) {
    throw new Error(mensagens.join(' '));
  }
  if (!data.parcelasSimuladas?.length) {
    throw new Error('A API não retornou a simulação do parcelamento.');
  }

  return data;
}
