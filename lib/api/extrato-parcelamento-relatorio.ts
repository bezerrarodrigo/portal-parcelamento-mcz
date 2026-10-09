import axios from 'axios';
import { internalApiClient } from '@/lib/http-client';
import { normalizarMensagens } from '@/lib/api/mensagens';

interface ArquivoApiResponse {
  mensagens?: unknown;
  imagem?: string;
  tipo?: string;
  nome?: string;
}

export interface RelatorioExtratoParcelamento {
  arquivo: Blob;
  nome: string;
}

export async function emitirRelatorioExtratoParcelamento(
  idContrato: string,
): Promise<RelatorioExtratoParcelamento> {
  let data: ArquivoApiResponse | null;

  try {
    const response = await internalApiClient.get<ArquivoApiResponse | null>(
      '/extrato-parcelamento/relatorio',
      { params: { idContrato }, timeout: 65000 },
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
      'Não foi possível emitir o extrato de parcelamento. Tente novamente.',
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
    nome: data.nome ?? 'Extrato de Parcelamento.pdf',
  };
}
