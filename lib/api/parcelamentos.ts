import axios from 'axios';
import { apiClient } from '@/lib/http-client';
import type { Debito } from '@/lib/mock-debitos';

interface ParcelaPermitidaApi {
  id: number;
  numero: number;
  identificacao?: string | null;
  situacaoExtrato?: string | null;
  dataVencimento?: number | string | null;
  valorLancado?: number | null;
  valorLancadoMoeda?: number | null;
  valorAtualizacaoMonetaria?: number | null;
  jurosMultaDesconto?: number | null;
  honorario?: number | null;
  valorTotal?: number | null;
  lancamentoCreditoTributarioRS?: {
    anoExercicio?: number | string | null;
    numeroAutoInfracao?: number | string | null;
    tributo?: {
      descricaoResumida?: string | null;
      descricaoReduzida?: string | null;
    } | null;
  } | null;
}

interface RegraParcelamentoApi {
  id: number;
  nome: string;
  quantidadeParcelas?: number | null;
  parcelasPermitidas?: ParcelaPermitidaApi[] | null;
}

interface ExtratoPorRegraResponse {
  mensagens?: string[];
  extratoDebito?: {
    mensagens?: string[];
  };
  regrasParcelamento?: RegraParcelamentoApi[];
}

export interface OpcaoParcelamento {
  id: string;
  nome: string;
  mode: 'vista' | 'parcelado' | null;
  quantidadeParcelas: number;
  valores: {
    lancado: number;
    atualizado: number;
    jurosMultaDesconto: number;
    honorario: number;
    total: number;
  };
  parcelas: Debito[];
}

const IDS_REGRAS_PARCELAMENTO = '626,627,628,629,630,631';

function somarValores(
  parcelas: ParcelaPermitidaApi[],
  obterValor: (parcela: ParcelaPermitidaApi) => number | null | undefined,
): number {
  const totalEmCentavos = parcelas.reduce((total, parcela) => {
    const valor = obterValor(parcela) ?? 0;
    return total + Math.round(valor * 100);
  }, 0);

  return totalEmCentavos / 100;
}

function identificarMode(nome: string): OpcaoParcelamento['mode'] {
  const nomeNormalizado = nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (nomeNormalizado.includes('a vista')) {
    return 'vista';
  }
  if (nomeNormalizado.includes('parcelado')) {
    return 'parcelado';
  }

  return null;
}

function converterData(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const timestamp =
    typeof value === 'string' && /^\d{10,13}$/.test(value)
      ? Number(value)
      : value;
  const data = new Date(timestamp);
  return Number.isNaN(data.getTime()) ? '' : data.toISOString().slice(0, 10);
}

function converterExercicio(
  value: number | string | null | undefined,
): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const numero = Number(value);
  if (!Number.isFinite(numero)) {
    return 0;
  }

  return numero > 9999
    ? new Date(numero).getUTCFullYear()
    : numero;
}

function mapearParcela(
  parcela: ParcelaPermitidaApi,
  idRegra: number,
): Debito {
  const credito = parcela.lancamentoCreditoTributarioRS;
  const tributo = credito?.tributo;

  return {
    id: `${idRegra}-${parcela.id}`,
    tributo:
      tributo?.descricaoResumida ??
      tributo?.descricaoReduzida ??
      'Débito municipal',
    exercicio: converterExercicio(credito?.anoExercicio),
    parcela: parcela.numero,
    codLacto: parcela.identificacao ?? String(parcela.id),
    vencimento: converterData(parcela.dataVencimento),
    valorLancado: parcela.valorLancadoMoeda ?? parcela.valorLancado ?? 0,
    valorAtualizado: parcela.valorAtualizacaoMonetaria ?? 0,
    jurosMultaDesconto: parcela.jurosMultaDesconto ?? 0,
    honorario: parcela.honorario ?? 0,
    total: parcela.valorTotal ?? 0,
    atrasoDias: null,
    situacao: parcela.situacaoExtrato ?? '',
    numeroAutoInfracao:
      credito?.numeroAutoInfracao === null ||
      credito?.numeroAutoInfracao === undefined
        ? null
        : String(credito.numeroAutoInfracao),
  };
}

function mapearRegra(regra: RegraParcelamentoApi): OpcaoParcelamento {
  const parcelas = regra.parcelasPermitidas ?? [];

  return {
    id: String(regra.id),
    nome: regra.nome,
    mode: identificarMode(regra.nome),
    quantidadeParcelas: regra.quantidadeParcelas ?? 0,
    valores: {
      lancado: somarValores(
        parcelas,
        (parcela) => parcela.valorLancadoMoeda ?? parcela.valorLancado,
      ),
      atualizado: somarValores(
        parcelas,
        (parcela) => parcela.valorAtualizacaoMonetaria,
      ),
      jurosMultaDesconto: somarValores(
        parcelas,
        (parcela) => parcela.jurosMultaDesconto,
      ),
      honorario: somarValores(parcelas, (parcela) => parcela.honorario),
      total: somarValores(parcelas, (parcela) => parcela.valorTotal),
    },
    parcelas: parcelas.map((parcela) => mapearParcela(parcela, regra.id)),
  };
}

export async function obterOpcoesParcelamento(
  idCadastro: string,
): Promise<OpcaoParcelamento[]> {
  if (!/^\d+$/.test(idCadastro)) {
    throw new Error('O identificador do cadastro é inválido.');
  }

  try {
    const { data } = await apiClient.get<ExtratoPorRegraResponse>(
      '/parcelamento/extratoPorRegra',
      {
        params: {
          idCadastro,
          LISTA_IDS_REGRA_PARCELAMENTO: IDS_REGRAS_PARCELAMENTO,
          unificaParcelamento: 'S',
        },
      },
    );

    const mensagens = [
      ...(data.mensagens ?? []),
      ...(data.extratoDebito?.mensagens ?? []),
    ];
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }

    if (!data.regrasParcelamento) {
      throw new Error('A API não retornou as regras de parcelamento.');
    }

    const opcoes = data.regrasParcelamento.map(mapearRegra);
    if (opcoes.length === 0) {
      throw new Error('Não há opções de parcelamento disponíveis para este cadastro.');
    }

    return opcoes;
  } catch (error) {
    if (axios.isAxiosError<ExtratoPorRegraResponse>(error)) {
      const mensagens = [
        ...(error.response?.data?.mensagens ?? []),
        ...(error.response?.data?.extratoDebito?.mensagens ?? []),
      ];
      if (mensagens.length) {
        throw new Error(mensagens.join(' '));
      }
    }

    throw error;
  }
}
