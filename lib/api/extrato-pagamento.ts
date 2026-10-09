import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface TributoPagamentoApi {
  id?: number | null;
  tipoTributo?: string | null;
  descricaoResumida?: string | null;
  descricaoReduzida?: string | null;
}

interface PagamentoExtratoApi {
  id: number;
  codigoLancamento?: number | string | null;
  numeroParcela?: number | null;
  tributo?: TributoPagamentoApi | null;
  dataPagamento?: string | number | null;
  anoExercicioLancamento?: string | number | null;
  valorPagar?: number | null;
  valorPago?: number | null;
  pagamentoVistaLancamento?: string | null;
  idDocumentoArrecadacao?: number | null;
  nossoNumero?: string | null;
  idCertidao?: number | null;
  numperoProcesso?: string | null;
  numeroProcesso?: string | null;
}

interface ExtratoPagamentoApiResponse {
  id?: number;
  pagamentos?: PagamentoExtratoApi[] | null;
  mensagens?: unknown;
}

export type PagamentoExtrato = PagamentoExtratoApi;

export interface FiltrosExtratoPagamento {
  anoExercicio?: string;
  idLancamento?: string;
  dataPagamentoIni?: number;
  dataPagamentoFim?: number;
  nossoNumero?: string;
  idDocumentoArrecadacao?: string;
  numeroProcessoExecucao?: string;
  idCertidao?: string;
}

export async function buscarExtratoPagamento(
  idCadastro: string,
  filtros: FiltrosExtratoPagamento,
): Promise<PagamentoExtrato[]> {
  try {
    const { data } =
      await internalApiClient.get<ExtratoPagamentoApiResponse | null>(
        '/extrato-pagamento',
        { params: { idCadastro, ...filtros } },
      );

    const mensagens = normalizarMensagens(data?.mensagens);
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }
    if (!data || !Array.isArray(data.pagamentos)) {
      throw new Error('A API não retornou a lista de pagamentos.');
    }

    return data.pagamentos;
  } catch (error) {
    const mensagens = axios.isAxiosError<ExtratoPagamentoApiResponse>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }

    if (
      axios.isAxiosError(error) &&
      (error.code === 'ECONNABORTED' || !error.response)
    ) {
      throw new Error(
        'Não foi possível conectar ao serviço de pagamentos. Tente novamente.',
      );
    }

    throw error;
  }
}
