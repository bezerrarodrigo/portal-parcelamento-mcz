import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface ContratoParcelamentoApi {
  id?: number | string | null;
  codigoContrato?: string | null;
  dataCalculo?: string | number | null;
  dataContrato?: string | number | null;
  dataPrimeiroVencimento?: string | number | null;
  dataUltimoVencimento?: string | number | null;
  quantidadeParcelas?: number | null;
  valorRegraPagtoemDiaMaisHonorarios?: number | string | null;
}

interface ExtratoParcelamentoApiResponse {
  contratos?: ContratoParcelamentoApi[] | null;
  parcelamentos?: ContratoParcelamentoApi[] | null;
  mensagens?: unknown;
}

export type ContratoParcelamento = ContratoParcelamentoApi;

export async function buscarExtratoParcelamento(
  idCadastro: string,
  idContrato?: string,
): Promise<ContratoParcelamento[]> {
  if (!eLongValido(idCadastro)) {
    throw new Error('O identificador do cadastro é inválido.');
  }
  if (idContrato && !eLongValido(idContrato)) {
    throw new Error('O identificador do contrato é inválido.');
  }

  try {
    const { data } =
      await internalApiClient.get<ExtratoParcelamentoApiResponse | null>(
        '/extrato-parcelamento',
        { params: { idCadastro, ...(idContrato ? { idContrato } : {}) } },
      );

    const mensagens = normalizarMensagens(data?.mensagens);
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }

    const contratos = Array.isArray(data?.contratos)
      ? data.contratos
      : Array.isArray(data?.parcelamentos)
        ? data.parcelamentos
        : null;

    if (!contratos) {
      throw new Error('A API não retornou a lista de contratos.');
    }

    return contratos;
  } catch (error) {
    const mensagens = axios.isAxiosError<ExtratoParcelamentoApiResponse>(error)
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
        'Não foi possível conectar ao serviço de parcelamentos. Tente novamente.',
      );
    }

    throw error;
  }
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
