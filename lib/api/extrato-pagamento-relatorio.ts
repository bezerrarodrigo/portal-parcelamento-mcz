import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface ArquivoApiResponse {
  mensagens?: unknown;
  imagem?: string;
  tipo?: string;
  nome?: string;
}

export interface FiltrosRelatorioExtratoPagamento {
  anoExercicio?: string;
  idLancamento?: string;
  dataPagamentoIni?: number;
  dataPagamentoFim?: number;
}

export interface RelatorioExtratoPagamento {
  arquivo: Blob;
  nome: string;
}

export async function emitirRelatorioExtratoPagamento(
  idCadastro: string,
  filtros: FiltrosRelatorioExtratoPagamento,
): Promise<RelatorioExtratoPagamento> {
  let data: ArquivoApiResponse | null;

  try {
    const response = await internalApiClient.get<ArquivoApiResponse | null>(
      '/extrato-pagamento/relatorio',
      {
        params: { idCadastro, ...filtros },
        timeout: 65000,
      },
    );
    data = response.data;
  } catch (error) {
    const mensagens = axios.isAxiosError<ArquivoApiResponse>(error)
      ? normalizarMensagens(error.response?.data?.mensagens)
      : [];
    if (mensagens.length) {
      throw new Error(mensagens.join(' '));
    }

    throw new Error(
      'Não foi possível emitir o extrato de pagamentos. Tente novamente.',
    );
  }

  const mensagens = normalizarMensagens(data?.mensagens);
  if (mensagens.length) {
    throw new Error(mensagens.join(' '));
  }
  if (!data?.imagem) {
    throw new Error('A API não retornou o arquivo PDF do extrato.');
  }

  const bytes = Uint8Array.from(atob(data.imagem), (caractere) =>
    caractere.charCodeAt(0),
  );

  return {
    arquivo: new Blob([bytes], { type: data.tipo ?? 'application/pdf' }),
    nome: data.nome ?? 'Extrato de Pagamentos.pdf',
  };
}
