import axios from 'axios';
import { apiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface ParcelaCalculadaApi {
  id: number;
  numero: number;
  identificacao: string;
  situacaoExtrato?: string | null;
  dataVencimento?: number | null;
  valorLancadoMoeda?: number | null;
  valorAtualizacaoMonetaria?: number | null;
  jurosMultaDesconto?: number | null;
  honorario?: number | null;
  valorTotal?: number | null;
  lancamentoCreditoTributarioRS?: {
    anoExercicio?: number | null;
    numeroAutoInfracao?: number | string | null;
    tributo?: {
      descricaoResumida?: string | null;
    } | null;
  } | null;
}

interface LegendaApi {
  descricaoResumida: string;
  descricaoReduzida: string;
}

interface ExtratoDebitoApiResponse {
  mensagens?: unknown;
  dataCalculo?: number | null;
  quantidadeGuiasDevido?: number | null;
  totalEmolumentoDevido?: number | null;
  totalLancadoMoedaDevido?: number | null;
  totalAtualizadoDevido?: number | null;
  totalJurosMultaDescontoDevido?: number | null;
  totalHonorarioDevido?: number | null;
  totalGeralDevido?: number | null;
  legendasSE?: LegendaApi[] | null;
  parcelasCalculadas?: ParcelaCalculadaApi[] | null;
}

export interface ParcelaExtratoDebito {
  id: string;
  tributo: string;
  exercicio: number | null;
  parcela: number;
  codigoLancamento: string;
  vencimento: string;
  valorLancado: number;
  valorAtualizado: number;
  jurosMultaDesconto: number;
  honorario: number;
  total: number;
  atrasoDias: number | null;
  situacao: string;
  numeroAutoInfracao: string | null;
}

export interface ExtratoDebito {
  parcelas: ParcelaExtratoDebito[];
  legendas: LegendaApi[];
  totais: {
    quantidadeGuias: number;
    emolumento: number;
    lancado: number;
    atualizado: number;
    jurosMultaDesconto: number;
    honorario: number;
    total: number;
  };
}

function converterData(value: number | null | undefined): string {
  if (!value) return '';
  const data = new Date(value);
  return Number.isNaN(data.getTime()) ? '' : data.toISOString().slice(0, 10);
}

function converterExercicio(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return value > 9999 ? new Date(value).getUTCFullYear() : value;
}

function somar(
  parcelas: ParcelaCalculadaApi[],
  campo: keyof Pick<
    ParcelaCalculadaApi,
    | 'valorLancadoMoeda'
    | 'valorAtualizacaoMonetaria'
    | 'jurosMultaDesconto'
    | 'honorario'
    | 'valorTotal'
  >,
): number {
  return parcelas.reduce((total, parcela) => total + (parcela[campo] ?? 0), 0);
}

function mapearParcela(
  parcela: ParcelaCalculadaApi,
  dataCalculo?: number | null,
): ParcelaExtratoDebito {
  const vencimento = converterData(parcela.dataVencimento);
  const dataVencimento = vencimento
    ? new Date(`${vencimento}T00:00:00Z`)
    : null;
  const diasAtraso =
    dataCalculo && dataVencimento
      ? Math.floor((dataCalculo - dataVencimento.getTime()) / 86_400_000)
      : 0;
  const numeroAutoInfracao =
    parcela.lancamentoCreditoTributarioRS?.numeroAutoInfracao;

  return {
    id: String(parcela.id),
    tributo:
      parcela.lancamentoCreditoTributarioRS?.tributo?.descricaoResumida ??
      'Débito municipal',
    exercicio: converterExercicio(
      parcela.lancamentoCreditoTributarioRS?.anoExercicio,
    ),
    parcela: parcela.numero,
    codigoLancamento: parcela.identificacao,
    vencimento,
    valorLancado: parcela.valorLancadoMoeda ?? 0,
    valorAtualizado: parcela.valorAtualizacaoMonetaria ?? 0,
    jurosMultaDesconto: parcela.jurosMultaDesconto ?? 0,
    honorario: parcela.honorario ?? 0,
    total: parcela.valorTotal ?? 0,
    atrasoDias: diasAtraso > 0 ? diasAtraso : null,
    situacao: parcela.situacaoExtrato ?? '',
    numeroAutoInfracao:
      numeroAutoInfracao === null || numeroAutoInfracao === undefined
        ? null
        : String(numeroAutoInfracao),
  };
}

export async function obterExtratoDebito(
  idCadastro: string,
): Promise<ExtratoDebito> {
  if (!/^\d+$/.test(idCadastro)) {
    throw new Error('O identificador do cadastro é inválido.');
  }

  try {
    const { data } = await apiClient.get<ExtratoDebitoApiResponse>(
      '/extratodebito',
      { params: { idCadastro } },
    );

    const mensagens = normalizarMensagens(data.mensagens);
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }

    const parcelasApi = data.parcelasCalculadas ?? [];
    const parcelas = parcelasApi.map((parcela) =>
      mapearParcela(parcela, data.dataCalculo),
    );

    return {
      parcelas,
      legendas: data.legendasSE ?? [],
      totais: {
        quantidadeGuias: data.quantidadeGuiasDevido ?? 0,
        emolumento: data.totalEmolumentoDevido ?? 0,
        lancado:
          data.totalLancadoMoedaDevido ??
          somar(parcelasApi, 'valorLancadoMoeda'),
        atualizado:
          data.totalAtualizadoDevido ??
          somar(parcelasApi, 'valorAtualizacaoMonetaria'),
        jurosMultaDesconto:
          data.totalJurosMultaDescontoDevido ??
          somar(parcelasApi, 'jurosMultaDesconto'),
        honorario: data.totalHonorarioDevido ?? somar(parcelasApi, 'honorario'),
        total: data.totalGeralDevido ?? somar(parcelasApi, 'valorTotal'),
      },
    };
  } catch (error) {
    const mensagens = axios.isAxiosError<ExtratoDebitoApiResponse>(error)
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
        'Não foi possível conectar ao serviço de débitos. Tente novamente.',
      );
    }

    throw error;
  }
}
